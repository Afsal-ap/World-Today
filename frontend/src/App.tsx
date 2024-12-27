import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/userPages/Register';
import Login from './pages/userPages/Login';
import OtpVerification from './pages/userPages/OtpVerification';
import Home from './pages/userPages/Home';
import ChannelRegister from './pages/channelPages/ChannelRegister';
import ChannelLogin from './pages/channelPages/ChannelLogin';
import ChannelDashboard from './pages/channelPages/ChannelHome';
import ChannelOtpVerification from './pages/channelPages/ChannelOtpVerification';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/channel">
          <Route path="register" element={<ChannelRegister />} />
          <Route path="login" element={<ChannelLogin />} />
          <Route path="home" element={<ChannelDashboard />} />
          <Route path="verify-otp" element={<ChannelOtpVerification />} />

        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
