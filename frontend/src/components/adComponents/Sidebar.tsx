import { FiHome, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage }: { activePage: string }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('advertiserToken');
    localStorage.removeItem('advertiserRefreshToken');
    navigate('/advertiser/login');
  };

  return (
    <div className="w-64 bg-indigo-800 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Ad Manager</h2>
        <p className="text-indigo-200 text-sm">Advertiser Portal</p>
      </div>
      <nav className="mt-6">
        <div 
          className={`flex items-center px-6 py-3 cursor-pointer ${activePage === 'dashboard' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          onClick={() => navigate('/advertiser/dashboard')}
        >
          <FiHome className="mr-3" />
          <span>Overview</span>
        </div>
        <div 
          className={`flex items-center px-6 py-3 cursor-pointer ${activePage === 'myads' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          onClick={() => navigate('/advertiser/my-ads')}
        >
          <HiOutlineSpeakerphone className="mr-3" />
          <span>My Ads</span>
        </div>
        <div 
          className={`flex items-center px-6 py-3 cursor-pointer ${activePage === 'createad' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          onClick={() => navigate('/advertiser/create-new-ad')}
        >
          <FiPlus className="mr-3" />
          <span>Create New Ad</span>
        </div>
        <div 
          className={`flex items-center px-6 py-3 cursor-pointer ${activePage === 'account' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          onClick={() => navigate('/advertiser/account')}
        >
          <FiUser className="mr-3" />
          <span>Account</span>
        </div>
        <div 
          className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700 mt-auto"
          onClick={handleLogout}
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
