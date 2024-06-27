import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Receipt from '../sales/Receipt';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const Sales = () => {
   const [sales, setSales] = useState([]);
   const [selectedReceipt, setSelectedReceipt] = useState(null);
   const [revenueStats, setRevenueStats] = useState({
      dailyRevenue: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0
   });
   const [userRole, setUserRole] = useState("");
   const [showVoidModal, setShowVoidModal] = useState(false);
   const [selectedSaleId, setSelectedSaleId] = useState(null);
   const [voidReason, setVoidReason] = useState("");

   const fetchSales = useCallback(async () => {
      try {
         const response = await axios.get(`${API_URL}/getSales`);
         setSales(response.data);
      } catch (error) {
         console.error("Error fetching sales:", error);
      }
   }, []);

   const fetchRevenueStatistics = useCallback(async () => {
      try {
         const response = await axios.get(`${API_URL}/revenueStatistics`);
         setRevenueStats(response.data);
      } catch (error) {
         console.error("Error fetching revenue statistics:", error);
      }
   }, []);

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         setUserRole(decodedToken.role);
      }
      fetchSales();
      fetchRevenueStatistics();
   }, [fetchSales, fetchRevenueStatistics]);

   const handleVoidSale = async () => {
      if (!selectedSaleId || !voidReason.trim()) return;

      try {
         const response = await axios.post(`${API_URL}/voidSale/${selectedSaleId}`, { reason: voidReason });
         fetchSales();
         setRevenueStats(response.data.revenueStats);
         setShowVoidModal(false);
         setSelectedSaleId(null);
         setVoidReason("");
         alert("Sale voided successfully");
      } catch (error) {
         console.error('Error voiding sale:', error);
         alert('Error voiding sale. Please try again.');
      }
   };

   const handleViewReceipt = (sale) => {
      setSelectedReceipt({
         items: sale.items,
         total: sale.total,
         discountType: sale.discountType,
         date: new Date(sale.date),
         saleId: sale._id,
         amountPaid: sale.amountPaid,
         change: sale.change
      });
   };

   return (
      <div>
         {userRole !== 'cashier' && (
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
         )}
         <h1 className={`text-lg font-semibold mb-3 ${userRole !== 'cashier' ? 'mt-4' : ''}`}>Transaction History</h1>
         <div className={`overflow-auto rounded-lg ${userRole === 'cashier' ? 'h-[calc(100vh-150px)]' : 'h-[calc(100vh-330px)]'}`}>
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
                           {sale.status === 'voided' ? (
                              <div>
                                 <span className="font-semibold text-red-600">Voided</span>
                                 {sale.voidReason && (
                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                       Reason: {sale.voidReason}
                                    </p>
                                 )}
                              </div>
                           ) : (
                              <h1 className='font-semibold text-green-600'>Successful</h1>
                           )}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                           <button
                              onClick={() => handleViewReceipt(sale)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-[5px] rounded-md text-xs mr-2"
                           >
                              View Receipt
                           </button>
                           {sale.status !== 'voided' && (
                              <button
                                 onClick={() => {
                                    setSelectedSaleId(sale._id);
                                    setShowVoidModal(true);
                                 }}
                                 className="bg-red-500 hover:bg-red-600 text-white px-2 py-[5px] rounded-md text-xs"
                              >
                                 Void
                              </button>
                           )}
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

         {showVoidModal && (
            <div className="fixed z-20 inset-0 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-lg font-semibold mb-4">Void Sale</h2>
                  <textarea
                     value={voidReason}
                     onChange={(e) => setVoidReason(e.target.value)}
                     placeholder="Enter reason for voiding the sale"
                     className="w-full outline-none border-gray-500 p-2 border rounded-md mb-4"
                     rows="3"
                  />
                  <div className="flex justify-end">
                     <button
                        onClick={() => {
                           setShowVoidModal(false);
                           setSelectedSaleId(null);
                           setVoidReason("");
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-sm text-white px-4 py-2 rounded-md mr-2"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleVoidSale}
                        className="bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-md"
                     >
                        Confirm Void
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Sales;