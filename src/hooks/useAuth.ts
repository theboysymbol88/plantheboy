import { useState, useEffect } from 'react'
import { supabase, type User } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ตรวจสอบ session ปัจจุบัน
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // สร้าง user profile ง่ายๆ
        setUser({
          id: session.user.id,
          user_code: 'USR001',
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'Admin',
          status: 'Active',
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as User)
      }
      setLoading(false)
    })

    // ฟัง auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          user_code: 'USR001',
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'Admin',
          status: 'Active',
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as User)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}