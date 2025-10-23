import UserManagement from '../features/admin/components/UserManagement';
import CreateUserForm from '../features/admin/components/CreateUserForm';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      <p>
        Use the forms below to manage the application. You can create new user accounts or change the roles of existing users.
      </p>
      
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <CreateUserForm />
        </div>
        <div className="col-12 col-lg-6">
           <UserManagement />
        </div>
      </div>
    </div>
  );
}