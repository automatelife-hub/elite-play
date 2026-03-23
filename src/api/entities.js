import { db } from './supabaseClient';

// Re-export auth as User for backward compat
export const User = db.auth;
