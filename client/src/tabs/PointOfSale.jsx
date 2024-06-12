import { useState } from "react"
import Coffee from "../categories/Coffee"
import MilkTea from "../categories/MilkTea"
import Foods from "../categories/Foods"

const PointOfSale = () => {

   const [component, setComponent] = useState("Coffee")

   const renderComponent = () => {
      switch (component) {
         case "Coffee":
            return <Coffee />
         case "MilkTea":
            return <MilkTea />
         case "Foods":
            return <Foods />
         default:
            return <Coffee />
      }
   }

   const getTabClass = (tab) => {
      return `cursor-pointer duration-100 ease-out shadow-md rounded-full px-4 py-1 
         ${component === tab
            ? "bg-gray-600 text-white"
            : "bg-white"}`;
   };

   return (
      <div className="flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[1fr_28%] gap-4">

         {/* Categories */}
         <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="flex space-x-3 text-sm font-semibold justify-center md:justify-start">
               <div onClick={() => setComponent("Coffee")} className={getTabClass("Coffee")}>Category 1</div>
               <div onClick={() => setComponent("MilkTea")} className={getTabClass("MilkTea")}>Category 2</div>
               <div onClick={() => setComponent("Foods")} className={getTabClass("Foods")}>Category 3</div>
            </div>
            <div className="overflow-hidden">
               {renderComponent()}
            </div>
         </div>

         {/* Order Details */}
         <div className="bg-white shadow-md rounded-lg flex-1 p-6 flex flex-col justify-between">
            <div>
               <h1 className="text-lg font-semibold mb-3">Order Details</h1>
               <div className="flex justify-between items-center">
                  <div>
                     <h1 className="font-semibold">Cannabis</h1>
                     <h1 className="text-sm text-gray-500">$20</h1>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button>-</button>
                     <h1>1</h1>
                     <button>+</button>
                  </div>
               </div>
            </div>
            <div>
               <div className="flex justify-between mb-3 font-bold">
                  <h1>Total</h1>
                  <h1>$20.0</h1>
               </div>
               <button className="w-full bg-gray-900 font-medium text-white rounded-md text-sm py-2">Checkout</button>
            </div>
         </div>
      </div>
   )
}

export default PointOfSale