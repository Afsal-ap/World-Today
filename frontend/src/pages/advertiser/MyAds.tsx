import  { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useGetAdsByAdvertiserQuery, useDeleteAdMutation } from '../../store/slices/adApiSlice';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../../components/adComponents/Sidebar';

const MyAds = () => {
  const navigate = useNavigate();
  const advertiserToken = localStorage.getItem('advertiserToken');
  const [advertiserId, setAdvertiserId] = useState<string>('');

  const { data: ads = [], isLoading, isError } = useGetAdsByAdvertiserQuery(advertiserId, {
    skip: !advertiserId
  });

  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();

  useEffect(() => {
    if (!advertiserToken) {
      navigate('/advertiser/login');
    } else {
      try {
        const decodedToken = jwtDecode<{ advertiserId: string }>(advertiserToken);
        if (decodedToken.advertiserId !== advertiserId) {
          setAdvertiserId(decodedToken.advertiserId);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, [advertiserToken, navigate, advertiserId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading ads</div>;

  const handleLogout = () => {
    localStorage.removeItem('advertiserToken');
    localStorage.removeItem('advertiserRefreshToken');
    navigate('/advertiser/login');
  };

  const handleDeleteAd = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAd(id).unwrap();
        console.log(`Ad ${id} deleted successfully`);
      } catch (error) {
        console.error("Failed to delete ad:", error);
        alert("Failed to delete ad. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="myads" />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad: any) => (
              <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img 
                  src={ad.image || ad.imageUrl || 'placeholder.jpg'} 
                  alt={ad.title || 'Ad'} 
                  className="w-full h-40 object-cover" 
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{ad.title || 'Untitled Ad'}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ad.description || 'No description available'}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {(ad.startDate || 'N/A')} to {(ad.endDate || 'N/A')}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-medium">₹{(ad.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ad Type</p>
                      <p className="font-medium">{(ad.placement).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="font-medium">{(ad.impressions ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="font-medium">{(ad.clicks ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/advertiser/edit-ad/${ad.id}`)}
                      className="p-2 rounded-md bg-yellow-50 text-yellow-600"
                      title="Edit Ad"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 rounded-md bg-red-50 text-red-600"
                      title="Delete Ad"
                      disabled={isDeleting}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {ads.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No ads found.</p>
              <button
                onClick={() => navigate('/advertiser/create-new-ad')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center"
              >
                <FiPlus className="mr-2" />
                Create New Ad
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAds;