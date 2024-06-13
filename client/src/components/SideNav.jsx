import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { MdOutlineDashboard, MdOutlineInventory2 } from "react-icons/md";
import { TbProgressAlert } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const SideNav = ({ toggle, setToggle }) => {
   const location = useLocation();
   const navigate = useNavigate();
   const [userRole, setUserRole] = useState("");

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         setUserRole(decodedToken.role);
      }
   }, []);

   const isActive = (path) => {
      return location.pathname === path
         ? "bg-gray-300 duration-200 ease-out" // if path is active
         : "text-gray-600"; // if path is not active
   };

   const style = "py-2 px-4 rounded-md font-medium flex items-center";

   const close = () => {
      setToggle(!toggle);
   };

   const handleLogout = () => {
      localStorage.removeItem('hasReloaded');
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login'); // Navigate to login page
   };

   return (
      <div className={`p-5 h-screen flex flex-col justify-between shadow-2xl md:shadow-transparent bg-gray-200 absolute md:static w-[250px] -translate-x-[250px] md:translate-x-0 duration-200 ease-out ${toggle ? "translate-x-0" : ""}`}>
         <div>
            <div className="flex items-center justify-between border mb-5">
               <h1 className="font-bold text-lg">GenMed Pharmacy</h1>
               <IoMdClose onClick={close} className="text-3xl md:hidden cursor-pointer" />
            </div>
            <div className="flex flex-col">
               <Link onClick={close} to="/dashboard" className={`${isActive("/dashboard")} ${style}`}>
                  <FiHome className="mr-3" />Dashboard
               </Link>
               <Link onClick={close} to="/pos" className={`${isActive("/pos")} ${style}`}>
                  <MdOutlineDashboard className="mr-3" />Point of Sale
               </Link>
               {userRole === "admin" && (
                  <Link onClick={close} to="/inventory" className={`${isActive("/inventory")} ${style}`}>
                     <MdOutlineInventory2 className="mr-3" />Inventory
                  </Link>
               )}
               <Link onClick={close} to="/sales" className={`${isActive("/sales")} ${style}`}>
                  <TbProgressAlert className="mr-3" />Sales
               </Link>
               <Link onClick={close} to="/settings" className={`${isActive("/settings")} ${style}`}>
                  <IoSettingsOutline className="mr-3" />Settings
               </Link>
            </div>
         </div>
         <button onClick={handleLogout} className={`${style}`}>
            <BiLogOut className="mr-3" />Logout
         </button>
      </div>
   );
};

SideNav.propTypes = {
   toggle: PropTypes.bool.isRequired,
   setToggle: PropTypes.func.isRequired,
};

export default SideNav;
