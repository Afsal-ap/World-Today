import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const userToken = localStorage.getItem('userToken');

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              News App
            </Link>
            
            <div className="flex items-center space-x-4">
              {userToken ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-gray-900"
                    title="Profile"
                  >
                    <FaUserCircle className="w-6 h-6" />
                  </Link>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
};

export default UserLayout;
