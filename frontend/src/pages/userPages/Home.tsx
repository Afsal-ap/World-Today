import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';
import { useToggleSavePostMutation } from '../../store/slices/userApiSlice';
import { useGetPostsQuery } from '../../store/slices/postApiSlice';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  channel: {
    channelName: string;
  };
  content: string;
  media: string;
  mediaType: 'image' | 'video' | null;
  category: string;
  createdAt: Date;
  channelName: string; 
  isLiked?: boolean;
  likesCount?: number;  
  commentsCount: number;
  comments: Array<{
    id: string;
    content: string;
    userId: string;
    createdAt: string;
    userName: string;
  }>;
  isSaved?: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const channelToken = localStorage.getItem('channelToken'); 
  const userToken = localStorage.getItem('userToken');
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleSavePost] = useToggleSavePostMutation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { ref, inView } = useInView();
  const { channelId } = useParams();
     
  console.log(channelId,"channelidddyeee");
  const decodeToken = (token: string): any | null => {
    try {
      const payload = token.split('.')[1]; // JWT payload is the second part
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };
  
  // Example usage:
  if (userToken) {
    const decodedToken = decodeToken(userToken);
    const userId = decodedToken?.userId;
    console.log('Decoded User ID:', userId);
  }
  console.log('Retrieved token from localStorage:', channelToken);

  const { 
    data: postsData = [], 
    isFetching, 
    isError 
  } = useGetPostsQuery({ page, limit });

  useEffect(() => {
    if (postsData && postsData.length > 0) {
      setPosts(prev => [...prev, ...postsData]);
      setFilteredPosts(prev => [...prev, ...postsData]);
    }
  }, [postsData]);

  useEffect(() => {
    if (inView && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [inView, isFetching]);

  useEffect(() => {
    if (!userToken) { 
      console.log('No token found, redirecting to login');
      navigate('/login');
    }
  }, [userToken, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!channelToken) {
          throw new Error('No authentication token found');
        } 
        const decodedToken = decodeToken(userToken!);
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error('User ID not found in token');
        }
        // Fetch posts and saved posts in parallel
        const [postsResponse, savedPostIds] = await Promise.all([
          fetch(`http://localhost:3004/api/posts?userId=${userId}&isBlocked=false`, {
            headers: {
              'Authorization': `Bearer ${channelToken}`
            }
          }),
          fetchSavedPostsStatus(userId)
        ]);
           
        if (!postsResponse.ok) {
          const errorData = await postsResponse.json();   
          throw new Error(`Failed to fetch posts: ${errorData.message || postsResponse.statusText}`); 
        }
        
        const postsData = await postsResponse.json(); 
        console.log('postssss', postsData);

        // Mark posts as saved based on savedPostIds
        const postsWithSavedStatus = postsData.map((post: Post) => ({
          ...post,
          isSaved: savedPostIds.includes(post.id)
        }));

        setPosts(postsWithSavedStatus); 
        setFilteredPosts(postsWithSavedStatus); 
        
        const uniqueCategories = [...new Set(postsWithSavedStatus.map((post: Post) => post.category))] as string[]; 
        setCategories(uniqueCategories);  
      } catch (err) { 
        console.error('Detailed error:', err); 
        setError('Failed to load posts'); 
      } finally { 
        setLoading(false); 
      }  
    }; 

    fetchPosts();  
  }, [channelToken, userToken]);

  const fetchSavedPostsStatus = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/posts/saved`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch saved posts');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return [];
    }
  };

  const filterPostsByCategory = (category: string) => { 
    setSelectedCategory(category); 
    if (category === 'all') { 
      setFilteredPosts(posts); 
    } else { 
      setFilteredPosts(posts.filter(post => post.category === category)); 
    } 
  };

  const handleLike = async (postId: string) => {
    try {
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) return;

      // Get userId from decoded token
      const decodedToken = decodeToken(userToken!);
      const userId = decodedToken?.userId;

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const method = currentPost.isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:3004/api/posts/${postId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${channelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }) // Properly sending userId in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle like');
      }
      
      const data = await response.json();
      
      const updatePosts = (prevPosts: Post[]) => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, isLiked: !post.isLiked, likesCount: data.likesCount }
            : post
        );

      setPosts(updatePosts);
      setFilteredPosts(updatePosts);
      
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) return;

      const method = currentPost.isSaved ? 'DELETE' : 'POST';
      
      const result = await toggleSavePost({ 
        postId, 
        method,
        postTitle: currentPost.title
      }).unwrap();
      
      const updatePosts = (prevPosts: Post[]) => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, isSaved: result.saved }
            : post
        );

      setPosts(updatePosts);
      setFilteredPosts(updatePosts);
    } catch (error) {
      console.error('Error toggling save post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      {/* Categories Banner - Made Sticky */}
      <div className="sticky top-0 z-10 bg-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => filterPostsByCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            <div className="flex space-x-2 overflow-x-auto py-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => filterPostsByCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
              <Link
                to="/live"
                className="px-4 py-2 rounded-full whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
              >
                Watch Live
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  ref={index === filteredPosts.length - 1 ? ref : null}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.media && post.mediaType === 'image' && (
                    <img 
                      src={`http://localhost:3004${post.media}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.retried) {
                          console.error('Image failed to load:', post.media);
                          target.dataset.retried = 'true';
                          target.src = '/placeholder-image.jpg';
                        }
                      }}
                      loading="lazy"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-blue-800">{post.category}</div>
                      <div className="text-sm font-medium text-gray-600">
                        By {post.channel.channelName}
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{post.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center space-x-1 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-500`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={post.isLiked ? 'currentColor' : 'none'}
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
                        <span>{post.likesCount || 0}</span>
                      </button>
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <FaRegComment className="w-5 h-5" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(post.id);
                        }}
                        className={`flex items-center space-x-1 ${
                          post.isSaved ? 'text-blue-500' : 'text-gray-500'
                        } hover:text-blue-500`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={post.isSaved ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isFetching && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {isError && (
            <div className="text-red-600 text-center py-4">Failed to load more posts</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home; 