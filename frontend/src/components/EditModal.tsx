import { useState } from 'react';
import { useUpdatePostMutation } from '../store/slices/postApiSlice';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
}

interface EditModalProps {
  post: Post;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ post, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [updatePost] = useUpdatePostMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);

      await updatePost({
        postId: post._id,
        formData
      }).unwrap();
      
      onClose();
    } catch (err) {
      console.error('Failed to update post:', err);
      setError('Failed to update post. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 h-32"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
