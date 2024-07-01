import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;
const FAST_MOVING_THRESHOLD = 40;
const SLOW_MOVING_THRESHOLD = 50;
const DEFAULT_CRITICAL_LEVEL = 20;

const COMPANY_NAME = "GenMed Pharmacy";
const COMPANY_ADDRESS = "Blk 1 Lot 34 Daang Bakal, Burgos Rod Rizal";

const Print = () => {
   const [revenueStats, setRevenueStats] = useState({
      dailyRevenue: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0
   });
   const [lowStockItems, setLowStockItems] = useState([]);
   const [outOfStockItems, setOutOfStockItems] = useState([]);
   const [fastMovingItems, setFastMovingItems] = useState([]);
   const [slowMovingItems, setSlowMovingItems] = useState([]);
   const [selectedCategories, setSelectedCategories] = useState({
      lowStock: false,
      outOfStock: false,
      fastMoving: false,
      slowMoving: false
   });

   useEffect(() => {
      fetchRevenueStatistics();
      fetchProducts();
   }, []);

   const fetchRevenueStatistics = async () => {
      try {
         const response = await axios.get(`${API_URL}/revenueStatistics`);
         setRevenueStats(response.data);
      } catch (error) {
         console.error("Error fetching revenue statistics:", error);
      }
   };

   const fetchProducts = async () => {
      try {
         const response = await axios.get(`${API_URL}/getAll`);
         const data = response.data;
         const allProducts = Object.values(data).flat();

         setLowStockItems(allProducts.filter(p => p.quantity <= (p.criticalLevel || DEFAULT_CRITICAL_LEVEL) && p.quantity > 0));
         setOutOfStockItems(allProducts.filter(p => p.quantity === 0));
         setFastMovingItems(allProducts.filter(p => p.quantity <= FAST_MOVING_THRESHOLD));
         setSlowMovingItems(allProducts.filter(p => p.quantity >= SLOW_MOVING_THRESHOLD));
      } catch (error) {
         console.error("Error fetching products:", error);
      }
   };

   const revenueData = [
      { name: 'Daily', revenue: revenueStats.dailyRevenue },
      { name: 'Weekly', revenue: revenueStats.weeklyRevenue },
      { name: 'Monthly', revenue: revenueStats.monthlyRevenue }
   ];

   const renderItemTable = (items, title) => (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
         <h2 className="text-xl font-bold mb-4">{title}</h2>
         <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="py-2 px-4 border-b text-left">Name</th>
                     <th className="py-2 px-4 border-b text-left">Quantity</th>
                     <th className="py-2 px-4 border-b text-left">Price</th>
                  </tr>
               </thead>
               <tbody>
                  {items.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b">{item.name}</td>
                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                        <td className="py-2 px-4 border-b">P{item.price}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );

   const handlePrint = () => {
      window.print();
   };

   const handleCategoryChange = (category) => {
      setSelectedCategories(prev => ({ ...prev, [category]: !prev[category] }));
   };

   return (
      <div className="mt-2">
         <div className="text-center mb-5">
            <h1 className="text-xl font-bold">{COMPANY_NAME}</h1>
            <p className="text-gray-600">{COMPANY_ADDRESS}</p>
            <p className="text-gray-600">Contact No.</p>
         </div>

         <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Inventory and Revenue Report</h1>
            <button
               onClick={handlePrint}
               className="bg-blue-500 print:hidden shadow-md text-white px-3 py-2 text-sm rounded-md flex items-center space-x-2 no-print"
            >
               <span className='print:hidden'>Print Report</span>
            </button>
         </div>

         <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
               <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-100 p-4 text-center rounded-lg">
                     <h3 className="text-gray-600 font-medium">Daily Revenue</h3>
                     <p className="font-bold text-2xl mt-1">P{revenueStats.dailyRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-4 text-center rounded-lg">
                     <h3 className="text-gray-600 font-medium">Weekly Revenue</h3>
                     <p className="font-bold text-2xl mt-1">P{revenueStats.weeklyRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-100 p-4 text-center rounded-lg">
                     <h3 className="text-gray-600 font-medium">Monthly Revenue</h3>
                     <p className="font-bold text-2xl mt-1">P{revenueStats.monthlyRevenue.toFixed(2)}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
               <h2 className="text-xl font-bold mb-4">Revenue Statistics</h2>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="mb-6 no-print">
               <h2 className="text-lg print:hidden font-semibold mb-2">Select categories to include:</h2>
               <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                     <input
                        className='print:hidden'
                        type="checkbox"
                        checked={selectedCategories.lowStock}
                        onChange={() => handleCategoryChange('lowStock')}
                     />
                     <span className="print:hidden">Low Stock</span>
                  </label>
                  <label className="flex items-centeFr space-x-2">
                     <input
                        className='print:hidden'
                        type="checkbox"
                        checked={selectedCategories.outOfStock}
                        onChange={() => handleCategoryChange('outOfStock')}
                     />
                     <span className="print:hidden">Out of Stock</span>
                  </label>
                  <label className="flex items-center space-x-2">
                     <input
                        className='print:hidden'
                        type="checkbox"
                        checked={selectedCategories.fastMoving}
                        onChange={() => handleCategoryChange('fastMoving')}
                     />
                     <span className="print:hidden">Fast Moving</span>
                  </label>
                  <label className="flex items-center space-x-2">
                     <input
                        className='print:hidden'
                        type="checkbox"
                        checked={selectedCategories.slowMoving}
                        onChange={() => handleCategoryChange('slowMoving')}
                     />
                     <span className="print:hidden">Slow Moving</span>
                  </label>
               </div>
            </div>

            {selectedCategories.lowStock && renderItemTable(lowStockItems, "Low Stock Items")}
            {selectedCategories.outOfStock && renderItemTable(outOfStockItems, "Out of Stock Items")}
            {selectedCategories.fastMoving && renderItemTable(fastMovingItems, "Fast-Moving Items")}
            {selectedCategories.slowMoving && renderItemTable(slowMovingItems, "Slow-Moving Items")}
         </div>
      </div>
   );
};

export default Print;