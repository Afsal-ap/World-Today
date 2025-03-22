import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostQuery, useCreateCommentMutation, useGetPostCommentsQuery, useDeleteCommentMutation, useUpdateCommentMutation } from '../store/slices/postApiSlice';
import { FiEdit, FiTrash } from 'react-icons/fi';



interface Comment {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
  userName: string;
}

function DetailedPost() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const { data: post, isLoading, error } = useGetPostQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const { data: comments } = useGetPostCommentsQuery(postId);
  const channelToken = localStorage.getItem('channelToken');
  const userToken = localStorage.getItem('userToken');
  const [liked, setLiked] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  useEffect(() => {
    if (error) {
      console.error('Error fetching post:', error);
    }
  }, [error]);

  const decodeToken = (token: string): any | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('No user token found');
      }

      const decodedToken = decodeToken(userToken);
      const userId = decodedToken?.userId;

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      await createComment({ 
        postId, 
        content: comment,
        userId: userId 
      }).unwrap();
      
      setComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleLike = async () => {
    try {
      if (!post) return;

      const decodedToken = decodeToken(userToken!);
      const userId = decodedToken?.userId;

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const method = liked ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:3004/api/posts/${postId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${channelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle like');
      }

      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    if (post) {
      setLiked(post.isLiked || false);
    }
  }, [post]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ postId: postId!, commentId }).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEditComment = async (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedComment(currentContent);
  };

  const handleSaveEdit = async (commentId: string) => { 
    try {
      await updateComment({
        postId: postId!,
        commentId,
        content: editedComment
      }).unwrap();
      setEditingCommentId(null);
      setEditedComment('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment('');
  };

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
  if (error) {
    console.error('Detailed error:', error);
    return (
      <div className="text-red-600 text-center p-8">
        Error loading post: {(error as any)?.data?.message || 'Unknown error'}
      </div>
    );
  }
  if (!post) return <div className="text-center p-8">Post not found</div>;
  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        ← Back to Home
      </button>

      {/* Main content layout with sidebar */}
      <div className="flex gap-6">
        {/* Main post content */}
        <div className="flex-grow max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {post.media && post.mediaType === 'image' && (
              <img 
                src={`http://localhost:3004${post.media}`}
                alt={post.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.retried) {
                    target.dataset.retried = 'true';
                    target.src = '/placeholder-image.jpg';
                  }
                }}
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-600">{post.category}</span>
                <span className="text-gray-600">By {post.channel.channelName}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
              
              {/* Like button */}
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={liked ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  {post.likesCount} Likes
                </button>
                <span className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="w-96 bg-white rounded-lg shadow-md h-fit sticky top-4">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Comments ({comments?.length || 0})</h2>
          </div>
          
          {/* Comment Form */}
          <div className="p-4 border-b">
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Write a comment..."
                rows={3}
              />
              <button 
                type="submit"
                className="mt-2 w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                disabled={!comment.trim()}
              >
                Post Comment
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {comments && comments.length > 0 ? (
              comments.map((comment: Comment) => (
                <div key={comment._id} className="p-4 border-b hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{comment.userName}</span>
                    <div className="flex items-center gap-2">
                      {editingCommentId === comment._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(comment._id)}
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {comment.userId === decodeToken(userToken!)?.userId && (
                            <>
                              <button
                                onClick={() => handleEditComment(comment._id, comment.content)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FiTrash className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="text-gray-700">{comment.content}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedPost;
