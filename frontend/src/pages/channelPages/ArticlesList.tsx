import { useGetChannelPostsQuery } from '../../store/slices/postApiSlice';
import { format } from 'date-fns';
import { FaThumbsUp, FaComment, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
const ArticlesList = () => {
  const { data: postsData, isLoading, error } = useGetChannelPostsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Failed to load articles
      </div>
    );
  }

  const posts = postsData?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post: any) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              {post.media && (
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img
                    src={`http://localhost:3004/uploads/${post.media}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Section */}
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
                    <div className="flex items-center space-x-1">
                      <FaThumbsUp className="text-purple-500" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaComment className="text-purple-500" />
                      <span>{post.commentsCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaEye className="text-purple-500" />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-purple-600 hover:text-purple-900 transition-colors">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-900 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesList; 