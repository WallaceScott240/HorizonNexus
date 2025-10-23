import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../config/firebase'; 
import type { UserProfile, UserRole } from '../../../types';

// Define the shape of the data sent to the new function
interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

interface CreateUserResponse {
    message: string;
}

// Get references to the Cloud Functions
const getAllUsersFunction = httpsCallable(functions, 'getAllUsers');
const updateUserRoleFunction = httpsCallable(functions, 'updateUserRole');
const createNewUserFunction = httpsCallable<CreateUserRequest, CreateUserResponse>(functions, 'createNewUser');
const deleteUserFunction = httpsCallable<{ uid: string }, { message: string }>(functions, 'deleteUser');

/**
 * Fetches a list of all user profiles.
 */
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const result = await getAllUsersFunction();
    return result.data as UserProfile[];
  } catch (error) {
    console.error('Error calling getAllUsers function:', error);
    throw new Error('Failed to fetch user list.');
  }
};

/**
 * Updates a specific user's role.
 */
export const updateUserRole = async (uid: string, newRole: UserRole): Promise<void> => {
    try {
        await updateUserRoleFunction({ uid, newRole });
    } catch (error) {
        console.error('Error calling updateUserRole function:', error);
        throw new Error('Failed to update user role.');
    }
};

/**
 * Creates a new user with the specified details and role.
 */
export const createNewUser = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    try {
        const result = await createNewUserFunction(data);
        return result.data;
    } catch (error) {
        console.error('Error calling createNewUser function:', error);
        throw error; // Re-throw to be handled by the form component
    }
};

/**
 * Deletes a user from Firebase Authentication and Firestore.
 */
export const deleteUser = async (uid: string): Promise<{ message: string }> => {
    try {
        const result = await deleteUserFunction({ uid });
        return result.data;
    } catch (error) {
        console.error('Error calling deleteUser function:', error);
        throw new Error('Failed to delete user.');
    }
};