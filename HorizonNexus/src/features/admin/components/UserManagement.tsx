import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../services/adminService';
import type { UserProfile, UserRole } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth(); // Get current user to prevent self-action

  // Define fetchUsers with useCallback so it can be referenced in useEffect and other handlers
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous errors before a new fetch
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect now calls the memoized fetchUsers function on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    const originalUsers = [...users];
    // Optimistically update the UI
    setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));

    try {
      await updateUserRole(uid, newRole);
    } catch (err: any) {
      setError(err.message || 'Failed to update role.');
      // Revert UI on failure by restoring the original user list
      setUsers(originalUsers);
      console.error(err);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
        try {
            await deleteUser(uid);
            // Remove user from the list on successful deletion
            setUsers(users.filter(user => user.uid !== uid));
        } catch (err: any) {
            setError(err.message || 'Failed to delete user.');
            console.error(err);
        }
    }
  };

  if (isLoading) return <div className="text-center">Loading users...</div>;

  return (
    <div className="card">
      <h5 className="card-header">User Role Management</h5>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.uid}>
                  <td>{user.displayName || user.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      disabled={user.uid === userProfile?.uid} // Disable role change for self
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.uid)}
                      disabled={user.uid === userProfile?.uid} // Disable self-deletion
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}