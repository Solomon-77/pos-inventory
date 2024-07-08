import { IoSearchOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import ReportModal from "../inventory/ReportModal";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIES = ["All", "Low Stock", "Out of Stock", "Generic", "Branded", "Syrup", "Antibiotics", "Ointment/Drops", "Cosmetics", "Diapers", "Others"].sort();

const FAST_MOVING_THRESHOLD = 40;
const SLOW_MOVING_THRESHOLD = 50;
const DEFAULT_CRITICAL_LEVEL = 20;

const Inventory = () => {
   const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
   const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [products, setProducts] = useState({});
   const [archivedProducts, setArchivedProducts] = useState([]);
   const [category, setCategory] = useState("All");
   const [editProduct, setEditProduct] = useState(null);
   const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "", category: "", criticalLevel: DEFAULT_CRITICAL_LEVEL });
   const [showAddForm, setShowAddForm] = useState(false);
   const [report, setReport] = useState(null);
   const [hasSearched, setHasSearched] = useState(false);
   const [error, setError] = useState("");
   const [alertMessage, setAlertMessage] = useState("");
   const [showArchived, setShowArchived] = useState(false);

   useEffect(() => {
      fetchProducts();
      fetchArchivedProducts();
   }, []);

   const fetchProducts = async () => {
      try {
         const response = await axios.get(`${API_URL}/getAll`);
         const data = response.data;
         const sortedData = Object.fromEntries(
            Object.entries(data).map(([category, items]) => [
               category,
               items.sort((a, b) => a.name.localeCompare(b.name))
            ])
         );
         setProducts({ ...sortedData, syrup: [...(sortedData.syrup || []), ...(sortedData.syrup2 || [])].sort((a, b) => a.name.localeCompare(b.name)) });
      } catch (error) {
         console.error("Error fetching products:", error);
         setAlertMessage("Error fetching products. Please try again.");
      }
   };

   const fetchArchivedProducts = async () => {
      try {
         const response = await axios.get(`${API_URL}/getArchivedProducts`);
         setArchivedProducts(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
         console.error("Error fetching archived products:", error);
         setAlertMessage("Error fetching archived products. Please try again.");
      }
   };

   const startEdit = (product) => setEditProduct({ ...product, originalName: product.name });

   const validateInput = (field, value) => {
      if (field === "price" || field === "quantity" || field === "criticalLevel") {
         const numValue = Number(value);
         if (numValue < 0) {
            setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative.`);
            return false;
         }
         if (field === "quantity" && numValue > 10000) {
            setError("Quantity cannot be more than 10,000.");
            return false;
         }
         if (field === "price" && numValue > 1000000) {
            setError("Price cannot be more than 1,000,000.");
            return false;
         }
         if (field === "criticalLevel" && numValue > 1000) {
            setError("Critical Level cannot be more than 1,000.");
            return false;
         }
      }
      setError("");
      return true;
   };

   const saveEdit = async () => {
      if (!validateInput("price", editProduct.price) ||
         !validateInput("quantity", editProduct.quantity) ||
         !validateInput("criticalLevel", editProduct.criticalLevel)) {
         return;
      }
      try {
         await axios.put(`${API_URL}/updateProduct`, {
            category: editProduct.category,
            currentName: editProduct.originalName,
            newName: editProduct.name,
            price: editProduct.price,
            quantity: editProduct.quantity,
            criticalLevel: editProduct.criticalLevel
         });
         setEditProduct(null);
         fetchProducts();
         setAlertMessage("Product updated successfully!");
      } catch (error) {
         console.error("Error updating product:", error);
         setAlertMessage("Error updating product. Please try again.");
      }
   };

   const addProduct = async () => {
      const emptyFields = Object.entries(newProduct)
         .filter(([key, value]) => key !== 'criticalLevel' && value === '')
         .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      if (emptyFields.length > 0) {
         setAlertMessage(`Please fill in the following fields: ${emptyFields.join(', ')}`);
         return;
      }

      if (!validateInput("price", newProduct.price) ||
         !validateInput("quantity", newProduct.quantity) ||
         !validateInput("criticalLevel", newProduct.criticalLevel)) {
         return;
      }
      try {
         await axios.post(`${API_URL}/addProduct`, newProduct);
         setNewProduct({ name: "", price: "", quantity: "", category: "", criticalLevel: DEFAULT_CRITICAL_LEVEL });
         setShowAddForm(false);
         fetchProducts();
         setAlertMessage("Product added successfully!");
      } catch (error) {
         console.error("Error adding product:", error);
         setAlertMessage("Error adding product. Please try again.");
      }
   };

   const handleInputChange = (field, value, isEdit = false) => {
      if (validateInput(field, value)) {
         if (isEdit) {
            setEditProduct({ ...editProduct, [field]: value });
         } else {
            setNewProduct({ ...newProduct, [field]: value });
         }
      }
   };

   const archiveProduct = async (product) => {
      try {
         await axios.post(`${API_URL}/archiveProduct`, { id: product._id, category: product.category });
         fetchProducts();
         fetchArchivedProducts();
         setAlertMessage("Product archived successfully!");
      } catch (error) {
         console.error("Error archiving product:", error);
         setAlertMessage("Error archiving product. Please try again.");
      }
   };

   const unarchiveProduct = async (product) => {
      try {
         await axios.post(`${API_URL}/unarchiveProduct`, { id: product._id, category: product.category });
         fetchProducts();
         fetchArchivedProducts();
         setAlertMessage("Product unarchived successfully!");
      } catch (error) {
         console.error("Error unarchiving product:", error);
         setAlertMessage("Error unarchiving product. Please try again.");
      }
   };

   const filteredProducts = Object.entries(products).flatMap(([cat, items]) => {
      if (category === "All") {
         return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
      } else if (category === "Low Stock") {
         return items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            item.quantity <= (item.criticalLevel || DEFAULT_CRITICAL_LEVEL) &&
            item.quantity > 0
         );
      } else if (category === "Out of Stock") {
         return items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            item.quantity === 0
         );
      } else {
         const categoryMatch = category === "Ointment/Drops"
            ? cat.toLowerCase() === "ointmentdrops"
            : cat.toLowerCase() === category.toLowerCase();

         return categoryMatch
            ? items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
            : [];
      }
   }).sort((a, b) => a.name.localeCompare(b.name));

   const filteredArchivedProducts = archivedProducts.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
   );

   const generateReport = (type) => {
      let reportData = [];
      let title = "";

      switch (type) {
         case "current":
            title = "Current Stock Levels";
            reportData = Object.values(products).flat().map(p => ({
               name: p.name,
               quantity: p.quantity,
               category: p.category,
               price: p.price,
               criticalLevel: p.criticalLevel || DEFAULT_CRITICAL_LEVEL
            }));
            break;
         case "fast":
            title = "Fast-Moving Stock";
            reportData = Object.values(products).flat()
               .filter(p => p.quantity <= FAST_MOVING_THRESHOLD)
               .sort((a, b) => a.quantity - b.quantity)
               .map(p => ({
                  name: p.name,
                  quantity: p.quantity,
                  category: p.category,
                  price: p.price,
                  criticalLevel: p.criticalLevel || DEFAULT_CRITICAL_LEVEL
               }));
            break;
         case "slow":
            title = "Slow-Moving Stock";
            reportData = Object.values(products).flat()
               .filter(p => p.quantity >= SLOW_MOVING_THRESHOLD)
               .sort((a, b) => b.quantity - a.quantity)
               .map(p => ({
                  name: p.name,
                  quantity: p.quantity,
                  category: p.category,
                  price: p.price,
                  criticalLevel: p.criticalLevel || DEFAULT_CRITICAL_LEVEL
               }));
            break;
         case "low":
            title = "Low Stock Alert";
            reportData = Object.values(products).flat()
               .filter(p => p.quantity <= (p.criticalLevel || DEFAULT_CRITICAL_LEVEL))
               .sort((a, b) => a.quantity - b.quantity)
               .map(p => ({
                  name: p.name,
                  quantity: p.quantity,
                  category: p.category,
                  price: p.price,
                  criticalLevel: p.criticalLevel || DEFAULT_CRITICAL_LEVEL
               }));
            break;
         case "out":
            title = "Out of Stock Items";
            reportData = Object.values(products).flat()
               .filter(p => p.quantity === 0)
               .map(p => ({
                  name: p.name,
                  quantity: p.quantity,
                  category: p.category,
                  price: p.price,
                  criticalLevel: p.criticalLevel || DEFAULT_CRITICAL_LEVEL
               }));
            break;
      }

      setReport({ title, data: reportData });
   };

   return (
      <div>
         {alertMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
               <span className="block sm:inline">{alertMessage}</span>
               <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setAlertMessage("")}>
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                     <title>Close</title>
                     <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
               </span>
            </div>
         )}
         <div className="md:flex justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 relative">
               <IoSearchOutline className="absolute left-3 text-gray-500" />
               <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                     setSearch(e.target.value);
                     setHasSearched(true);
                  }}
                  className="outline-none pr-3 pl-10 py-2 text-sm border border-gray-300 rounded-md w-full"
                  placeholder="Search products..."
               />
               <div className="relative inline-block text-left ml-2">
                  <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="inline-flex whitespace-nowrap justify-between w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                     {category}
                     <span className="ml-2">&#x25BC;</span>
                  </button>
                  {isCategoryDropdownOpen && (
                     <div className="absolute py-1 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        {CATEGORIES.map((cat) => (
                           <a key={cat} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setCategory(cat); setIsCategoryDropdownOpen(false); }}>{cat}</a>
                        ))}
                     </div>
                  )}
               </div>
               <button
                  className={`rounded-md border border-gray-300 px-3 py-2 bg-white text-sm font-medium text-gray-700 ml-2 ${showArchived ? 'bg-gray-200' : ''}`}
                  onClick={() => setShowArchived(!showArchived)}
               >
                  {showArchived ? 'Active' : 'Archived'}
               </button>
            </div>
            <div className="flex space-x-2">
               <button onClick={() => setShowAddForm(!showAddForm)} className="bg-gray-600 shadow-md text-white text-sm px-3 py-2 rounded-md font-medium">Add Product</button>
               <div className="relative inline-block text-left">
                  <button onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)} className="bg-gray-600 shadow-md text-white text-sm px-3 py-2 rounded-md font-medium">
                     Generate Report
                  </button>
                  {isReportDropdownOpen && (
                     <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                           <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { generateReport("current"); setIsReportDropdownOpen(false); }}>Current Stock Levels</a>
                           <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { generateReport("fast"); setIsReportDropdownOpen(false); }}>Fast-Moving Stock</a>
                           <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { generateReport("slow"); setIsReportDropdownOpen(false); }}>Slow-Moving Stock</a>
                           <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { generateReport("low"); setIsReportDropdownOpen(false); }}>Low Stock Alert</a>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {showAddForm && (
            <div className="mt-4 p-5 bg-gray-100 rounded-md shadow-md">
               <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
               {error && <p className="text-red-500 mb-2">{error}</p>}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["name", "price", "quantity", "criticalLevel"].map(field => (
                     <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           {field === "criticalLevel" ? "Critical Level" : field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                           type={field !== "name" ? "number" : "text"}
                           value={newProduct[field]}
                           onChange={(e) => handleInputChange(field, e.target.value)}
                           className="w-full p-1 border rounded outline-none px-3 text-sm py-2"
                        />
                     </div>
                  ))}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                     <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        <option value="">Select Category</option>
                        {CATEGORIES.filter(cat => cat !== "All" && cat !== "Low Stock").map(cat => (
                           <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                        ))}
                     </select>
                  </div>
               </div>
               <div className="mt-4 flex justify-end">
                  <button onClick={addProduct} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out text-sm">Add Product</button>
               </div>
            </div>
         )}

         {hasSearched && (showArchived ? filteredArchivedProducts.length === 0 : filteredProducts.length === 0) ? (
            <div className="text-gray-600 h-[calc(100vh-215px)] grid place-items-center">
               No products found...
            </div>
         ) : (
            <div className="mt-4 overflow-y-auto h-[calc(100vh-215px)] rounded-l-lg">
               <table className="w-full rounded-md overflow-hidden shadow-md">
                  <thead className="bg-gray-100">
                     <tr>
                        {["Name", "Price", "Quantity", "Critical Level", "Action"].map(header => (
                           <th key={header} className="border border-gray-200 py-4 font-medium">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="bg-gray-50">
                     {(showArchived ? filteredArchivedProducts : filteredProducts).map((product, index) => (
                        <tr className="text-center" key={index}>
                           {["name", "price", "quantity", "criticalLevel"].map(field => (
                              <td key={field} className={`border border-gray-200 py-4 break-words px-4 max-w-[100px] text-sm ${field === "quantity" && product[field] <= (product.criticalLevel || DEFAULT_CRITICAL_LEVEL)
                                 ? "text-red-500 font-bold"
                                 : ""
                                 }`}>
                                 {!showArchived && editProduct?._id === product._id ? (
                                    <input
                                       type={field !== "name" ? "number" : "text"}
                                       value={editProduct[field]}
                                       onChange={(e) => handleInputChange(field, e.target.value, true)}
                                       className="w-full p-1 border rounded outline-none px-3 text-sm py-2"
                                    />
                                 ) : (
                                    field === "price" ? `P${product[field]}` : product[field]
                                 )}
                              </td>
                           ))}
                           <td className="border border-gray-200 py-4">
                              {showArchived ? (
                                 <button onClick={() => unarchiveProduct(product)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm mx-2">Unarchive</button>
                              ) : (
                                 editProduct && editProduct._id === product._id ? (
                                    <>
                                       <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm mr-2">Save</button>
                                       <button onClick={() => setEditProduct(null)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Cancel</button>
                                    </>
                                 ) : (
                                    <>
                                       <button onClick={() => startEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm mx-2">Edit</button>
                                       <button onClick={() => archiveProduct(product)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mx-2">Archive</button>
                                    </>
                                 )
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
         {report && <ReportModal report={report} onClose={() => setReport(null)} />}
      </div>
   );
};

export default Inventory;