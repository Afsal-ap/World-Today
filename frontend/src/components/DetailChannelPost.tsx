import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostQuery, useGetPostCommentsQuery } from '../store/slices/postApiSlice';
import { format, isValid } from 'date-fns';
import { FaThumbsUp, FaComment, FaEye, FaArrowLeft } from 'react-icons/fa';

const DetailChannelPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading: postLoading, error: postError } = useGetPostQuery(postId);
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useGetPostCommentsQuery(postId);

  if (postLoading || commentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (postError || commentsError) {
    return <div>Error loading post or comments</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const formattedDate = isValid(new Date(post.createdAt)) 
    ? format(new Date(post.createdAt), 'MMMM dd, yyyy')
    : 'Invalid date';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-purple-600 hover:text-purple-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Articles
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {post.media && (
          <div className="w-full h-96 relative">
            <img
              src={`http://localhost:3004/uploads/${post.media}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.status === 'published' ? 'bg-green-100 text-green-800' :
              post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span>{formattedDate}</span>
            <div className="flex items-center space-x-1">
              <FaThumbsUp /> <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComment /> <span>{post.commentsCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaEye /> <span>{post.views || 0}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments?.length || 0})</h2>
            <div className="space-y-6">
              {(comments || []).map((comment:any) => (
                <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">
                      {comment.userId.channelName || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {comments?.length === 0 && (
                <p className="text-gray-500 text-center">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default DetailChannelPost;
