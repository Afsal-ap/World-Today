import { useGetChannelPostsQuery, useDeletePostMutation } from '../../store/slices/postApiSlice';
import { format } from 'date-fns';
import { FaThumbsUp, FaComment, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import EditModal from '../../components/EditModal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const letsDecode = () => {
  const token = localStorage.getItem("channelToken"); 
  if (!token) return null; 

  try {
    const decoded: any = jwtDecode(token);
    return decoded.channelId;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const ArticlesList = () => {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const id = letsDecode();
    setChannelId(id);
  }, []);

  const { data: postsData, isLoading, error } = useGetChannelPostsQuery(channelId);
  const [deletePost] = useDeletePostMutation();

  const handleEdit = (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
  };

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setIsDeleting(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete).unwrap();
      setIsDeleting(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/channel/posts/${postId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Failed to load articles: {JSON.stringify(error)}</div>;
  }

  // Determine the posts array based on postsData structure
  let posts = [];
  if (Array.isArray(postsData)) {
    posts = postsData; // If postsData is already an array
  } else if (postsData?.data && Array.isArray(postsData.data)) {
    posts = postsData.data; // If posts are nested under data
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-600 p-4">No articles found.</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <span>New Article</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {posts.map((post: any) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handlePostClick(post._id)}
            >
              <div className="flex flex-col md:flex-row">
                {post.media && (
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img src={`http://localhost:3004${post.media}`} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1"><FaThumbsUp className="text-purple-500" /><span>{post.likesCount || 0}</span></div>
                      <div className="flex items-center space-x-1"><FaComment className="text-purple-500" /><span>{post.commentsCount || 0}</span></div>
                      <div className="flex items-center space-x-1"><FaEye className="text-purple-500" /><span>{post.views || 0}</span></div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                      <div className="flex space-x-2">
                        <button onClick={(e) => handleEdit(post, e)} className="p-2 text-purple-600 hover:text-purple-900 transition-colors"><FaEdit /></button>
                        <button onClick={(e) => handleDeleteClick(post._id, e)} className="p-2 text-red-600 hover:text-red-900 transition-colors"><FaTrash /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPost && <EditModal post={editingPost} onClose={() => setEditingPost(null)} />}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => { setIsDeleting(false); setPostToDelete(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlesList;