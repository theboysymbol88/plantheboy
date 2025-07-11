import { useState, useEffect } from 'react'
import { supabase, type User } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const initAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...')
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error('Session error:', sessionError.message)
          setError(`Authentication error: ${sessionError.message}`)
          setLoading(false)
          return
        }

        console.log('Session status:', session ? '✅ Found' : '❌ None')
        setSession(session)
        setError(null)
        
        if (session?.user) {
          console.log('👤 User found:', session.user.email)
          await fetchUserProfile(session.user.id)
        } else {
          console.log('🔓 No session, showing login')
          setLoading(false)
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setError(`Connection error: ${error.message}`)
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      setError(null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      setLoading(false)
      return
    }
    
    try {
      console.log('👤 Fetching user profile...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('User profile error:', error)
        
        // If user doesn't exist, create basic profile
        if (error.code === 'PGRST116') {
          console.log('👤 Creating new user profile...')
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            const newUser = {
              id: authUser.user.id,
              email: authUser.user.email || '',
              name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'User',
              role: 'Viewer',
              status: 'Active',
            }
            
            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUser])
              .select()
              .single()
            
            if (!createError && createdUser) {
              console.log('✅ User profile created')
              setUser(createdUser)
            } else {
              console.error('❌ Failed to create user profile:', createError)
              // Create temporary user
              setUser({
                id: authUser.user.id,
                user_code: 'TEMP',
                email: authUser.user.email || '',
                name: authUser.user.user_metadata?.name || 'User',
                role: 'Viewer',
                status: 'Active',
                preferences: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } as User)
            }
          }
        } else {
          // Create temporary user for other errors
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            setUser({
              id: authUser.user.id,
              user_code: 'TEMP',
              email: authUser.user.email || '',
              name: authUser.user.user_metadata?.name || 'User',
              role: 'Viewer',
              status: 'Active',
              preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as User)
          }
        }
      } else {
        console.log('✅ User profile loaded')
        setUser(data)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      // Create temporary user on error
      const { data: authUser } = await supabase.auth.getUser()
      if (authUser.user) {
        setUser({
          id: authUser.user.id,
          user_code: 'TEMP',
          email: authUser.user.email || '',
          name: authUser.user.user_metadata?.name || 'User',
          role: 'Viewer',
          status: 'Active',
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as User)
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name,
            role: 'Viewer',
            status: 'Active',
          },
        ])

      if (profileError) throw profileError
    }

    return data
  }

  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    setUser(data)
    return data
  }

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}