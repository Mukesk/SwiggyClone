import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "./baseUrl";

const CreateItem = () => {
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

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(`${baseUrl}/api/auth/additem`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (file) {
      formData.append("img", file); // Append the file separately
    }

    mutate(formData);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="block bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
      >
        Add Item
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

            <form onSubmit={handleSubmit} className="p-4">
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Category</label>
                  <select
                    name="category"
                    onChange={handleChange}
                    value={data.category}
                    className="bg-gray-50 border rounded-lg w-full p-2.5"
                    required
                  >
                    <option>Select category</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Nonveg">Non-Veg</option>
                    <option value="Veg">Veg</option>
                    <option value="Burger">Burger</option>
                    <option value="Beverage">Beverage</option>
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
                    required
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
                    required
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
                    required
                    value={data.description}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Add New Product"}
              </button>
            </form>

            {isError && <p className="text-red-500 mt-2">Something went wrong: {error?.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateItem;
