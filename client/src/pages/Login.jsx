import { Link } from "react-router-dom"

const Login = () => {
   return (
      <form action="" className="flex flex-col w-full max-w-[360px]">
         <h1 className="text-3xl font-semibold mb-5">Sign in</h1>
         <h1>Email</h1>
         <input
            type="text"
            placeholder="user@email.com"
            className="mb-4 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <h1>Password</h1>
         <input
            type="password"
            className="mb-5 border border-neutral-400 rounded-md px-3 py-2 text-sm mt-1"
         />
         <button className="mb-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md py-3 text-sm">Sign in</button>
         <div className="flex justify-between">
            <Link to="/signup" className="text-sm hover:underline">Don't have an account? Sign up</Link>
            <Link className="text-sm hover:underline">Forgot Password?</Link>
         </div>
      </form>
   )
}

export default Login