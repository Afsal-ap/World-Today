import { Link, Outlet } from 'react-router-dom'; // Add Outlet
import { FaUserCircle, FaCloudSun } from 'react-icons/fa';
import { useGetSubscriptionStatusQuery } from '../../store/slices/userApiSlice';
import React, { FC, ReactNode } from 'react';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  const { data: subscriptionData, isLoading, isError } = useGetSubscriptionStatusQuery(undefined, {
    skip: !userToken,
  });

  const isSubscribed = subscriptionData?.isSubscribed || false;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 🔔 Banner inside layout so it's visible on all user pages */}
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-medium shadow-sm z-50">
        ⚠️ Our backend services are temporarily unavailable due to AWS account suspension. We're working to resolve the issue. Thank you for your patience.
      </div>

      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-purple-600"
            >
              <span className="text-3xl">🌍</span>
              <span>World Today</span>
            </Link>

            {!isSubscribed && userToken && !isLoading && !isError && (
              <div className="bg-gray-200 text-center rounded-lg px-4 py-1">
                <p>Enjoy an ad-free experience with Premium!</p>
                <Link to="/subscribe" className="text-purple-600 hover:underline">
                  Subscribe Now
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-6">
              {userToken ? (
                <>
                  <Link to="/weather" className="text-blue-800 hover:text-blue-600" title="Weather">
                    <FaCloudSun className="w-7 h-7" />
                  </Link>
                  <Link to="/profile" className="text-blue-800 hover:text-blue-600" title="Profile">
                    <FaUserCircle className="w-7 h-7" />
                  </Link>
                  {!isSubscribed && !isLoading && !isError && (
                    <Link
                      to="/subscribe"
                      className="px-4 py-2 bg-red-700 text-white rounded-full font-medium hover:bg-red-600"
                    >
                      Go Premium
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-8 px-4">
        <Outlet /> {/* This replaces {children} */}
      </main>
    </div>
  );
};

export default UserLayout;
