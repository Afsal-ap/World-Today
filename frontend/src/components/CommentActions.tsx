import { useState } from 'react';
import { useUpdateCommentMutation, useDeleteCommentMutation } from '../store/slices/postApiSlice';

interface CommentActionsProps {
  postId: string;
  commentId: string;
  initialContent: string;
  onClose: () => void;
}

const CommentActions = ({ postId, commentId, initialContent, onClose }: CommentActionsProps) => {
  const [content, setContent] = useState(initialContent);
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleUpdate = async () => {
    try {
      await updateComment({ postId, commentId, content }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment({ postId, commentId }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />
      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentActions;
