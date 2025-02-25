import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Register from './pages/userPages/Register';
import Login from './pages/userPages/Login';
import OtpVerification from './pages/userPages/OtpVerification';
import Home from './pages/userPages/Home';
import ChannelLayout from './components/layout/ChannelLayout';
import ChannelRegister from './pages/channelPages/ChannelRegister';
import ChannelLogin from './pages/channelPages/ChannelLogin';
import ChannelOtpVerification from './pages/channelPages/ChannelOtpVerification';
import DashboardOverview from './pages/channelPages/DashboardOverview';
import ArticlesList from './pages/channelPages/ArticlesList';
import CreatePost from './pages/channelPages/CreatePost';
import AccountSettings from './pages/channelPages/AccountSettings';
import AdminLayout from './components/layout/AdminLayout';
import UsersList from './pages/adminPages/UsersList';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import ChannelsList from './pages/adminPages/ChannelsList'; 
import AdminLogin from './pages/adminPages/AdminLogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute'; 
import Categories from './pages/adminPages/Categories';
import SinglePost from './components/DetailedPost';
import UserLayout from './components/layout/UserLayout';
import UserProfile from './pages/userPages/UserProfile';
import DetailChannelPost from './components/DetailChannelPost';
import Live from './pages/channelPages/Live';
import LiveWatch from './pages/userPages/LiveWatch';
// import AdvertisersList from './pages/adminPages/AdvertisersList';
// import AdminSettings from './pages/adminPages/AdminSettings';
import { ToastContainer } from 'react-toastify';
function App() {
  return (    
    <>
      <Router>
        <Routes>
          {/* Public Routes with Header */}
          <Route element={<UserLayout><Outlet /></UserLayout>}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<SinglePost />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/live" element={<LiveWatch />} />
          </Route>
    
          {/* Public Routes without Header */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* Channel Authentication Routes */}
          <Route path="/channel/register" element={<ChannelRegister />} />
          <Route path="/channel/login" element={<ChannelLogin />} />
          <Route path="/channel/verify-otp" element={<ChannelOtpVerification />} />

          {/* Channel Dashboard Routes - Nested under ChannelLayout */}
          <Route path="/channel" element={<ChannelLayout />}>
            <Route index element={<Navigate to="/channel/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="home" element={<DashboardOverview />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="live" element={<Live />} />
            <Route path="account" element={<AccountSettings />} />
          </Route>

          {/* Public admin route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UsersList />} />
              <Route path="channels" element={<ChannelsList />} />
              <Route path="categories" element={<Categories />} />
            </Route>
          </Route>

          <Route path="/channel/posts/:postId" element={<DetailChannelPost />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
