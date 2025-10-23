import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { userProfile } = useAuth(); // Updated to use userProfile

  return (
    <div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome, {userProfile?.displayName || userProfile?.email}!</h1>
          <p className="col-md-8 fs-4">
            This is your main dashboard. From here you can access all the features of the application.
            Use the navigation bar above to get started.
          </p>
          {/* Display user's role for clarity */}
          {userProfile?.role && (
            <p className="lead">
              Your role is: <span className="badge bg-secondary">{userProfile.role}</span>
            </p>
          )}
        </div>
      </div>
      {/* You can add dashboard widgets or summaries here */}
    </div>
  );
}