import { useEffect, useState } from "react";
import Cart from "../components/Cart"; // Import Cart component

const Products = ({ userId: propUserId }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Cart state
  const [localUserId, setLocalUserId] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Get userId from localStorage if not passed as prop
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Products component - userId from localStorage:", storedUserId);
    setLocalUserId(storedUserId);
  }, [propUserId]); // Re-check when prop userId changes

  // Determine the effective userId to use
  const effectiveUserId = propUserId || localUserId;

  // Function to add product to cart
  const addToCart = (product) => {
    if (!effectiveUserId) {
      alert("Please log in to add items to cart");
      return;
    }

    const cartItem = {
      userId: effectiveUserId,
      farmerId: product.farmerId,
      productId: product._id || product.id, // Make sure to use the correct ID field
      name: product.name,
      price: product.price,
      image: product.image,
    };

    console.log("Adding to cart with userId:", effectiveUserId);
    setCart((prevCart) => [...prevCart, cartItem]);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Crops</h2>
      
      {/* Debug info - Remove in production */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <p>User ID: {effectiveUserId || "Not logged in"}</p>
        <p>Cart Items: {cart.length}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
            <p className="text-gray-500 text-sm">Farmer ID: {product.farmerId}</p>
            <p className="text-gray-500 text-sm">Product ID: {product._id || product.id}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!effectiveUserId}
            >
              {effectiveUserId ? "Add to Cart" : "Login to Add"}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Component */}
      <Cart cart={cart} userId={effectiveUserId} />
    </div>
  );
};

export default Products;