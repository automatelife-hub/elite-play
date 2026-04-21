import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
                  const auth = getAuth(firebaseApp);
                  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    try {
                        if (firebaseUser) {
                          setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email,
                            full_name: firebaseUser.displayName,
                            photo_url: firebaseUser.photoURL,
                            role: 'user',
                            is_agent: false,
                          });
                          setIsAuthenticated(true);
                        } else {
                          setUser(null);
                          setIsAuthenticated(false);
                        }
                    } catch (error) {
                        console.error("Auth state change error:", error);
                        setAuthError(error);
                    } finally {
                        setIsLoadingAuth(false);
                    }
                  });
                  return () => unsubscribe();
    }, []);

    const logout = async (shouldRedirect = true) => {
          try {
              const auth = getAuth(firebaseApp);
              await signOut(auth);
              setUser(null);
              setIsAuthenticated(false);
              if (shouldRedirect) {
                      window.location.href = '/';
              }
          } catch (error) {
              console.error("Logout error:", error);
          }
    };

    const navigateToLogin = async () => {
          try {
              const auth = getAuth(firebaseApp);
              const provider = new GoogleAuthProvider();
              await signInWithPopup(auth, provider);
          } catch (error) {
              console.error("Login error:", error);
              if (error.code === 'auth/popup-closed-by-user') {
                  // Ignore this specific error or show a silent toast
              } else {
                  setAuthError(error);
              }
          }
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
