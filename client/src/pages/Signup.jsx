import { Link } from "react-router-dom"


const Signup = () => {
   return (
      <form action="" className="flex flex-col w-full max-w-[360px]">
         <h1 className="text-3xl font-semibold mb-5">Sign up</h1>
         <h1>Name</h1>
         <input
            type="text"
            placeholder="Mang Kepweng"
            className="mb-4 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <h1>Email</h1>
         <input
            type="text"
            placeholder="user@email.com"
            className="mb-4 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <h1>Business Access Code</h1>
         <input
            type="text"
            placeholder="CASHIER484"
            className="mb-4 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <h1>Password</h1>
         <input
            type="password"
            className="mb-4 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <h1>Confirm Password</h1>
         <input
            type="password"
            className="mb-5 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <button className="mb-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md py-3 text-sm">Sign up</button>
         <Link to="/login" className="text-center text-sm hover:underline">Already have an account? Sign in</Link>
      </form>
   )
}

export default Signup