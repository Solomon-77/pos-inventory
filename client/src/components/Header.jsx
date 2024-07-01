import { Outlet, useLocation } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from 'axios';
import { IoNotifications } from "react-icons/io5";
import ReportModal from "../inventory/ReportModal";

const URL = import.meta.env.VITE_API_URL;
const DEFAULT_CRITICAL_LEVEL = 20; // Default critical level if not set for a product

const Header = ({ toggle, setToggle }) => {
   const location = useLocation();
   const pathNames = {
      "/dashboard": "Dashboard",
      "/pos": "Point of Sale",
      "/inventory": "Inventory",
      "/sales": "Sales",
      "/print": "Print",
      "/maintenance": "Maintenance",
      "/help": "Help",
      "/about": "About Us",
      "/settings": "Settings"
   };

   const currentPathName = pathNames[location.pathname];

   const [userInfo, setUserInfo] = useState({ username: '', email: '', role: '' });
   const [lowStockCount, setLowStockCount] = useState(0);
   const [outOfStockCount, setOutOfStockCount] = useState(0);
   const [showNotification, setShowNotification] = useState(false);
   const [showLowStockReport, setShowLowStockReport] = useState(false);
   const [showOutOfStockReport, setShowOutOfStockReport] = useState(false);
   const [lowStockItems, setLowStockItems] = useState([]);
   const [outOfStockItems, setOutOfStockItems] = useState([]);

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

      const fetchStockItems = async () => {
         try {
            const response = await axios.get(`${URL}/getAll`);
            const allProducts = Object.values(response.data).flat();
            const lowStockProducts = allProducts.filter(product =>
               product.quantity <= (product.criticalLevel || DEFAULT_CRITICAL_LEVEL) && product.quantity > 0
            );
            const outOfStockProducts = allProducts.filter(product => product.quantity === 0);
            setLowStockCount(lowStockProducts.length);
            setLowStockItems(lowStockProducts);
            setOutOfStockCount(outOfStockProducts.length);
            setOutOfStockItems(outOfStockProducts);
         } catch (error) {
            console.error('Error fetching stock items:', error);
         }
      };

      fetchUserInfo();
      fetchStockItems();
   }, []);

   const handleNotificationClick = () => {
      setShowNotification(!showNotification);
   };

   const handleLowStockClick = () => {
      setShowLowStockReport(true);
      setShowNotification(false);
   };

   const handleOutOfStockClick = () => {
      setShowOutOfStockReport(true);
      setShowNotification(false);
   };

   return (
      <div className="grid grid-rows-[auto,1fr] p-4 overflow-auto">
         <nav className="flex items-center justify-between rounded-lg mb-4">
            <div className='flex items-center'>
               <IoMdMenu onClick={() => setToggle(!toggle)} className="text-4xl print:hidden md:hidden mr-3 cursor-pointer" />
               <h1 className="font-bold text-lg print:hidden">{currentPathName}</h1>
            </div>
            <div className='flex items-center'>
               <div className="relative">
                  <IoNotifications
                     onClick={handleNotificationClick}
                     className='text-2xl mr-6 text-gray-700 cursor-pointer print:hidden'
                  />
                  {(lowStockCount > 0 || outOfStockCount > 0) && (
                     <span className="absolute print:hidden top-0 right-[18px] inline-flex items-center justify-center p-1 text-xs leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {lowStockCount + outOfStockCount}
                     </span>
                  )}
                  {showNotification && (
                     <div className="absolute right-4 mt-2 w-60 bg-white rounded-md overflow-hidden shadow-xl z-50">
                        <div
                           className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                           onClick={handleLowStockClick}
                        >
                           Low Stock Items: <span className='font-bold'>{lowStockCount}</span>
                        </div>
                        <div
                           className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                           onClick={handleOutOfStockClick}
                        >
                           Out of Stock Items: <span className='font-bold'>{outOfStockCount}</span>
                        </div>
                     </div>
                  )}
               </div>
               <div className="bg-white print:hidden flex items-center px-3 py-2 rounded-lg shadow-md">
                  <div className="text-sm">
                     <h1 className='font-semibold'>{userInfo.username}</h1>
                     <h1 className='text-gray-500'>{userInfo.role}</h1>
                  </div>
               </div>
            </div>
         </nav>
         <Outlet />
         {showLowStockReport && (
            <ReportModal
               report={{
                  title: "Low Stock Alert",
                  data: lowStockItems.map(item => ({
                     name: item.name,
                     quantity: item.quantity,
                     category: item.category,
                     price: item.price,
                     criticalLevel: item.criticalLevel || DEFAULT_CRITICAL_LEVEL
                  }))
               }}
               onClose={() => setShowLowStockReport(false)}
            />
         )}
         {showOutOfStockReport && (
            <ReportModal
               report={{
                  title: "Out of Stock Items",
                  data: outOfStockItems.map(item => ({
                     name: item.name,
                     quantity: item.quantity,
                     category: item.category,
                     price: item.price,
                     criticalLevel: item.criticalLevel || DEFAULT_CRITICAL_LEVEL
                  }))
               }}
               onClose={() => setShowOutOfStockReport(false)}
            />
         )}
      </div>
   );
};

Header.propTypes = {
   toggle: PropTypes.bool.isRequired,
   setToggle: PropTypes.func.isRequired,
};

export default Header;