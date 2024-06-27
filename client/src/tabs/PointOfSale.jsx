import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Receipt from '../sales/Receipt';
import Billing from "../sales/Billing";
import { MdRemoveShoppingCart } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIES = ["All", "Generic", "Branded", "Syrup", "Antibiotics", "OintmentDrops", "Cosmetics", "Diapers", "Others"];

const PointOfSale = () => {
   const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
   const [category, setCategory] = useState("All");
   const [search, setSearch] = useState("");
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [cart, setCart] = useState([]);
   const [discountType, setDiscountType] = useState('');
   const [total, setTotal] = useState(0);
   const [showReceipt, setShowReceipt] = useState(false);
   const [receiptData, setReceiptData] = useState(null);
   const [hasSearched, setHasSearched] = useState(false);
   const [showBilling, setShowBilling] = useState(false);
   const [amountPaid, setAmountPaid] = useState(0);

   useEffect(() => {
      fetchProducts();
   }, []);

   useEffect(() => {
      filterProducts();
   }, [search, category, products]);

   useEffect(() => {
      calculateTotal();
   }, [cart, discountType]);

   const fetchProducts = async () => {
      try {
         const response = await axios.get(`${API_URL}/getAll`);
         const data = response.data;
         const allProducts = Object.values(data).flat();
         setProducts(allProducts);
      } catch (error) {
         console.error("Error fetching products:", error);
      }
   };

   const filterProducts = () => {
      let filtered = products;

      if (category !== "All") {
         filtered = filtered.filter(product => product.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
         filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
         );
      }

      setFilteredProducts(filtered);
   };

   const addToCart = (product) => {
      const quantityInput = document.getElementById(`quantity-${product._id}`);
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity <= 0) {
         alert("Please enter a valid quantity greater than 0.");
         return;
      }

      const existingItem = cart.find(item => item._id === product._id);
      const availableQuantity = Math.min(product.quantity, 10000) - (existingItem ? existingItem.quantity : 0);

      if (quantity > availableQuantity) {
         alert(`Cannot add more than ${availableQuantity} items. Stock limit reached.`);
         return;
      }

      if (existingItem) {
         setCart(cart.map(item =>
            item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
         ));
      } else {
         setCart([...cart, { ...product, quantity }]);
      }

      quantityInput.value = "1";
   };


   const removeFromCart = (productId) => {
      setCart(cart.filter(item => item._id !== productId));
   };

   const clearCart = () => {
      if (cart.length === 0) {
         alert("The cart is already empty.");
         return;
      }

      const confirmed = window.confirm("Are you sure you want to clear the cart?");
      if (confirmed) {
         setCart([]);
         setDiscountType('');
         setTotal(0);
      }
   };

   const calculateTotal = () => {
      let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let discount = 0;

      if (discountType === 'senior' || discountType === 'pwd') {
         discount = subtotal * 0.20; // 20% discount for seniors and PWDs
      }

      setTotal(subtotal - discount);
   };

   const handleCheckout = () => {
      if (cart.length === 0) {
         alert("Cannot checkout with an empty cart.");
         return;
      }
      setShowBilling(true);
   };

   const handleBillingCancel = () => {
      setShowBilling(false);
   };

   const handleBillingConfirm = async (paidAmount) => {
      try {
         const response = await axios.post(`${API_URL}/checkout`, {
            cart,
            discountType,
            total,
            amountPaid: paidAmount
         });
         console.log('Checkout successful:', response.data);
         setReceiptData({
            items: cart,
            total,
            discountType,
            date: new Date(),
            saleId: response.data.saleId,
            amountPaid: paidAmount,
            change: paidAmount - total
         });
         setShowBilling(false);
         setShowReceipt(true);
         setCart([]);
         setDiscountType('');
         setAmountPaid(paidAmount);
      } catch (error) {
         console.error('Error during checkout:', error);
         alert('Error during checkout. Please try again.');
      }
   };

   return (
      <div className="grid md:grid-cols-[1fr_28%] gap-4">
         <div className="">
            <div className="flex justify-between items-center">
               <div className="flex items-center relative flex-grow mr-2">
                  <IoSearchOutline className="absolute left-3 text-gray-500" />
                  <input
                     type="text"
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                        setHasSearched(true);
                     }}
                     className="outline-none pr-3 pl-10 py-2 text-sm border border-gray-300 rounded-md"
                     placeholder="Search products..."
                  />
               </div>
               <div className="relative inline-block text-left">
                  <button
                     onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                     className="inline-flex justify-between w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                     {category}
                     <span className="ml-2">&#x25BC;</span>
                  </button>
                  {isCategoryDropdownOpen && (
                     <div className="absolute py-1 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        {CATEGORIES.map((cat) => (
                           <a
                              key={cat}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => { setCategory(cat); setIsCategoryDropdownOpen(false); }}
                           >
                              {cat}
                           </a>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            {hasSearched && filteredProducts.length === 0 ? (
               <div className="text-gray-600 h-[calc(100vh-160px)] grid place-items-center">
                  No products found...
               </div>
            ) : (
               <div className="mt-4 overflow-y-auto h-[calc(100vh-500px)] md:h-[calc(100vh-160px)] rounded-l-lg">
                  <table className="w-full overflow-hidden shadow-md rounded-tl-lg">
                     <thead className="bg-gray-100">
                        <tr>
                           {["Name", "Price", "Quantity", "Action"].map(header => (
                              <th key={header} className="border border-gray-200 py-4 font-medium">{header}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="bg-gray-50">
                        {filteredProducts.map((product) => (
                           <tr className="text-center" key={product._id}>
                              <td className="border border-gray-200 py-4 break-words px-4 max-w-[100px] text-sm">
                                 {product.name}
                              </td>
                              <td className="border border-gray-200 py-4 break-words px-4 max-w-[100px] text-sm">
                                 P{product.price.toFixed(2)}
                              </td>
                              <td className="border border-gray-200 py-4 break-words px-4 max-w-[100px] text-sm">
                                 {product.quantity > 0 ? (
                                    <input
                                       type="number"
                                       defaultValue="1"
                                       min="1"
                                       max={Math.min(product.quantity, 10000)}
                                       className="w-16 p-1 border rounded outline-none px-2 text-sm py-1"
                                       id={`quantity-${product._id}`}
                                    />
                                 ) : (
                                    <span className="text-red-500 font-medium">Out of Stock</span>
                                 )}
                              </td>
                              <td className="border border-gray-200 py-4">
                                 <button
                                    className={`${product.quantity > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-3 py-1 rounded-md text-sm mx-2 transition duration-300 ease-in-out`}
                                    disabled={product.quantity === 0}
                                    onClick={() => {
                                       const quantity = parseInt(document.getElementById(`quantity-${product._id}`).value);
                                       addToCart(product, quantity);
                                    }}
                                 >
                                    Add to Cart
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
         <div className="bg-white shadow-md rounded-lg flex flex-col justify-between p-5">
            <div>
               <div className='flex justify-between items-center mb-2'>
                  <h1 className='font-semibold text-lg'>Cart</h1>
                  <button
                     onClick={clearCart}
                     className="flex items-center bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                  >
                     <MdRemoveShoppingCart />
                  </button>
               </div>
               <div className='h-[calc(100vh-510px)] md:h-[calc(100vh-311px)] overflow-auto'>
                  {cart.map(item => (
                     <div key={item._id} className="flex border rounded-md p-2 border-gray-300 text-sm justify-between items-center mb-2">
                        <span className='mr-4 w-[160px] font-semibold text-gray-700'>{item.name} x {item.quantity}</span>
                        <div className='flex justify-between w-[90px]'>
                           <span className='font-semibold'>P{(item.price * item.quantity).toFixed(2)}</span>
                           <button onClick={() => removeFromCart(item._id)}><MdDelete /></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className='flex flex-col'>
               <div className='flex justify-between font-semibold'>
                  <h1>Total</h1>
                  <h1>P{total.toFixed(2)}</h1>
               </div>
               <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="my-2 p-2 text-sm border border-gray-300 rounded-md outline-none font-medium"
               >
                  <option value="">No Discount</option>
                  <option value="senior">Senior Citizen</option>
                  <option value="pwd">PWD</option>
               </select>
               <button
                  onClick={handleCheckout}
                  className='bg-gray-600 mt-1 hover:bg-gray-700 text-white text-sm py-2 rounded-md'
                  disabled={cart.length === 0}
               >
                  Checkout
               </button>
            </div>
         </div>
         {showBilling && (
            <div className="fixed inset-0 z-20 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center">
               <Billing
                  cart={cart}
                  total={total}
                  onCancel={handleBillingCancel}
                  onConfirm={handleBillingConfirm}
               />
            </div>
         )}

         {showReceipt && (
            <div className="fixed inset-0 z-20 p-4 bg-gray-600 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <Receipt data={receiptData} />
                  <button
                     onClick={() => setShowReceipt(false)}
                     className="mt-4 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-md"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default PointOfSale;