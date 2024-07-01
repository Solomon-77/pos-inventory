import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Receipt from '../sales/Receipt';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const Sales = () => {
   const [sales, setSales] = useState([]);
   const [returns, setReturns] = useState([]);
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
   const [otherReason, setOtherReason] = useState("");
   const [activeTab, setActiveTab] = useState("transactions");

   const fetchSales = useCallback(async () => {
      try {
         const response = await axios.get(`${API_URL}/getSales`);
         setSales(response.data);
         setReturns(response.data.filter(sale => sale.status === 'voided'));
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
      if (!selectedSaleId || (!voidReason && !otherReason)) return;

      const finalReason = voidReason === "Other" ? otherReason : voidReason;

      if (!window.confirm("Are you sure you want to void this sale? This action cannot be undone.")) {
         return;
      }

      try {
         const response = await axios.post(`${API_URL}/voidSale/${selectedSaleId}`, { reason: finalReason });
         fetchSales();
         setRevenueStats(response.data.revenueStats);
         setShowVoidModal(false);
         setSelectedSaleId(null);
         setVoidReason("");
         setOtherReason("");
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

   const handleReturn = async (saleId) => {
      if (!window.confirm("Are you sure you want to return these items to inventory?")) {
         return;
      }

      try {
         const response = await axios.post(`${API_URL}/returnStock/${saleId}`);
         setReturns(prevReturns => prevReturns.map(sale =>
            sale._id === saleId ? { ...sale, returnedToInventory: true } : sale
         ));
         setSales(prevSales => prevSales.map(sale =>
            sale._id === saleId ? { ...sale, returnedToInventory: true } : sale
         ));
         setRevenueStats(response.data.revenueStats);
         alert("Items returned to inventory successfully");
      } catch (error) {
         console.error('Error returning items:', error);
         alert('Error returning items. Please try again.');
      }
   };

   const renderReturnButton = (sale) => {
      if (sale.returnedToInventory) {
         return <span className="text-green-600 font-medium">Items Returned</span>;
      }

      if (sale.voidReason === "Expired Item" || sale.voidReason === "Damaged Item") {
         return <span className="text-red-600 font-medium">Cannot Return</span>;
      }

      return (
         <button
            onClick={() => handleReturn(sale._id)}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-[5px] rounded-md text-xs"
         >
            Return to Inventory
         </button>
      );
   };

   return (
      <div>
         {userRole !== 'cashier' && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
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

         <div className="flex mb-4">
            <button
               className={`mr-2 px-4 py-2 rounded-t-lg ${activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
               onClick={() => setActiveTab('transactions')}
            >
               Transaction History
            </button>
            <button
               className={`px-4 py-2 rounded-t-lg ${activeTab === 'returns' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
               onClick={() => setActiveTab('returns')}
            >
               Returns
            </button>
         </div>

         <div className={`overflow-auto rounded-lg ${userRole === 'cashier' ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-380px)]'}`}>
            {activeTab === 'transactions' ? (
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
                                 <span className="font-semibold text-green-600">Successful</span>
                              )}
                           </td>
                           <td className="p-2 whitespace-nowrap border">
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
            ) : (
               <table className="min-w-full bg-white shadow-md">
                  <thead className="bg-gray-100">
                     <tr>
                        <th className="py-2 px-4 border font-medium">Date</th>
                        <th className="py-2 px-4 border font-medium">Items</th>
                        <th className="py-2 px-4 border font-medium">Reason</th>
                        <th className="py-2 px-4 border font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {returns.map((sale) => (
                        <tr className='text-sm text-center' key={sale._id}>
                           <td className="py-2 px-4 border">{new Date(sale.date).toLocaleString()}</td>
                           <td className="py-2 px-4 border">
                              <div className="max-h-[60px] overflow-y-auto">
                                 <ul>
                                    {sale.items.map((item, itemIndex) => (
                                       <li key={itemIndex}>{item.name} x {item.quantity}</li>
                                    ))}
                                 </ul>
                              </div>
                           </td>
                           <td className="py-2 px-4 border">{sale.voidReason}</td>
                           <td className="p-2 whitespace-nowrap border">
                              {renderReturnButton(sale)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>

         {selectedReceipt && (
            <div className='print:absolute print:h-screen print:w-full print:bg-white print:top-0 print:left-0 print:flex print:justify-center'>

               <div className="fixed print:absolute print:inset-auto print:top-0 z-20 inset-0 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center print:bg-transparent print:p-0">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full relative print:shadow-none print:p-0">
                     <Receipt data={selectedReceipt} />
                     <div className="mt-4 flex justify-between print:hidden">
                        <button
                           onClick={() => setSelectedReceipt(null)}
                           className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-[5px] px-4 rounded-md"
                        >
                           Close
                        </button>
                        <button
                           onClick={() => window.print()}
                           className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-[5px] rounded-md"
                        >
                           Print
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {showVoidModal && (
            <div className="fixed z-20 inset-0 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-lg font-semibold mb-4">Void Sale</h2>
                  <select
                     value={voidReason}
                     onChange={(e) => setVoidReason(e.target.value)}
                     className="w-full outline-none border-gray-500 p-2 border rounded-md mb-4"
                  >
                     <option value="">Select a reason</option>
                     <option value="Expired Item">Expired Item</option>
                     <option value="Damaged Item">Damaged Item</option>
                     <option value="Wrong Brand">Wrong Brand</option>
                     <option value="Wrong Item">Wrong Item</option>
                     <option value="Other">Other</option>
                  </select>
                  {voidReason === "Other" && (
                     <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Please specify the reason"
                        className="w-full outline-none border-gray-500 p-2 border rounded-md mb-4"
                        rows="3"
                     />
                  )}
                  <div className="flex justify-end">
                     <button
                        onClick={() => {
                           setShowVoidModal(false);
                           setSelectedSaleId(null);
                           setVoidReason("");
                           setOtherReason("");
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