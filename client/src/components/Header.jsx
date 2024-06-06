import { Outlet, useLocation } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import PropTypes from "prop-types"

const Header = ({ toggle, setToggle }) => {

   const location = useLocation();
   const pathNames = {
      "/": "Dashboard",
      "/pos": "Point of Sale",
      "/inventory": "Inventory",
      "/sales": "Sales",
      "/settings": "Settings"
   };

   const currentPathName = pathNames[location.pathname]

   return (
      <div className="grid grid-rows-[auto,1fr] p-4 overflow-auto">
         <nav className="flex items-center justify-between rounded-lg mb-4">
            <div className='flex items-center'>
               <IoMdMenu onClick={() => setToggle(!toggle)} className="text-4xl md:hidden mr-3 cursor-pointer" />
               <h1 className="font-bold text-lg">{currentPathName}</h1>
            </div>
            <div className="bg-white flex items-center px-3 py-2 rounded-lg shadow-md">
               <div className="h-9 w-9 bg-black rounded-full mr-3"></div>
               <div className="text-sm">
                  <h1 className='font-semibold'>Username</h1>
                  <h1 className='text-neutral-500'>Cashier</h1>
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
