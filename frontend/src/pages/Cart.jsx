import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get userId from localStorage
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    
    // Load cart items from localStorage
    try {
      setLoading(true);
      console.log("Loading cart for user:", userId);
      
      // Get cart data from localStorage
      const storedCart = localStorage.getItem(`cart_${userId}`);
      console.log("Stored cart data:", storedCart);
      
      // Parse the cart data
      const cartData = storedCart ? JSON.parse(storedCart) : [];
      console.log("Parsed cart data:", cartData);
      
      // Set the cart items
      setCartItems(cartData);
    } catch (err) {
      console.error("Error loading cart items:", err);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);
  
  const updateQuantity = (itemId, newQuantity) => {
    try {
      // Create a copy of the cart items
      const updatedCart = [...cartItems];
      
      // Find the item to update
      const itemIndex = updatedCart.findIndex(item => item.productId === itemId);
      
      if (itemIndex >= 0) {
        // Update the quantity
        updatedCart[itemIndex].quantity = newQuantity;
        
        // Save to localStorage
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        
        // Update state
        setCartItems(updatedCart);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity. Please try again.");
    }
  };
  
  const removeItem = (itemId) => {
    try {
      // Filter out the item to remove
      const updatedCart = cartItems.filter(item => item.productId !== itemId);
      
      // Save to localStorage
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      
      // Update state
      setCartItems(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item. Please try again.");
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Handle input change for the form fields
  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };
  
  // Handle form submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!userId) { 
      alert("Please log in to complete your purchase");
      return;
    }
    
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare order data for backend with full product details
    const orderData = {
      userId,
      products: cartItems.map(item => ({
        productId: item.productId,
        farmerId: item.farmerId,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        farmerName: item.farmerName
      })),
      shippingDetails: orderDetails,
      totalAmount: calculateTotal()
    };
    
    try {
      const response = await fetch("http://localhost:5005/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      
      const data = await response.json();
      alert("Order placed successfully!");
      
      // Clear the cart after successful order
      localStorage.removeItem(`cart_${userId}`);
      setCartItems([]);
      
      // Close the checkout form
      setIsCheckoutOpen(false);
      
      // Navigate to order confirmation page or home page
      navigate("/orders");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Debug information
  console.log("Current cart items:", cartItems);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate("/products")} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0">
                              <img className="h-16 w-16 rounded-md object-cover" src={item.image || "https://via.placeholder.com/150"} alt={item.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{item.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <span className="mx-2 text-sm text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{item.price * item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">₹{calculateTotal()}</span>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={() => navigate("/products")}
                className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Shipping Details</h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={orderDetails.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={orderDetails.phone} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-gray-600">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={orderDetails.address} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={orderDetails.city} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={orderDetails.state} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipcode" 
                    value={orderDetails.zipcode} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between font-bold mb-4">
                  <span>Order Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 