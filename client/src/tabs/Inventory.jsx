import { IoSearchOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [data, setData] = useState({});
   const [selectedCategory, setSelectedCategory] = useState("All");

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get("http://localhost:5500/getAll");
            const combinedData = {
               ...response.data,
               syrup: [...(response.data.syrup || []), ...(response.data.syrup2 || [])],
            };
            delete combinedData.syrup2;
            setData(combinedData);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

   const categories = [
      "All",
      "Generic",
      "Branded",
      "Syrup",
      "Antibiotics",
      "OintmentDrops",
      "Cosmetics",
      "Diapers",
      "Others"
   ];

   const filteredData = Object.entries(data).flatMap(([category, items]) => {
      if (selectedCategory === "All" || category.toLowerCase() === selectedCategory.toLowerCase()) {
         return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }
      return [];
   });

   return (
      <div>
         <div className="md:flex justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 relative">
               <IoSearchOutline className="absolute left-3 text-gray-500" />
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none pr-3 pl-10 py-2 text-sm border border-gray-300 rounded-md w-full"
                  placeholder="Search products..."
               />
               <div className="relative inline-block text-left ml-2">
                  <button
                     onClick={() => setIsOpen(!isOpen)}
                     className="inline-flex justify-between w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                     {selectedCategory}
                     <span className="ml-2">&#x25BC;</span>
                  </button>
                  {isOpen && (
                     <div className="absolute py-1 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        {categories.map((category, index) => (
                           <a
                              key={index}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                 setSelectedCategory(category);
                                 setIsOpen(false);
                              }}
                           >
                              {category}
                           </a>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            <div className="flex space-x-2">
               <button className="bg-gray-600 shadow-md text-white text-sm px-3 py-2 rounded-md font-medium">Add Product</button>
               <button className="bg-gray-600 shadow-md text-white text-sm px-3 py-2 rounded-md font-medium">Generate Report</button>
            </div>
         </div>
         <div className="mt-6 overflow-y-auto h-[calc(100vh-220px)] rounded-l-md">
            <table className="w-full rounded-md overflow-hidden shadow-md">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="border border-gray-200 py-4 font-medium">Name</th>
                     <th className="border border-gray-200 py-4 font-medium">Price</th>
                     <th className="border border-gray-200 py-4 font-medium">Quantity</th>
                     <th className="border border-gray-200 py-4 font-medium">Action</th>
                  </tr>
               </thead>
               <tbody className="bg-gray-50">
                  {filteredData.map((item, index) => (
                     <tr className="text-center" key={index}>
                        <td className="border border-gray-200 py-4 break-words px-4 max-w-[100px] text-sm">{item.name}</td>
                        <td className="border border-gray-200 py-4">P{item.price}</td>
                        <td className="border border-gray-200 py-4">{item.quantity}</td>
                        <td className="border border-gray-200 py-4">
                           <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Inventory;