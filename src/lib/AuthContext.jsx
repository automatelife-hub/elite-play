import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setIsLoadingAuth(false);
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    await fetchProfile(session.user);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (authUser) => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            setUser({
                id: authUser.id,
                email: authUser.email,
                full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
                photo_url: profile?.photo_url || authUser.user_metadata?.avatar_url || '',
                role: profile?.role || 'user',
                is_agent: profile?.is_agent || false,
                agent_id: profile?.agent_id || null,
                phone: profile?.phone || '',
                country: profile?.country || '',
                preferred_currency: profile?.preferred_currency || 'USD',
            });
            setIsAuthenticated(true);
        } catch (err) {
            console.error('Error fetching profile:', err);
            // Still set basic user info from auth
            setUser({
                id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || '',
                photo_url: authUser.user_metadata?.avatar_url || '',
                role: 'user',
                is_agent: false,
                agent_id: null,
            });
            setIsAuthenticated(true);
        } finally {
            setIsLoadingAuth(false);
        }
    };

    const logout = async (shouldRedirect = true) => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
        if (shouldRedirect) {
            window.location.href = '/';
        }
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    const checkAppState = async () => {
        // Placeholder for fetching app-level settings if needed
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            authError,
            appPublicSettings,
            logout,
            navigateToLogin,
            checkAppState
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
