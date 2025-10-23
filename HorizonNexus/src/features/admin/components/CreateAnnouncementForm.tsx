import { useState, type FormEvent } from 'react';

// This is a mock function. In a real app, it would interact with your service layer.
const createAnnouncement = async (data: { title: string; content: string; tags: string[] }) => {
  console.log('Creating announcement:', data);
  // Simulate an API call
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
};

interface CreateAnnouncementFormProps {
  onSuccess: () => void; // Callback to close the form or refresh the list
}

export default function CreateAnnouncementForm({ onSuccess }: CreateAnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // Tags as a comma-separated string
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Split string into an array, trim whitespace, and remove empty strings
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await createAnnouncement({ title, content, tags: tagsArray });
      
      // Clear form and call success callback
      setTitle('');
      setContent('');
      setTags('');
      onSuccess();

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <h5 className="card-header">New Announcement</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="announcementTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="announcementTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="announcementContent" className="form-label">Content</label>
            <textarea
              className="form-control"
              id="announcementContent"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="announcementTags" className="form-label">Tags</label>
            <input
              type="text"
              className="form-control"
              id="announcementTags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="form-text">
              Enter tags separated by commas (e.g., "urgent, exams, general").
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
}