const Receipt = ({ data }) => {
   const { items, total, discountType, date, saleId, amountPaid, change } = data;

   return (
      <div className="max-w-md mx-auto">
         <h2 className="text-lg font-bold text-center mb-4">Receipt</h2>
         <p className="text-sm mb-2">Date: {date.toLocaleString()}</p>
         <p className="text-sm mb-4">Sale ID: {saleId}</p>

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
                  {items.map((item, index) => (
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

         {discountType && (
            <p className="text-sm mb-2">Discount Applied: {discountType}</p>
         )}

         <div className="flex justify-between mb-2">
            <span>Amount Paid:</span>
            <span>P{amountPaid.toFixed(2)}</span>
         </div>

         <div className="flex justify-between font-bold">
            <span>Change:</span>
            <span>P{change.toFixed(2)}</span>
         </div>
      </div>
   );
};

export default Receipt;