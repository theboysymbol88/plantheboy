import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecphvqdudlkoglhdbext.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcGh2cWR1ZGxrb2dsaGRiZXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODE3NjAsImV4cCI6MjA2NzQ1Nzc2MH0.eOn24WQsQREcY4XGRMgimNlM3YRK7mMvcBpXsHEyp_c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit',
    debug: false,
    storageKey: 'transport-planner-auth'
  },
  global: {
    headers: {
      'X-Client-Info': 'transport-planner@1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    enabled: false
  }
})

// Simple connection test without complex retry logic
let isConnected = false

const testConnection = async () => {
  if (isConnected) return true
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .maybeSingle()
    
    if (!error) {
      isConnected = true
      console.log('✅ Database connected successfully')
      return true
    }
    
    console.warn('⚠️ Database connection issue:', error.message)
    return false
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error.message)
    return false
  }
}

// Test connection on load (non-blocking)
testConnection()

// Re-export types
export type {
  Driver,
  Vehicle,
  Customer,
  Route,
  RouteSchedule,
  ScheduleInstance,
  User,
  VehicleType,
  RouteAlert,
  SmartSuggestion,
  ExportLog,
  AuditLog,
  ConflictCheck
} from './supabase.d'