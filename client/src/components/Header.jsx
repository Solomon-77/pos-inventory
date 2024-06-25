import { Outlet, useLocation } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

const Header = ({ toggle, setToggle }) => {
   const location = useLocation();
   const pathNames = {
      "/dashboard": "Dashboard",
      "/pos": "Point of Sale",
      "/inventory": "Inventory",
      "/sales": "Sales",
      "/maintenance": "Maintenance",
      "/help": "Help",
      "/about": "About Us",
      "/settings": "Settings"
   };

   const currentPathName = pathNames[location.pathname];

   const [userInfo, setUserInfo] = useState({ username: '', email: '', role: '' });

   useEffect(() => {
      const fetchUserInfo = async () => {
         try {
            const response = await axios.get(`${URL}/user-info`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUserInfo(response.data);
         } catch (error) {
            console.error('Error fetching user info:', error);
         }
      };

      fetchUserInfo();
   }, []);

   return (
      <div className="grid grid-rows-[auto,1fr] p-4 overflow-auto">
         <nav className="flex items-center justify-between rounded-lg mb-4">
            <div className='flex items-center'>
               <IoMdMenu onClick={() => setToggle(!toggle)} className="text-4xl md:hidden mr-3 cursor-pointer" />
               <h1 className="font-bold text-lg">{currentPathName}</h1>
            </div>
            <div className="bg-white flex items-center px-3 py-2 rounded-lg shadow-md">
               <div className="text-sm">
                  <h1 className='font-semibold'>{userInfo.username}</h1>
                  <h1 className='text-gray-500'>{userInfo.role}</h1>
               </div>
            </div>
         </nav>
         <Outlet />
      </div>
   );
};

Header.propTypes = {
   toggle: PropTypes.bool.isRequired,
   setToggle: PropTypes.func.isRequired,
};

export default Header;