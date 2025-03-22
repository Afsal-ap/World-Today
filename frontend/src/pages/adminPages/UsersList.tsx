import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserBlockStatusMutation } from '../../store/slices/adminApiSlice';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

const UsersList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetAllUsersQuery({ page, limit: 10 });
  const [updateUserBlockStatus] = useUpdateUserBlockStatusMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">Error loading users</div>;
  }

 

  const handleBlockStatus = async (userId: string, isBlocked: boolean) => {
    try {
      console.log('Blocking user:', userId, isBlocked);
      if (!userId) {
        throw new Error('User ID is required');
      }
      await updateUserBlockStatus({ userId, isBlocked }).unwrap();
    } catch (err) {
      console.error('Failed to update block status:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.users?.map((user: User) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isBlocked 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleBlockStatus(user._id, !user.isBlocked)}
                    className={`text-sm ${
                      user.isBlocked 
                        ? 'text-green-600 hover:text-green-900' 
                        : 'text-red-600 hover:text-red-900'
                    } disabled:opacity-50`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
            {(!data?.users || data.users.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {data?.totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, data?.totalPages || 0))].map((_, idx) => {
                let pageNumber;
                if (data?.totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (page <= 3) {
                  pageNumber = idx + 1;
                } else if (page >= data?.totalPages - 2) {
                  pageNumber = data?.totalPages - 4 + idx;
                } else {
                  pageNumber = page - 2 + idx;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 border rounded text-sm ${
                      page === pageNumber
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data?.totalPages || 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setPage(data?.totalPages)}
                disabled={page >= (data?.totalPages || 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Last
              </button>
            </div>
            <span className="text-sm text-gray-500">
              Page {page} of {data?.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList; 