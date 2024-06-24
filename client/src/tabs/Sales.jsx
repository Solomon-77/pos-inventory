import { useState, useEffect } from 'react';
import axios from 'axios';
import Receipt from '../sales/Receipt';

const API_URL = import.meta.env.VITE_API_URL;

const OrderStatusSelect = ({ status, saleId, onStatusChange }) => {
   const [currentStatus, setCurrentStatus] = useState(status);

   const handleChange = async (e) => {
      const newStatus = e.target.value;
      setCurrentStatus(newStatus);
      try {
         await axios.put(`${API_URL}/updateSaleStatus/${saleId}`, { status: newStatus });
         onStatusChange(saleId, newStatus);
      } catch (error) {
         console.error('Error updating sale status:', error);
         setCurrentStatus(status); // Revert to original status if update fails
      }
   };

   return (
      <select
         value={currentStatus}
         onChange={handleChange}
         className="p-1 border rounded"
      >
         <option value="pending">Pending</option>
         <option value="paid">Paid</option>
         <option value="cancelled">Cancelled</option>
      </select>
   );
};

const Sales = () => {
   const [sales, setSales] = useState([]);
   const [selectedReceipt, setSelectedReceipt] = useState(null);
   const [revenueStats, setRevenueStats] = useState({
      dailyRevenue: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0
   });

   useEffect(() => {
      fetchSales();
      fetchRevenueStatistics();
   }, []);

   const fetchSales = async () => {
      try {
         const response = await axios.get(`${API_URL}/getSales`);
         setSales(response.data);
      } catch (error) {
         console.error("Error fetching sales:", error);
      }
   };

   const fetchRevenueStatistics = async () => {
      try {
         const response = await axios.get(`${API_URL}/revenueStatistics`);
         setRevenueStats(response.data);
      } catch (error) {
         console.error("Error fetching revenue statistics:", error);
      }
   };

   const handleStatusChange = (saleId, newStatus) => {
      setSales(sales.map(sale =>
         sale._id === saleId ? { ...sale, status: newStatus } : sale
      ));
   };

   const handleViewReceipt = (sale) => {
      setSelectedReceipt({
         items: sale.items,
         total: sale.total,
         discountType: sale.discountType,
         date: new Date(sale.date),
         saleId: sale._id
      });
   };

   return (
      <div>
         <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-4">Revenue Overview</h2>
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
         <h1 className="text-lg font-semibold mb-3 mt-4">Transaction History</h1>
         <div className="overflow-auto rounded-lg h-[calc(100vh-330px)]">
            <table className="min-w-full bg-white shadow-md">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="py-2 px-4 border font-medium">Date</th>
                     <th className="py-2 px-4 border font-medium">Total</th>
                     <th className="py-2 px-4 border font-medium">Discount Type</th>
                     <th className="py-2 px-4 border font-medium">Items</th>
                     <th className="py-2 px-4 border font-medium">Order Status</th>
                     <th className="py-2 px-4 border font-medium">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {sales.map((sale) => (
                     <tr className='text-sm text-center' key={sale._id}>
                        <td className="py-2 px-4 border">{new Date(sale.date).toLocaleString()}</td>
                        <td className="py-2 px-4 border">P{sale.total.toFixed(2)}</td>
                        <td className="py-2 px-4 border">{sale.discountType || 'None'}</td>
                        <td className="py-2 px-4 border">
                           <div className="max-h-[60px] overflow-y-auto">
                              <ul>
                                 {sale.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item.name} x {item.quantity}</li>
                                 ))}
                              </ul>
                           </div>
                        </td>
                        <td className="py-2 px-4 border">
                           <OrderStatusSelect
                              status={sale.status}
                              saleId={sale._id}
                              onStatusChange={handleStatusChange}
                           />
                        </td>
                        <td className="py-2 px-4 border">
                           <button
                              onClick={() => handleViewReceipt(sale)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-[5px] rounded-md text-xs"
                           >
                              View Receipt
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>


         {selectedReceipt && (
            <div className="fixed z-20 inset-0 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <Receipt data={selectedReceipt} />
                  <button
                     onClick={() => setSelectedReceipt(null)}
                     className="mt-4 bg-gray-600 hover:bg-gray-700 text-white text-sm py-[5px] px-4 rounded-md"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default Sales;