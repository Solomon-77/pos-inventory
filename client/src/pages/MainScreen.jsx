import SideNav from "../components/SideNav"
import Header from "../components/Header"
import { useState } from "react"

const MainScreen = () => {

   const [toggle, setToggle] = useState(false)

   window.onresize = function () {
      const w = window.innerWidth
      if (w > 768) {
         setToggle(false)
      }
   }

   return (
      <div className="h-screen bg-neutral-200 grid grid-cols-1 md:grid-cols-[250px_1fr]">
         <SideNav toggle={toggle} setToggle={setToggle} />
         <Header toggle={toggle} setToggle={setToggle} />
      </div>
   )
}

export default MainScreen