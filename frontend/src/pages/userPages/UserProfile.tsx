import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../../store/slices/userApiSlice';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const UserProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    console.log('Current token in localStorage:', token);
  }, []);

  const { data, error } = useGetProfileQuery(undefined, {
    selectFromResult: ({ data, error }) => ({
      data,
      error,
    }),
  });

  useEffect(() => {
    if ((error as any)?.status === 401) {
     console.log('Unauthorized');
    }
  }, [error]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center">
          {(error as any)?.data?.message || 'Failed to load profile data'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center mb-6">
              {(error as any)?.data?.message || 'Failed to load profile data'}
            </div>
          )}
          
          {data && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-600">
                    {data.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="mt-1 text-lg">{data.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-lg">{data.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <p className="mt-1 text-lg">{data.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Member Since</label>
                  <p className="mt-1 text-lg">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
