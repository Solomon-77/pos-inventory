import coffeeItems from "../data/coffeeItems.json"

const Coffee = () => {
   return (
      <div className="overflow-auto md:h-[calc(100vh-150px)]">
         <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-4 md:pr-4">
            {coffeeItems.map((item, i) => (
               <div key={i} className="bg-white min-w-[250px] md:min-w-0 rounded-lg p-6 flex flex-col justify-center shadow-md">
                  <div className="text-center lg:flex justify-between">
                     <h1 className="font-semibold">{item.name}</h1>
                     <h1 className="font-bold">${item.price}</h1>
                  </div>
                  <h1 className="text-center my-4 text-sm text-neutral-500">{item.description}</h1>
                  <button className="py-2 rounded-md bg-neutral-800 text-white text-sm font-medium">Add to Cart</button>
               </div>
            ))}
         </div>
      </div>
   )
}

export default Coffee