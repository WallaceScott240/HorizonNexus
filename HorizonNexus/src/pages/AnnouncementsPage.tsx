import { useState, useEffect } from 'react';
import type { Announcement } from '../types';
import { getAnnouncements } from '../features/announcements/services/announcementService';
import { useAuth } from '../hooks/useAuth'; 
import CreateAnnouncementForm from '../features/admin/components/CreateAnnouncementForm';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form visibility
  const { userProfile } = useAuth(); 

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreationSuccess = () => {
    setShowCreateForm(false);
    fetchAnnouncements(); // Refresh the list after creating a new one
  };

  const canCreate = userProfile?.role === 'admin' || userProfile?.role === 'teacher';

  if (isLoading) {
    return <div className="text-center">Loading announcements...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4">
        <h1 className="mb-3 mb-md-0">Announcements</h1>
        {canCreate && (
          <button 
            className="btn btn-primary align-self-start align-self-md-auto"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'New Announcement'}
          </button>
        )}
      </div>

      {/* Conditionally render the create form */}
      {showCreateForm && <CreateAnnouncementForm onSuccess={handleCreationSuccess} />}

      {announcements.length === 0 ? (
        <p>No announcements to display.</p>
      ) : (
        <div className="list-group">
          {announcements.map((ann) => (
            <div key={ann.id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ann.title}</h5>
                <small className="text-nowrap">{ann.createdAt.toLocaleDateString()}</small>
              </div>
              <p className="mb-1">{ann.content}</p>
              <small className="d-block mb-1">By: {ann.author}</small>
              {ann.tags && ann.tags.length > 0 && (
                <div>
                  {ann.tags.map(tag => (
                    <span key={tag} className="badge bg-info me-1">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}