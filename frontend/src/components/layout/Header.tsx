// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const navigate = useNavigate();
//   const userToken = localStorage.getItem('userToken');

//   const handleLogout = () => {
//     localStorage.removeItem('userToken');
//     navigate('/login');
//   };

//   return (
//     <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo/Brand with Icon */}
//           <div className="flex items-center">
//             <button
//               onClick={() => navigate('/')}
//               className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200"
//             >
//               <span className="text-3xl">🌍</span>
//               <span>World Todayjjj</span>
//             </button>
//           </div>

//           {/* Auth Buttons */}
//           <div className="flex items-center space-x-6">
//             {userToken ? (
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors duration-200 shadow-md"
//               >
//                 Logout
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-200 shadow-md"
//                 >
//                   Sign Up
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;