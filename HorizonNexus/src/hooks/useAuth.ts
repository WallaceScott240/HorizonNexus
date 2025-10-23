import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/firestoreService';
import type { UserProfile } from '../types';

// The hook will now return a UserProfile object, which includes the role.
// We also keep the original FirebaseAuthUser for any direct needs.
interface AuthState {
  firebaseUser: FirebaseAuthUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    firebaseUser: null,
    userProfile: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in, now fetch their profile from Firestore.
        const profile = await getUserProfile(currentUser.uid);
        setAuthState({
          firebaseUser: currentUser,
          userProfile: profile,
          isLoading: false,
        });
      } else {
        // User is signed out.
        setAuthState({
          firebaseUser: null,
          userProfile: null,
          isLoading: false,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
}