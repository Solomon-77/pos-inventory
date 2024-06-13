import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import IndexLayout from "./IndexLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainScreen from "./pages/MainScreen";
import Dashboard from "./tabs/Dashboard";
import PointOfSale from "./tabs/PointOfSale";
import Inventory from "./tabs/Inventory";
import Sales from "./tabs/Sales";
import Settings from "./tabs/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import { jwtDecode } from "jwt-decode";

const App = () => {
   const token = localStorage.getItem("token");
   const role = token ? jwtDecode(token)?.role : "user";

   return (
      <div className="font-inter">
         <BrowserRouter>
            <Routes>
               <Route element={<IndexLayout />}>
                  <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
                  <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
                  <Route path="/forgot-password" element={<AuthRedirect><ForgotPassword /></AuthRedirect>} />
               </Route>

               <Route element={<ProtectedRoute />}>
                  <Route element={<MainScreen />}>
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/pos" element={<PointOfSale />} />
                     {role === "admin" && <Route path="/inventory" element={<Inventory />} />}
                     <Route path="/sales" element={<Sales />} />
                     <Route path="/settings" element={<Settings />} />
                     <Route index element={<Navigate to="/dashboard" replace />} />
                  </Route>
               </Route>
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </BrowserRouter>
      </div>
   );
};

const AuthRedirect = ({ children }) => {
   const token = localStorage.getItem("token");
   return token ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = () => {
   const token = localStorage.getItem("token");
   return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default App;
