import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    full_name: firebaseUser.displayName,
                    photo_url: firebaseUser.photoURL,
                    role: 'user', // Default role
                    is_agent: false,
                });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoadingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async (shouldRedirect = true) => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            if (shouldRedirect) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error signing out:', error);
            setAuthError(error.message);
        }
    };

    const navigateToLogin = () => {
          // TODO: Replace with your Google/Firebase login flow
          window.location.href = '/login';
    };

    const checkAppState = async () => {
          // TODO: If needed, fetch app settings from Firestore
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
          </AuthContext.Provider>AuthContext.Provider>
        );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
