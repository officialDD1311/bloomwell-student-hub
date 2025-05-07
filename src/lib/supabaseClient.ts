


// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzhmzqquperadflcfxmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aG16cXF1cGVyYWRmbGNmeG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTI4MzUsImV4cCI6MjA2MjE2ODgzNX0.mBF5JcWhnFL40-DWgp-KFnm4GjoVwkQSBFwPeBOaayE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
