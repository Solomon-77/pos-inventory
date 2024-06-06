

const Admin = () => {
   return (
      <form action="" className="flex flex-col w-full max-w-[360px]">
         <h1 className="text-3xl font-semibold mb-5">Admin</h1>
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
      </form>
   )
}

export default Admin