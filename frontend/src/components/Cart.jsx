import { useState } from "react";

const Cart = ({ cart, userId, removeFromCart, updateQuantity }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "",
  });

  // Calculate total price of all items in cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
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
  
    // Prepare order data for backend with full product details
    const orderData = {
      userId,
      products: cart.map(item => ({
        productId: item.productId || item._id,
        farmerId: item.farmerId,
        name: item.name || item.cropName,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity || 1,
        farmerName: item.farmerName
      })),
      shippingDetails: orderDetails,
      totalAmount: calculateTotal()
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
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
      setIsCheckoutOpen(false);  // Close the form
      
      // Clear cart logic could be added here if you have a function for it
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold mb-4">Your Shopping Cart</h3>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {/* Cart Item Header */}
          <div className="grid grid-cols-12 gap-2 py-2 border-b font-semibold hidden md:grid">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Subtotal</div>
          </div>

          {/* Cart Items */}
          {cart.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 py-4 border-b">
              {/* Product Info */}
              <div className="col-span-1 md:col-span-6">
                <div className="flex space-x-4">
                  <img 
                    src={item.image || "https://via.placeholder.com/100"} 
                    alt={item.name || item.cropName} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-semibold">{item.name || item.cropName}</h4>
                    <p className="text-gray-600 text-sm">Category: {item.category}</p>
                    <p className="text-gray-600 text-sm">Farmer: {item.farmerName}</p>
                    {item.estimatedDeliveryTime && (
                      <p className="text-gray-600 text-sm">Delivery: {item.estimatedDeliveryTime}</p>
                    )}
                    <button 
                      onClick={() => removeFromCart && removeFromCart(index)}
                      className="text-red-500 text-sm mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                <span className="md:hidden font-medium mr-2">Price:</span>
                <span>₹{item.price}</span>
              </div>

              {/* Quantity */}
              <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                <span className="md:hidden font-medium mr-2">Quantity:</span>
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity && updateQuantity(index, Math.max(1, (item.quantity || 1) - 1))}
                    className="bg-gray-200 px-2 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity && updateQuantity(index, (item.quantity || 1) + 1)}
                    className="bg-gray-200 px-2 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                <span className="md:hidden font-medium mr-2">Subtotal:</span>
                <span className="font-semibold">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            </div>
          ))}

          {/* Order Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-lg mb-2">Order Summary</h4>
            <div className="flex justify-between border-b pb-2">
              <span>Subtotal</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between pt-2 font-bold">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Checkout Form */}
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
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
                  >
                    Place Order
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