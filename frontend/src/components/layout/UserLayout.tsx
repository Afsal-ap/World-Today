import { Link } from 'react-router-dom';
import { FaUserCircle, FaCloudSun } from 'react-icons/fa';
import { useGetSubscriptionStatusQuery } from '../../store/slices/userApiSlice'; // Adjust path

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const userToken = localStorage.getItem('userToken');
  const { data: subscriptionData, isLoading, isError } = useGetSubscriptionStatusQuery(undefined, {
    skip: !userToken, // Skip query if no token
  });

  const isSubscribed = subscriptionData?.isSubscribed || false;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200"
            >
              <span className="text-3xl">🌍</span>
              <span>World Today</span>
            </Link>
           

            {!isSubscribed && userToken && !isLoading && !isError && (
          <div className=" bg-gray-200  text-center rounded-lg">
            <p>Enjoy an ad-free experience with Premium!</p>
            <Link to="/subscribe" className="text-purple-600 hover:underline">
              Subscribe Now
            </Link>
          </div>
        )}

           

            <div className="flex items-center space-x-6">
              {userToken ? (
                <>
                  <Link
                    to="/weather"
                    className="text-blue-800 hover:text-blue-600 transition-colors duration-200"
                    title="Weather"
                  >
                    <FaCloudSun className="w-7 h-7" />
                  </Link>
                  <Link
                    to="/profile"
                    className="text-blue-800 hover:text-blue-600 transition-colors duration-200"
                    title="Profile"
                  >
                    <FaUserCircle className="w-7 h-7" />
                  </Link>
                  {!isSubscribed && !isLoading && !isError && (
                    <Link
                      to="/subscribe"
                      className="px-4 py-2 bg-red-700 text-white rounded-full font-medium hover:bg-red-600 transition-colors duration-200"
                    >
                      Go Premium
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8">
        {children}
        
      </main>
    </div>
  );
};

export default UserLayout;