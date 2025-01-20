import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
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

        const response = await fetch(`http://localhost:3004/api/posts?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${channelToken}`
          }
        });
           
        if (!response.ok) {
          const errorData = await response.json();   
          console.error('Server error:', errorData);  
          throw new Error(`Failed to fetch posts: ${errorData.message || response.statusText}`); 
        }
        
        const data = await response.json(); 
        console.log('Posts data:', data); 
        setPosts(data); 
        setFilteredPosts(data); 
        
        const uniqueCategories = [...new Set(data.map((post: Post) => post.category))] as string[]; 
        setCategories(uniqueCategories);  
      } catch (err) { 
        console.error('Detailed error:', err); 
        setError('Failed to load posts'); 
      } finally { 
        setLoading(false); 
      }  
    }; 

    fetchPosts();  
  }, [channelToken]); 

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
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.mediaUrl && post.mediaType === 'image' && (
                    <img 
                      src={`http://localhost:3004${post.mediaUrl}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.retried) {
                          console.error('Image failed to load:', post.mediaUrl);
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
                        By {post.channelName}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home; 