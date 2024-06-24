
const ReportModal = ({ report, onClose }) => {
   return (
      <div className="fixed z-20 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
         <div className="bg-white p-5 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{report.title}</h2>
            <div className="max-h-96 overflow-y-auto">
               {report.data.map((item, index) => (
                  <div key={index} className="mb-2 p-2 text-sm bg-gray-100 rounded">
                     <p><strong style={{ fontWeight: 600 }}>Name:</strong> {item.name}</p>
                     <p><strong style={{ fontWeight: 600 }}>Quantity:</strong> {item.quantity}</p>
                     {item.price && <p><strong style={{ fontWeight: 600 }}>Price:</strong> P{item.price}</p>}
                     {item.category && <p><strong style={{ fontWeight: 600 }}>Category:</strong> {item.category}</p>}
                     {item.daysInStock && <p><strong>Days in Stock:</strong> {item.daysInStock}</p>}

                  </div>
               ))}
            </div>
            <button onClick={onClose} className="mt-4 bg-blue-500 text-white text-sm px-4 py-[5px] rounded">Close</button>
         </div>
      </div>
   );
};

export default ReportModal;