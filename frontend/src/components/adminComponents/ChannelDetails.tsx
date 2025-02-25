import { useState, useEffect } from 'react';
import { useGetChannelPostsQuery, useTogglePostBlockMutation } from '../../store/slices/postApiSlice';
import { format, parseISO, isValid } from 'date-fns';

interface Post {
  _id: string;
  title: string;
  content: string;
  media?: string;
  category: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isBlocked: boolean;
}

interface ChannelDetailsProps {
  channel: {
    id: string;
    channelName: string;
    email: string;
    logo: string;
    websiteOrSocialLink: string;
    phoneNumber: string;
    isVerified: boolean;
    postsCount: number;
    createdAt: string;
    isBlocked: boolean;
  };
  onClose: () => void;
}

const ChannelDetails = ({ channel, onClose }: ChannelDetailsProps) => {
  const { data: posts, isLoading, error, refetch } = useGetChannelPostsQuery(channel.id);
  const [togglePostBlock] = useTogglePostBlockMutation();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleToggleBlock = async (postId: string) => {
    try {
      await togglePostBlock(postId).unwrap();
      refetch(); // Refresh the posts list
    } catch (error) {
      console.error('Failed to toggle post block status:', error);
    }
  };

  // Add a safe date formatting function
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="flex h-full min-h-screen">
        {/* Sidebar with Channel Details - Fixed width and always visible */}
        <div className="w-80 flex-shrink-0 bg-white h-full overflow-y-auto shadow-xl">
          <div className="p-6 sticky top-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Channel Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={channel.logo ? `http://localhost:3000/uploads/${channel.logo}` : '/default-avatar.png'}
                  alt={channel.channelName}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <h3 className="mt-4 text-xl font-semibold text-purple-700">{channel.channelName}</h3>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{channel.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{channel.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Website/Social</label>
                  <p className="font-medium break-words">{channel.websiteOrSocialLink}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className={`font-medium ${channel.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                    {channel.isBlocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Verification</label>
                  <p className={`font-medium ${channel.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {channel.isVerified ? 'Verified' : 'Pending'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Joined</label>
                  <p className="font-medium">
                    {formatDate(channel.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Posts - Flexible width */}
        <div className="flex-1 bg-gray-50 p-6 min-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 pb-4 mb-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Channel Posts ({posts?.length || 0})
              </h2>
              <div className="text-sm text-gray-500">
                Total Posts: {channel.postsCount}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              Error loading posts. Please try again.
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts?.map((post: Post) => (
                <div 
                  key={post._id} 
                  className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow ${
                    post.isBlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-sm font-medium ${
                      post.isBlocked ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {post.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                    <button
                      onClick={() => handleToggleBlock(post._id)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        post.isBlocked 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {post.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                  {post.media && (
                    <img
                      src={`http://localhost:3004${post.media}`}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-post-image.png';
                      }}
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center space-x-4">
                      <span title="Likes">👍 {post.likesCount}</span>
                      <span title="Comments">💬 {post.commentsCount}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {posts?.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No posts found for this channel
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetails;
