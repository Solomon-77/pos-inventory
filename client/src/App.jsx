import { BrowserRouter, Route, Routes } from "react-router-dom"
import IndexLayout from "./IndexLayout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Admin from "./pages/Admin"
import MainScreen from "./pages/MainScreen"
import Dashboard from "./tabs/Dashboard"
import PointOfSale from "./tabs/PointOfSale"
import Inventory from "./tabs/Inventory"
import Sales from "./tabs/Sales"
import Settings from "./tabs/Settings"


const App = () => {
   return (
      <div className="font-openSans">
         <BrowserRouter>
            <Routes>
               <Route element={<IndexLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/admin" element={<Admin />} />
               </Route>
               <Route element={<MainScreen />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pos" element={<PointOfSale />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/settings" element={<Settings />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </div>
   )
}

export default App