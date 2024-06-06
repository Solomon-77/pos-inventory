import { Outlet } from "react-router-dom"



const Index = () => {
   return (
      <div className="h-screen grid md:grid-cols-[55%_1fr]">
         <div className="bg-neutral-900 hidden md:grid place-items-center p-8">
            <div className="max-w-md space-y-4">
               <h1 className="text-white text-4xl font-semibold">Mang Kepweng POS</h1>
               <p className="text-neutral-300">Welcome to the greatest pos and inventory management system of all time.</p>
            </div>
         </div>
         <div className="bg-neutral-100 grid place-items-center p-8">
            <Outlet />
         </div>
      </div>
   )
}

export default Index