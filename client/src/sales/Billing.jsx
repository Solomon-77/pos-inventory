import { useState } from 'react';

const Billing = ({ cart, total, onCancel, onConfirm }) => {
   const [amountPaid, setAmountPaid] = useState('');
   const change = amountPaid ? Math.max(0, (parseFloat(amountPaid) - total)).toFixed(2) : '0.00';

   const handleConfirm = () => {
      if (parseFloat(amountPaid) < total) {
         alert("Amount paid must be greater than or equal to the total.");
         return;
      }
      onConfirm(parseFloat(amountPaid));
   };

   return (
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto">
         <h2 className="text-lg font-bold text-center mb-4">Billing</h2>
         <p className="text-sm mb-4">Date: {new Date().toLocaleString()}</p>

         <div className="max-h-[calc(100vh-400px)] overflow-y-auto mb-4">
            <table className="w-full">
               <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                     <th className="text-left py-2">Item</th>
                     <th className="text-right py-2">Unit Price</th>
                     <th className="text-right py-2">Qty</th>
                     <th className="text-right py-2">Total</th>
                  </tr>
               </thead>
               <tbody>
                  {cart.map((item, index) => (
                     <tr key={index} className="border-b text-sm">
                        <td className="py-1 w-[150px]">{item.name}</td>
                        <td className="text-right">P{item.price.toFixed(2)}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">P{(item.price * item.quantity).toFixed(2)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="flex justify-between font-bold mb-2">
            <span>Total:</span>
            <span>P{total.toFixed(2)}</span>
         </div>

         <h1 className='text-center font-bold mb-2'>Payment</h1>

         <div className="mb-2">
            <label className="block mb-2">Pay Amount:</label>
            <input
               type="number"
               value={amountPaid}
               onChange={(e) => setAmountPaid(e.target.value)}
               className="w-full p-2 rounded text-sm outline-none border border-gray-300"
            />
         </div>

         <div className="flex justify-between font-bold mb-4">
            <span>Change:</span>
            <span>P{change}</span>
         </div>

         <div className="flex justify-between">
            <button onClick={onCancel} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
               Cancel
            </button>
            <button onClick={handleConfirm} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
               Confirm
            </button>
         </div>
      </div>
   );
};

export default Billing;