import React, { createContext, useState, useContext, useEffect } from 'react';
// TODO: Replace with Firebase Auth imports
// import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { firebaseApp } from '@/lib/firebase-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
          // TODO: Wire up Firebase onAuthStateChanged listener
                  // const auth = getAuth(firebaseApp);
                  // const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                  //   if (firebaseUser) {
                  //     setUser({
                  //       id: firebaseUser.uid,
                  //       email: firebaseUser.email,
                  //       full_name: firebaseUser.displayName,
                  //       photo_url: firebaseUser.photoURL,
                  //       role: 'user',
                  //       is_agent: false,
                  //     });
                  //     setIsAuthenticated(true);
                  //   } else {
                  //     setUser(null);
                  //     setIsAuthenticated(false);
                  //   }
                  //   setIsLoadingAuth(false);
                  // });
                  // return () => unsubscribe();

                  // Placeholder: skip auth loading for now
                  setIsLoadingAuth(false);
    }, []);

    const logout = (shouldRedirect = true) => {
          // TODO: Replace with Firebase signOut
          setUser(null);
          setIsAuthenticated(false);
          if (shouldRedirect) {
                  window.location.href = '/';
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
