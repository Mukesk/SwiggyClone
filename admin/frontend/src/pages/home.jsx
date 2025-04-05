import React from 'react'
import { useQuery,useMutation } from '@tanstack/react-query' 
import axios from 'axios'
import baseUrl from './baseUrl'
import { useState } from 'react'
import Createitem from './createItem'
import EditItem from './editItem'
import { useRef } from 'react'

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const imgRef = useRef(null);
  
    const [data, setData] = useState({
      itemname: "",
      price: "",
      category: "",
      description: "",
      percentage: "",
      hotelCity: "",
      hotelName: "",
    });
  
    const [file, setFile] = useState(null); // Store actual file
  
    const handleChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };
  
    const handleImgChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
  
    const { mutate, isPending,isSuccess, error, isError } = useMutation({
      mutationFn: async ({ itemname,
        price,
        category,
        description,
        percentage,
        hotelCity,
        hotelName,id}) => {
        const res = await axios.post(`${baseUrl}/api/auth/edititem/${id}`, {itemname,
          price,
          category,
          description,
          percentage,
          hotelCity,
          hotelName,}, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data;
      },
    });

    const handleSubmit = (e,id) => {
      e.preventDefault();
      
     
      
      mutate({...data,id});
    };
  const [srch,setSrch]=useState("")
    const{data:itemsData,isLoading,error:getError,isError:getisError}=useQuery({
        queryKey:['items'],
        queryFn:async()=>{
            const res = await axios.get(`${baseUrl}/api/auth/getallitems`,{headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",

            },withCredentials:true})
            console.log(res.data)
            return res.data
        }
                                 

    })
    const {mutate:deleteItem}=useMutation({
        mutationFn:async(id)=>{
            const res=await axios.delete(`${baseUrl}/api/auth/deleteitem/${id}`,{headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },withCredentials:true})
            return res.data
        }
    })
    const  handleDelete=async(id)=>{
       deleteItem(id)
    }

  return (
    <div className='light:bg-gray-200 dark:bg-gray-800 p-4'>
        <h1 className='text-3xl'>Admin Dashboard</h1>
   <div className="flex gap-3">
    <div className="flex items-center border rounded p-2 w-full max-w-sm bg-white">
      <input
        className="flex-grow outline-none text-gray-900bg-transparent px-2"
        type="search"
        onChange={(e)=>setSrch(e.target.value)}
        value={srch}
        required
        placeholder="Search"
      />
      <svg
        className="h-6 w-6 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 2 24 24"
      >
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
    </div>  
      <button className='btn inline btn-accent' >Add Item</button><Createitem/>
      </div>
    <table className='w-full  table table-auto border border-b-gray-900'>
        <thead>
        <tr className='border  '>
            <th className='border'>Sno</th>
             <th>name</th>
             <th>price</th>
             <th>edit</th>
            <th>delete</th>
        </tr>
        
        
        </thead>
                <tbody>
            {itemsData?.items?.filter((val)=>(val.itemname.includes(srch))).map((item,index)=>(       
                   <tr key={index} className='border'>    
                <td>{index}</td>
                <td>{item.itemname}</td>
                <td>{item.price}</td>
                <td><div>
      <button
        onClick={() => setIsOpen(true)}
        className="block bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
      >
       Edit Item
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center text-black justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Create New Product</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:bg-gray-200 rounded-lg p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e)=>{handleSubmit(e,item._id)}} className="p-4">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="itemname"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    value={data.itemname}
                    placeholder="Product name"
            
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">Upload Image</label>
                  <input
                    type="file"
                    name="img"
                    onChange={handleImgChange}
                    ref={imgRef}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
              
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    placeholder="$2999"
                    value={data.price}
        
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Percentage</label>
                  <input
                    type="number"
                    name="percentage"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    placeholder="1%"
                    value={data.percentage}
        
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Category</label>
                  <select
                    name="category"
                    onChange={handleChange}
                    value={data.category}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                
                  >
                    <option>Select category</option>
                    <option value="bakery">Bakery</option>
                    <option value="pizza">Pizza</option>
                    <option value="nonveg">Non-Veg</option>
                    <option value="veg">Veg</option>
                    <option value="burger">Burger</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Hotel Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    placeholder="Hotel Name"
             
                    value={data.hotelName}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Hotel City</label>
                  <input
                    type="text"
                    name="hotelCity"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    placeholder="Hotel City"
                   
                    value={data.hotelCity}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    onChange={handleChange}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    placeholder="Write product description here"
             
                    value={data.description}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
                disabled={isPending||isSuccess}
              >
                {isPending ? "Loading..." :isSuccess?"Added ": "Add New Product"}
              </button>
            </form>

            {isError && <p className="text-red-500 mt-2">Something went wrong: {error?.message}</p>}
          </div>
        </div>
      )}
    </div></td> 
                <td className='btn btn-error'onClick={()=>{handleDelete(item._id)}}>delete</td>   
              </tr>
            ) )}
            </tbody>   
             </table>
            

      
    </div>
  )
}

export default Home
