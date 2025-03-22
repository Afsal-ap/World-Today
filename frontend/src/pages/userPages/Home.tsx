import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';
import { useGetSubscriptionStatusQuery } from '../../store/slices/userApiSlice';
import { useGetPostsQuery } from '../../store/slices/postApiSlice';
import { useGetActiveAdsQuery } from '../../store/slices/adApiSlice';
import { useInView } from 'react-intersection-observer';

interface Post {
  id: string;
  title: string;
  channel: { channelName: string };
  content: string;
  media: string;
  mediaType: 'image' | 'video' | null;
  imageUrl?: string;
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

interface Ad {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  placement: 'card' | 'popup';
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
}

const Home = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');
  const [contentItems, setContentItems] = useState<(Post | Ad)[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<(Post | Ad)[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const { ref, inView } = useInView();

  const [popupAds, setPopupAds] = useState<Ad[]>([]);
  const [visiblePopup, setVisiblePopup] = useState<string | null>(null);
  const hasShownInitialPopup = useRef(false);
  const hasProcessedAds = useRef(false);

  const { 
    data: postsData = [], 
    isLoading: postsLoading,
    isFetching, 
    isError 
  } = useGetPostsQuery({ page, limit }, {
    skip: page === 0,
  });

  const { data: subscriptionData, isLoading: subLoading, error: subError } = useGetSubscriptionStatusQuery(undefined, {
    skip: !userToken,
  });

  useEffect(() => {
    if (subError) {
      console.error('Subscription status error:', subError);
    }
  }, [subError]);

  const isSubscribed = subscriptionData?.isSubscribed || false;

  const { 
    data: adsData = [], 
    isLoading: adsLoading 
  } = useGetActiveAdsQuery(undefined, {
    skip: hasProcessedAds.current || isSubscribed, // Skip ads if subscribed
  });

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

  useEffect(() => {
    if (!userToken) {
      console.log('No token found, redirecting to login');
      navigate('/login');
    } else {
      const decodedToken = decodeToken(userToken);
      const userId = decodedToken?.userId;
      console.log('Decoded User ID:', userId);
    }
  }, [userToken, navigate]);

  useEffect(() => {
    if (postsData.length > 0) {
      setContentItems(postsData);
      if (selectedCategory === 'all') {
        setFilteredPosts(postsData);
      }
      
      // Extract categories
      const uniqueCategories = [...new Set(postsData
        .filter((item: Post) => 'category' in item)
        .map((post: Post) => post.category))];
        
      setCategories(prev => {
        const mergedCategories = [...new Set([...prev, ...uniqueCategories])] as string[];
        return mergedCategories;
      });
    }
  }, [postsData, selectedCategory]);

  useEffect(() => {
    if (inView && !isFetching && !postsLoading) {
      setPage(prev => prev + 1);
    }
  }, [inView, isFetching, postsLoading]);

  useEffect(() => {
    // Only process ads if we have both posts and ads data, we're not subscribed, and we haven't processed ads yet
    if (!isSubscribed && adsData.length > 0 && postsData.length > 0 && !hasProcessedAds.current) {
      console.log("Processing ads:", adsData.length);
      
      const cardAds = adsData.filter(ad => ad.placement === 'card');
      const popupAdsFiltered = adsData.filter(ad => ad.placement === 'popup');
      
      // Create a new array with both posts and ads
      const mergedContent = [...postsData];
      cardAds.forEach((ad, index) => {
        const position = (index + 1) * 5;
        if (position < mergedContent.length) {
          mergedContent.splice(position, 0, ad);
        } else {
          mergedContent.push(ad);
        }
      });
  
      console.log("Merged content length:", mergedContent.length);
      setContentItems(mergedContent);
      
      if (selectedCategory === 'all') {
        setFilteredPosts(mergedContent);
      } else {
        setFilteredPosts(mergedContent.filter(item => 
          'category' in item && item.category === selectedCategory
        ));
      }
      
      setPopupAds(popupAdsFiltered);
      hasProcessedAds.current = true;
  
      if (popupAdsFiltered.length > 0 && !hasShownInitialPopup.current) {
        setTimeout(() => {
          setVisiblePopup(popupAdsFiltered[0].id);
          hasShownInitialPopup.current = true;
        }, 5000);
      }
    }
  }, [adsData, isSubscribed, postsData, selectedCategory]);
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(contentItems);
    } else {
      setFilteredPosts(contentItems.filter(post => 'category' in post && post.category === selectedCategory));
    }
  }, [selectedCategory, contentItems]);

  useEffect(() => {
    if (!subLoading && subscriptionData) {
      console.log('Subscription status:', isSubscribed ? 'Subscribed' : 'Not subscribed');
    }
  }, [subscriptionData, subLoading, isSubscribed]);

  const filterPostsByCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Like post:", postId);
  };

  const handleSave = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Save post:", postId);
  };

  const closePopup = (adId: string) => {
    setVisiblePopup(null);
    console.log(`Ad ${adId} was closed`);
    const currentIndex = popupAds.findIndex(ad => ad.id === adId);
    const nextIndex = (currentIndex + 1) % popupAds.length;
    if (popupAds.length > 1 && !isSubscribed) {
      setTimeout(() => setVisiblePopup(popupAds[nextIndex].id), 10000);
    }
  };

  const isPost = (item: Post | Ad): item is Post => 'content' in item;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => filterPostsByCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
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
                    selectedCategory === category ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
              <Link
                to="/live"
                className="px-4 py-2 rounded-full whitespace-nowrap bg-gray-700 text-white hover:bg-gray-500"
              >
                Watch Live
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {(postsLoading && page === 1) || (!isSubscribed && adsLoading && !hasProcessedAds.current) ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : isError ? (
            <div className="text-red-600 text-center">Failed to load content</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-gray-600 text-center">No content available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((item, index) => (
                <div
                  key={isPost(item) ? `post-${item.id}` : `ad-${item.id}`}
                  ref={index === filteredPosts.length - 1 ? ref : null}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => isPost(item) && navigate(`/post/${item.id}`)}
                >
                  {(item.imageUrl || (isPost(item) && item.media)) ? (
                    <img
                      src={isPost(item) ? `http://localhost:3004${item.media}` : item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/placeholder-image.jpg';
                      }}
                      loading="lazy"
                    />
                  ) : null}
                  <div className="p-4">
                    {isPost(item) ? (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-blue-800">{item.category}</div>
                          <div className="text-sm font-medium text-gray-600">
                            By {item.channel.channelName}
                          </div>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-600 line-clamp-3">{item.content}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                          <button
                            onClick={(e) => handleLike(item.id, e)}
                            className={`flex items-center space-x-1 ${
                              item.isLiked ? 'text-red-500' : 'text-gray-500'
                            } hover:text-red-500`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill={item.isLiked ? 'currentColor' : 'none'}
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
                            <span>{item.likesCount || 0}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <FaRegComment className="w-5 h-5" />
                            <span>{item.commentsCount}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                          <button
                            onClick={(e) => handleSave(item.id, e)}
                            className={`flex items-center space-x-1 ${
                              item.isSaved ? 'text-blue-500' : 'text-gray-500'
                            } hover:text-blue-500`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill={item.isSaved ? 'currentColor' : 'none'}
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
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-600 line-clamp-3">{item.description || 'Ad'}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          Sponsored Ad
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {isFetching && page > 1 && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {isError && (
            <div className="text-red-600 text-center py-4">Failed to load more posts</div>
          )}
        </div>
      </main>

      {!isSubscribed && popupAds.map(ad => (
        <div
          key={`popup-${ad.id}`}
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            visiblePopup === ad.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div 
            className="fixed inset-0 bg-black opacity-50" 
            onClick={() => closePopup(ad.id)}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative z-10">
            {ad.imageUrl && (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-40 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
            <p className="text-gray-600 mb-4">{ad.description || 'Check out this ad!'}</p>
            <button
              onClick={() => closePopup(ad.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;