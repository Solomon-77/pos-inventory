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

   useEffect(() => {
      fetchSales();
   }, []);

   const fetchSales = async () => {
      try {
         const response = await axios.get(`${API_URL}/getSales`);
         setSales(response.data);
      } catch (error) {
         console.error("Error fetching sales:", error);
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
         receiptNumber: sale.receiptNumber
      });
   };

   return (
      <div>
         <h1 className="text-lg font-semibold mb-4">Transaction History</h1>
         <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="py-2 px-4 border">Date</th>
                     <th className="py-2 px-4 border">Receipt Number</th>
                     <th className="py-2 px-4 border">Total</th>
                     <th className="py-2 px-4 border">Discount Type</th>
                     <th className="py-2 px-4 border">Items</th>
                     <th className="py-2 px-4 border">Order Status</th>
                     <th className="py-2 px-4 border">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {sales.map((sale) => (
                     <tr className='text-sm text-center' key={sale._id}>
                        <td className="py-2 px-4 border">{new Date(sale.date).toLocaleString()}</td>
                        <td className="py-2 px-4 border">{sale.receiptNumber}</td>
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
                              className="bg-blue-500 text-white px-2 py-1 rounded"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-lg">
                  <Receipt data={selectedReceipt} />
                  <button
                     onClick={() => setSelectedReceipt(null)}
                     className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
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