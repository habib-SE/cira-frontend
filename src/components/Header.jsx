// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import Stars from "../assets/stars.svg"
// export default function Header() {
//   const location = useLocation();
//   const isAssistantPage = location.pathname === "/login";

//   return (
//     <header className="w-full" >
//       <div className="max-w-8xl mx-auto px-7 pt-2">
//         <div className="flex justify-between items-center h-12">
//           {/* Logo - Left Side */}
//           <div className="flex-shrink-0 flex gap-2 items-center">

//             <img src={Stars} alt="stars logo" className="w-[20%]"/>
//             <Link to="/" className="text-xl font-semibold text-gray-900">
//               Cira
//             </Link>
//           </div>

//           {/* Navigation - Right Side (hide on /assistant) */}
//           {!isAssistantPage && (
//             <nav className="flex items-center space-x-8">
//               <Link
//                 to="/login"
//                 className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 px-3 py-1 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group"
//               >
//                 <span className="relative z-10">Login</span>
//                 <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
//               </Link>
//             </nav>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Stars from "../assets/stars.svg";

export default function Header({ className = "" }) {
  const location = useLocation();
  const isAssistantPage = location.pathname === "/login";

return (
  // Mobile: solid bg  •  Large screens: transparent
  <header className={`w-full bg-[#FFFEF9] lg:bg-transparent z-50 ${className}`}>
    <div className="max-w-8xl mx-auto px-7 pt-2">
      <div className="flex justify-between items-center h-12">
        {/* Logo - Left Side */}
        <div className="flex-shrink-0 flex gap-2 items-center">
          <img src={Stars} alt="stars logo" className="w-[20%]" />
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Cira
          </Link>
        </div>

        {/* Navigation - Right Side (hide on /assistant) */}
        {!isAssistantPage && (
          <nav className="flex items-center space-x-8">
            <Link
              to="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 px-3 py-1 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
            </Link>
          </nav>
        )}
      </div>
    </div>
  </header>
);

}
