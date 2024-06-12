

const Dashboard = () => {
   return (
      <div>
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="font-bold text-xl mb-4">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-gray-300 p-4 text-center rounded-lg">
                  <h1 className="font-bold text-3xl">$123,456</h1>
                  <h1 className="text-gray-600 font-medium">Daily Sales</h1>
               </div>
               <div className="bg-gray-300 p-4 text-center rounded-lg">
                  <h1 className="font-bold text-3xl">42</h1>
                  <h1 className="text-gray-600 font-medium">Inventory Items</h1>
               </div>
               <div className="bg-gray-300 p-4 text-center rounded-lg">
                  <h1 className="font-bold text-3xl">50</h1>
                  <h1 className="text-gray-600 font-medium">Orders Today</h1>
               </div>
               <div className="bg-gray-300 p-4 text-center rounded-lg">
                  <h1 className="font-bold text-3xl">Cannabis</h1>
                  <h1 className="text-gray-600 font-medium">Top Selling Item</h1>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Dashboard