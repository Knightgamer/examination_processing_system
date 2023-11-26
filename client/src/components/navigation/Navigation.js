// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import UserDataFetcher from "../UserDataFetcher"; // Import the UserDataFetcher component
// import { useLogout, useUserRole } from "../UserRoleContext";

// const Navigation = () => {
//   const userRoleContext = useUserRole();
//   const logout = useLogout();
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };
//   return (
//     <UserDataFetcher>
//       {(userData) => (
//         <div className="flex h-screen">
//           {/* Vertical Navigation Pane */}
//           <nav className="w-64 bg-gray-800  text-gray-200 p-4">
//             <ul>
//               {/* Display links based on user role */}
//               {userRoleContext.userRole === "student" && (
//                 <li className="mb-2">
//                   <Link
//                     to="/home"
//                     className="text-white px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Home
//                   </Link>
//                 </li>
//               )}
//               {userRoleContext.userRole === "lecturer" && (
//                 <li className="mb-2">
//                   <Link
//                     to="/home"
//                     className="text-white px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Home
//                   </Link>
//                 </li>
//               )}
//               {userRoleContext.userRole === "admin" && (
//                 <li className="mb-2">
//                   <Link
//                     to="/admin/dashboard"
//                     className="text-white px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Dashboard
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </nav>

//           {/* Horizontal Top Navigation Pane */}
//           <div className="flex-1 flex flex-col">
//             <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//               {/* Place for logo or branding */}
//               <div>
//                 <Link to="/" className="text-xl font-bold text-gray-800">
//                   {userData.email} {/* Display the user's email */}
//                 </Link>
//               </div>

//               {/* User Dropdown */}
//               <div className="relative">
//                 <button
//                   className="flex items-center focus:outline-none"
//                   onClick={handleDropdown}
//                 >
//                   {/* Display user avatar */}
//                   <img
//                     src={`https://ui-avatars.com/api/?name=${userData.initials}&background=random&color=fff`}
//                     className="w-10 h-10 rounded-full"
//                     alt="User"
//                   />
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-10 rounded shadow-xl w-48">
//                     <div className="flex flex-col items-center px-4 py-3">
//                       {/* Display user avatar, name, and email */}
//                       <img
//                         src={`https://ui-avatars.com/api/?name=${userData.initials}&background=random&color=fff`}
//                         className="w-28 h-28 rounded-full"
//                         alt="User Avatar"
//                       />
//                       <div className="text-center px-4 py-3">
//                         <p className="text-sm text-gray-800 font-medium">
//                           {`${userData.firstName} ${userData.lastName}`}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {userData.email}
//                         </p>
//                       </div>
//                     </div>
//                     <ul className="list-none">
//                       {/* Add a "Logout" button */}
//                       <li className="py-2">
//                         <button
//                           onClick={() => {
//                             logout(); // Call the logout function from context
//                             navigate("/login"); // Redirect to login page
//                           }}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           Logout
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </nav>
//             {/* Main content area */}
//             <div className="flex-1 p-5">{/* Content goes here */}</div>
//           </div>
//         </div>
//       )}
//     </UserDataFetcher>
//   );
// };

// export default Navigation;
