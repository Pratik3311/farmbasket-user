import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarFilter from "../components/SidebarFilter";
import ProductHeader from "../components/ProductHeader";

const Products = ({ userId: propUserId, filters = {}, searchQuery = " ", sortOption = 'popular', category = 'all', onCategoryChange }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Cart state
  const [localUserId, setLocalUserId] = useState(null);
  const [searchQueryLocal, setSearchQueryLocal] = useState(searchQuery);
  const [sortOptionLocal, setSortOptionLocal] = useState(sortOption);
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetch("http://localhost:5005/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Products data received:", JSON.stringify(data, null, 2));
        // Check if any products have image arrays
        const productsWithImages = data.filter(product => product.images && product.images.length > 0);
        console.log(`Found ${productsWithImages.length} products with images`);
        if (productsWithImages.length > 0) {
          console.log("Sample product with images:", JSON.stringify(productsWithImages[0], null, 2));
          console.log("Sample image URL:", productsWithImages[0].images[0]);
        } else {
          console.log("No products with images found. First product:", JSON.stringify(data[0], null, 2));
        }
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Get userId from localStorage if not passed as prop
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Products component - userId from localStorage:", storedUserId);
    setLocalUserId(storedUserId);
    
    // Initialize cart from localStorage if userId exists
    if (storedUserId) {
      try {
        const storedCart = localStorage.getItem(`cart_${storedUserId}`);
        console.log("Products - Stored cart data:", storedCart);
        
        if (storedCart) {
          const cartData = JSON.parse(storedCart);
          console.log("Products - Parsed cart data:", cartData);
          setCart(cartData);
        }
      } catch (err) {
        console.error("Error loading cart from localStorage:", err);
      }
    }
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
      image: (product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/150",
      quantity: 1, // Default quantity
      stock: product.stock,
      category: product.category,
      estimatedDeliveryTime: product.estimatedDeliveryTime,
      location: product.location,
    };

    // Store cart items in localStorage instead of making API calls
    try {
      // Get existing cart items from localStorage
      const existingCart = JSON.parse(localStorage.getItem(`cart_${effectiveUserId}`) || '[]');
      
      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.productId === cartItem.productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item if product doesn't exist
        existingCart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem(`cart_${effectiveUserId}`, JSON.stringify(existingCart));
      
      // Update local state
      setCart(existingCart);
      
      // Show success message
      alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleSearch = (query) => {
    setSearchQueryLocal(query);
    // Implement search logic here
  };

  const handleSort = (sortOption) => {
    setSortOptionLocal(sortOption);
  }

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="p-4">
      {/* Debug info - Remove in production */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        {/* <p>User ID: {effectiveUserId || "Not logged in"}</p>
        <p>Cart Items: {cart.length}</p> */}
        <ProductHeader onSearch={handleSearch} onSort={handleSort} cartItemCount={cart.length} onCartClick={goToCart} />
      </div>
      
      {/* Main content layout with sidebar and products */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar on the left */}
        <div className="w-full md:w-1/4 md:pr-4">
          <SidebarFilter />
        </div>
        
        {/* Products section beside sidebar */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] bg-white">
                <div className="relative">
                <img 
  src={
    (product.images && product.images.length > 0) 
      ? product.images[0] 
      : (product.image && product.image !== '') 
        ? product.image 
        : "https://via.placeholder.com/150"
  } 
  alt={product.name} 
  className="w-full h-48 object-cover" 
  onError={(e) => {
    console.log(`Image failed to load for ${product.name}, falling back to placeholder`);
    e.target.src = "https://via.placeholder.com/150";
  }}
/>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-600 font-bold text-xl">₹{product.price}</p>
                    <p className="text-gray-500 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Stock: {product.stock}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Delivery: {product.estimatedDeliveryTime}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {product.location}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      effectiveUserId 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!effectiveUserId}
                  >
                    {effectiveUserId ? (
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </span>
                    ) : (
                      "Login to Add"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;