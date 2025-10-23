// Firebase v2 SDK imports, including the 'CallableRequest' type for proper typing.
import { onCall, HttpsError, type CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK to interact with Firebase services
admin.initializeApp();

/**
 * A reusable utility function to check if a user is an admin via Custom Claims.
 * Throws an error if the user is not authenticated or not an admin.
 * @param {CallableRequest['auth']} auth The authentication context from the request.
 */
const ensureIsAdmin = (auth: CallableRequest['auth']) => {
  // Ensure the user is authenticated.
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  // Check for the admin custom claim on the user's token.
  if (auth.token.role !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "The function must be called by an admin.",
    );
  }
};


/**
 * v2 Cloud Function to get all users.
 * Only callable by authenticated users who are admins.
 */
export const getAllUsers = onCall(async (request) => {
  // 1. Security Check: Ensure the caller is an admin using custom claims.
  ensureIsAdmin(request.auth);

  try {
    // 2. Get all users from Firebase Authentication (up to 1000).
    const listUsersResult = await admin.auth().listUsers(1000);

    // 3. OPTIMIZED: Get all user profiles from Firestore in a single operation.
    const firestoreUsersSnapshot = await admin.firestore().collection("users").get();
    const firestoreUsersMap = new Map();
    firestoreUsersSnapshot.forEach((doc) => {
      firestoreUsersMap.set(doc.id, doc.data());
    });

    // 4. Combine the data.
    const combinedUsers = listUsersResult.users.map((user) => {
      const firestoreProfile = firestoreUsersMap.get(user.uid) || {};
      return {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        role: firestoreProfile.role || "student", // Prioritize Firestore role data
      };
    });

    return combinedUsers;
  } catch (error) {
    console.error("Error listing users:", error);
    throw new HttpsError("internal", "An unexpected error occurred while listing users.");
  }
});


/**
 * v2 Cloud Function to update a user's role.
 * Only callable by authenticated users who are admins.
 */
export const updateUserRole = onCall(async (request) => {
  // 1. Security Check: Ensure the caller is an admin.
  ensureIsAdmin(request.auth);

  // 2. Data Validation.
  const { uid, newRole } = request.data;
  if (!uid || !newRole || !["admin", "teacher", "student"].includes(newRole)) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'uid' and a valid 'newRole'.");
  }

  try {
    // 3. CRITICAL: Set the custom claim for the user's role.
    await admin.auth().setCustomUserClaims(uid, { role: newRole });

    // 4. Update the role in the user's Firestore document for client-side access.
    await admin.firestore().collection("users").doc(uid).update({ role: newRole });

    return { message: `Successfully updated role for user ${uid} to ${newRole}.` };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new HttpsError("internal", "Failed to update user role.");
  }
});


/**
 * v2 Cloud Function for an Admin to create a new user account.
 */
export const createNewUser = onCall(async (request) => {
  // 1. Security Check: Ensure the caller is an admin.
  ensureIsAdmin(request.auth);

  // 2. Data Validation.
  const { email, password, displayName, role } = request.data;
  if (!email || !password || !displayName || !role) {
    throw new HttpsError("invalid-argument", "Missing required fields: email, password, displayName, role.");
  }

  try {
    // 3. Create the user in Firebase Authentication.
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // 4. CRITICAL: Set the custom claim for their role immediately after creation.
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // 5. Create their user profile document in Firestore.
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      displayName,
      role,
    });

    return { message: `Successfully created user: ${displayName}` };
  } catch (error: unknown) { // <-- FIX IS HERE: Changed 'any' to 'unknown'
    console.error("Error creating new user:", error);
    // Type guard to safely access properties of the 'error' object
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'auth/email-already-exists') {
      throw new HttpsError("already-exists", "This email address is already in use.");
    }
    throw new HttpsError("internal", "Failed to create new user.");
  }
});


/**
 * v2 Cloud Function to delete a user from Auth and Firestore.
 * Only callable by admins.
 */
export const deleteUser = onCall(async (request) => {
    // 1. Security Check: Ensure the caller is an admin.
    ensureIsAdmin(request.auth);

    const { uid } = request.data;
    if (!uid) {
        throw new HttpsError("invalid-argument", "The 'uid' is required.");
    }

    // 2. Prevent an admin from deleting themselves.
    if (uid === request.auth?.uid) {
        throw new HttpsError("permission-denied", "Admins cannot delete their own account.");
    }

    try {
        // 3. Delete from Firebase Authentication.
        await admin.auth().deleteUser(uid);
        // 4. Delete the user's Firestore document.
        await admin.firestore().collection("users").doc(uid).delete();

        return { message: "Successfully deleted user." };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new HttpsError("internal", "Failed to delete user.");
    }
});