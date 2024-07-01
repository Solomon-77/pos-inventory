const Receipt = ({ data }) => {
   const { items, total, discountType, date, saleId, amountPaid, change } = data;

   return (
      <div className="max-w-md mx-auto">
         <h2 className="text-lg font-bold text-center mb-3">Receipt</h2>

         <div className="text-center mb-4">
            <h3 className="font-bold">GenMed Pharmacy</h3>
            <p className="text-sm">Blk 1 Lot 34 Daang Bakal, Burgos Rod Rizal</p>
            <p className="text-sm">Phone: (000) 000-0000</p>
         </div>

         <p className="text-sm">Date: {date.toLocaleString()}</p>
         <p className="text-sm mb-1">Sale ID: {saleId}</p>

         <div className="max-h-[calc(100vh-450px)] print:max-h-full overflow-y-auto mb-4">
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

         <h1 className="text-center text-gray-500 text-sm italic mb-1 mt-3">THIS RECEIPT IS NOT VALID FOR CLAIMING INPUT TAX.</h1>
      </div>
   );
};

export default Receipt;