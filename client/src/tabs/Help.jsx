import { FileDown } from 'lucide-react';
import manualPdf from './Manual.pdf';

const Help = () => {
   return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
         <h1 className="text-xl font-bold text-gray-600 mb-6">User Manual</h1>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Full Manual PDF</h2>
            <a
               href={manualPdf}
               download
               className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
               <FileDown className="mr-2" size={20} />
               Download Full Manual PDF
            </a>
         </section>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Getting Started</h2>
            <p className="text-gray-600">Register with your preferred email address and a secure password, then log in to access the system.</p>
         </section>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Point of Sale (POS)</h2>
            <ul className="list-disc pl-5 text-gray-600">
               <li>Search for products requested by the customer</li>
               <li>Add items to the cart and adjust quantities as needed</li>
               <li>Use category filters to narrow down product searches</li>
               <li>Apply discounts when applicable</li>
               <li>Proceed to checkout to complete the transaction</li>
            </ul>
         </section>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Inventory Management</h2>
            <p className="text-gray-600 mb-2">This feature is accessible only to users with admin privileges.</p>
            <ul className="list-disc pl-5 text-gray-600">
               <li>View current stock levels in the "Inventory" tab</li>
               <li>Generate stock reports for comprehensive inventory analysis</li>
               <li>Add new products using the "Add Product" feature</li>
               <li>Update product information or prices as required</li>
            </ul>
         </section>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Sales</h2>
            <ul className="list-disc pl-5 text-gray-600">
               <li>Access Daily, Weekly, Monthly Sales Summaries</li>
               <li>View detailed Transaction History</li>
               <li>View Transaction Receipts</li>
               <li>View Revenue Statistics for business insights</li>
            </ul>
         </section>

         <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Support</h2>
            <p className="text-gray-600">For additional assistance, please contact our support team at <span className="text-blue-500">medinet.sys@gmail.com</span></p>
         </section>
      </div>
   )
}

export default Help