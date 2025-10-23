import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile } from '../types';

/**
 * Fetches a user's profile from the 'users' collection in Firestore.
 * @param uid The user's unique ID from Firebase Auth.
 * @returns The user's profile data or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // Assuming the document data matches the UserProfile structure
    // and adds the uid to the returned object.
    return { uid, ...userDocSnap.data() } as UserProfile;
  } else {
    // Handle the case where the user profile doesn't exist.
    console.warn(`No user profile found for UID: ${uid}`);
    return null;
  }
};