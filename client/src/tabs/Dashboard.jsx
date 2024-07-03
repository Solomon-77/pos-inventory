import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
            { name: 'Day 1', daily: parseFloat(revenueResponse.data.dailyRevenue.toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 2', daily: parseFloat((revenueResponse.data.dailyRevenue * 1.1).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 3', daily: parseFloat((revenueResponse.data.dailyRevenue * 0.9).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 4', daily: parseFloat((revenueResponse.data.dailyRevenue * 1.2).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 5', daily: parseFloat((revenueResponse.data.dailyRevenue * 0.8).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 6', daily: parseFloat((revenueResponse.data.dailyRevenue * 1.3).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
            { name: 'Day 7', daily: parseFloat((revenueResponse.data.dailyRevenue * 1.1).toFixed(2)), weekly: parseFloat((revenueResponse.data.weeklyRevenue / 7).toFixed(2)), monthly: parseFloat((revenueResponse.data.monthlyRevenue / 30).toFixed(2)) },
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
                  <h1 className="text-gray-600 font-medium">Most Sold Item</h1>
               </div>
            </div>
         </div>

         {userRole !== 'cashier' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-xl mb-4">Revenue Statistics</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.revenueData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Line type="monotone" dataKey="daily" stroke="#8884d8" name="Daily Revenue" />
                     <Line type="monotone" dataKey="weekly" stroke="#82ca9d" name="Weekly Revenue (Avg)" />
                     <Line type="monotone" dataKey="monthly" stroke="#ffc658" name="Monthly Revenue (Avg)" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
               <div className='flex justify-between font-medium mb-3'>
                  <h1>Sales ID</h1>
                  <h1>Total Amount</h1>
               </div>
               <ul className="space-y-2 h-[calc(100vh-430px)] overflow-auto text-sm">
                  {dashboardData.recentOrders.map((order, index) => (
                     <li key={index} className="flex justify-between items-center text-gray-700">
                        <span>{order.id}</span>
                        <span>P{order.total.toFixed(2)}</span>
                     </li>
                  ))}
               </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="font-bold text-lg mb-3">List of Low Stock Items</h2>
               <ul className="space-y-2 h-[calc(100vh-400px)] overflow-auto text-sm text-gray-700">
                  {dashboardData.lowStockItems.map((item, index) => (
                     <li key={index} className="flex justify-between items-center">
                        <span>{item.name}</span>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;