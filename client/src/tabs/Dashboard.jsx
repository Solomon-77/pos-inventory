import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
   const [userRole, setUserRole] = useState("");
   const [dashboardData, setDashboardData] = useState({
      dailySales: 0,
      inventoryCount: 0,
      ordersToday: 0,
      topSellingItem: '',
      recentOrders: [],
      lowStockItems: [],
      expiredStocks: [],
      revenueData: {}
   });

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         setUserRole(decodedToken.role);
      }
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         const [dashboardResponse, revenueResponse] = await Promise.all([
            axios.get(`${API_URL}/dashboardData`),
            axios.get(`${API_URL}/revenueStatistics`)
         ]);

         const revenueData = [
            { name: 'Daily', revenue: revenueResponse.data.dailyRevenue },
            { name: 'Weekly', revenue: revenueResponse.data.weeklyRevenue },
            { name: 'Monthly', revenue: revenueResponse.data.monthlyRevenue }
         ];

         setDashboardData({
            ...dashboardResponse.data,
            dailySales: revenueResponse.data.dailyRevenue,
            revenueData: revenueData
         });
      } catch (error) {
         console.error("Error fetching dashboard data:", error);
      }
   };

   return (
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="font-bold text-xl mb-4">Overview</h1>
            <div className={`grid gap-6 ${userRole === 'cashier' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
               {userRole !== 'cashier' && (
                  <div className="bg-blue-100 p-4 text-center rounded-lg flex flex-col justify-center items-center">
                     <h1 className="font-bold text-2xl">P{dashboardData.dailySales.toFixed(2)}</h1>
                     <h1 className="text-gray-600 font-medium">Daily Sales</h1>
                  </div>
               )}
               <div className="bg-green-100 p-4 text-center rounded-lg flex flex-col justify-center items-center">
                  <h1 className="font-bold text-2xl">{dashboardData.inventoryCount}</h1>
                  <h1 className="text-gray-600 font-medium">Inventory Items</h1>
               </div>
               <div className="bg-yellow-100 p-4 text-center rounded-lg flex flex-col justify-center items-center">
                  <h1 className="font-bold text-2xl">{dashboardData.ordersToday}</h1>
                  <h1 className="text-gray-600 font-medium">Orders Today</h1>
               </div>
               <div className="bg-purple-100 p-4 text-center rounded-lg flex flex-col justify-center items-center">
                  <h1 className="font-bold text-xl">{dashboardData.topSellingItem}</h1>
                  <h1 className="text-gray-600 font-medium">Top Selling Item</h1>
               </div>
            </div>
         </div>

         {userRole !== 'cashier' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-xl mb-4">Revenue Statistics</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.revenueData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
               <ul className="space-y-2 h-[calc(100vh-400px)] overflow-auto text-sm">
                  {dashboardData.recentOrders.map((order, index) => (
                     <li key={index} className="flex justify-between items-center">
                        <span>{order.id}</span>
                        <span>P{order.total.toFixed(2)}</span>
                     </li>
                  ))}
               </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-lg mb-3">Low Stock Items</h2>
               <ul className="space-y-2 h-[calc(100vh-400px)] overflow-auto text-sm">
                  {dashboardData.lowStockItems.map((item, index) => (
                     <li key={index} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-red-500 mr-2">{item.quantity} left</span>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;