import { useState } from 'react';
import { useGetAllChannelsQuery, useToggleChannelBlockMutation } from '../../store/slices/postApiSlice';
import { format, isValid, parseISO } from 'date-fns';
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ChannelDetails from '../../components/adminComponents/ChannelDetails';

interface Channel {
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
}

const ChannelsList = () => {
  const [page, setPage] = useState(1);
  const [loadingChannelId, setLoadingChannelId] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { data: response, isLoading, error } = useGetAllChannelsQuery({ page, limit: 10 });
  const [toggleBlock] = useToggleChannelBlockMutation();

  const handleToggleBlock = async (channelId: string, ) => {
    setLoadingChannelId(channelId);
    try {
      const result = await toggleBlock(channelId).unwrap();
      toast.success(`Channel ${result.isBlocked ? 'blocked' : 'unblocked'} successfully`, {
        position: "top-right",
        autoClose: 3000
      });
    } catch (err) {
      toast.error('Failed to update channel status', {
        position: "top-right",
        autoClose: 3000
      });
      console.error('Failed to toggle block status:', err);
    } finally {
      setLoadingChannelId(null);
    }
  };

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">Error loading channels</div>;
  }

  const { channels, totalPages,  } = response || {};

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd HH:mm:ss') : '-';
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Channels Management</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {channels.map((channel: Channel) => (
              <tr 
                key={channel.id} 
                className={`${channel.isBlocked ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                onClick={() => handleChannelClick(channel)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={`http://localhost:3000/uploads/${channel.logo}`} 
                        alt={channel.channelName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{channel.channelName}</div>
                      <div className="text-sm text-gray-500">{channel.websiteOrSocialLink}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{channel.email}</div>
                  <div className="text-sm text-gray-500">{channel.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    channel.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {channel.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {channel.postsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(channel.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBlock(channel.id);
                    }}
                    disabled={loadingChannelId === channel.id}
                    variant={channel.isBlocked ? "success" : "danger"}
                    style={{ minWidth: '140px' }}
                  >
                    {loadingChannelId === channel.id ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {channel.isBlocked ? "Unblocking..." : "Blocking..."}
                      </>
                    ) : (
                      channel.isBlocked ? "Unblock Channel" : "Block Channel"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => Math.max(1, p - 1));
              }}
              disabled={page === 1}
              className="px-4 py-2 border rounded text-sm disabled:opacity-50 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage(i + 1);
                  }}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage(p => p + 1);
              }}
              disabled={page >= totalPages}
              className="px-4 py-2 border rounded text-sm disabled:opacity-50 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Channel Details Modal */}
      {selectedChannel && (
        <ChannelDetails
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
};

export default ChannelsList; 