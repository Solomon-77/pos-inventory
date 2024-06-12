import { Outlet } from "react-router-dom"

const Index = () => {
   return (
      <div className="h-screen grid md:grid-cols-[55%_1fr]">
         <div className="bg-gray-900 hidden md:grid place-items-center p-8">
            <div className="max-w-md space-y-4">
               <h1 className="text-white text-4xl font-semibold">MediNet</h1>
               <p className="text-gray-300">Point of Sale and Inventory Management System for GenMed Pharmacy</p>
            </div>
         </div>
         <div className="bg-gray-100 grid place-items-center p-8">
            <Outlet />
         </div>
      </div>
   )
}

export default Index