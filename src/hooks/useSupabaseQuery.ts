import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSupabaseQuery<T>(
  key: string[],
  tableName: string,
  select?: string,
  filters?: Record<string, any>
) {
  return useQuery<T[]>({
    queryKey: key,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    queryFn: async () => {
      try {
        let query = supabase
          .from(tableName)
          .select(select || '*')

        if (filters) {
          Object.entries(filters).forEach(([column, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(column, value)
            }
          })
        }

        const { data, error } = await query

        if (error) {
          console.error(`Query error for ${tableName}:`, error)
          throw error
        }
        
        return data || []
      } catch (error) {
        console.error(`Failed to fetch ${tableName}:`, error)
        throw error
      }
    },
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error?.message?.includes('JWT') || error?.message?.includes('permission')) {
        return false
      }
      // Retry network errors up to 2 times
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  })
}

export function useSupabaseMutation<T>(
  tableName: string,
  invalidateQueries?: string[][]
) {
  const queryClient = useQueryClient()

  const insertMutation = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      invalidateQueries?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      invalidateQueries?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      invalidateQueries?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })

  return {
    insert: insertMutation,
    update: updateMutation,
    delete: deleteMutation,
  }
}