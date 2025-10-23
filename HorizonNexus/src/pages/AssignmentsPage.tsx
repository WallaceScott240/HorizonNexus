import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Assignment } from '../types';
import { getAssignments } from '../features/assignments/services/assignmentService';
import { useAuth } from '../hooks/useAuth';
import CreateAssignmentForm from '../features/admin/components/CreateAssignmentForm';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form
  const { userProfile } = useAuth();

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to fetch assignments.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  
  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    fetchAssignments(); // Refresh the list
  };
  
  const canCreate = userProfile?.role === 'admin' || userProfile?.role === 'teacher';

  if (isLoading) {
    return <div className="text-center">Loading assignments...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4">
        <h1 className="mb-3 mb-md-0">Assignments</h1>
        {canCreate && (
            <button 
              className="btn btn-primary align-self-start align-self-md-auto"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? 'Cancel' : 'New Assignment'}
            </button>
        )}
      </div>

      {showCreateForm && <CreateAssignmentForm onSuccess={handleCreationSuccess} />}

      {assignments.length === 0 ? (
        <p>No assignments to display.</p>
      ) : (
        <div className="card">
          <ul className="list-group list-group-flush">
            {assignments.map((asg) => (
              <li key={asg.id} className="list-group-item d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
                <div className="mb-2 mb-sm-0">
                  <h5>{asg.title}</h5>
                  <p className="mb-1 text-muted">Due: {asg.dueDate.toLocaleDateString()}</p>
                   {asg.tags && asg.tags.length > 0 && (
                    <div className='mt-1'>
                      {asg.tags.map(tag => (
                        <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Link to={`/assignments/${asg.id}`} className="btn btn-outline-secondary btn-sm align-self-start mt-2 mt-sm-0">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}