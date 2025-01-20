import { FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface CommentProps {
  postId: string;
  count: number;
}

const Comment = ({ postId, count }: CommentProps) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(`/post/${postId}`)}
      className="flex items-center gap-2 p-4 hover:text-purple-600"
    >
      <FaRegComment />
      <span>{count} Comments</span>
    </button>
  );
};

export default Comment;
