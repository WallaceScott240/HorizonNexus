import { useState, type FormEvent } from 'react';

// Mock function for creating an assignment
const createAssignment = async (data: { title: string; description: string; dueDate: string; tags: string[] }) => {
  console.log('Creating assignment:', data);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
};

interface CreateAssignmentFormProps {
  onSuccess: () => void;
}

export default function CreateAssignmentForm({ onSuccess }: CreateAssignmentFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await createAssignment({ title, description, dueDate, tags: tagsArray });

      // Clear form and call success callback
      setTitle('');
      setDescription('');
      setDueDate('');
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
      <h5 className="card-header">New Assignment</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="assignmentTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="assignmentTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="assignmentDesc" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="assignmentDesc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="assignmentDueDate" className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="assignmentDueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="assignmentTags" className="form-label">Tags</label>
            <input
              type="text"
              className="form-control"
              id="assignmentTags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="form-text">
              Enter tags separated by commas (e.g., "essay, history, graded").
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}