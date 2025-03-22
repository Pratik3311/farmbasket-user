import { useState } from "react";

const Cart = ({ cart, userId }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "",
  });

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
  
    // Prepare order data for backend
    const orderData = {
      userId,
      products: cart.map(item => ({
        productId: item.productId,
        farmerId: item.farmerId,
      })),
      shippingDetails: orderDetails,
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
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold mb-2">Cart</h3>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="border-b py-2 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-4">
                <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout Button */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {/* Checkout Form */}
      {isCheckoutOpen && (
        <form onSubmit={handleCheckout} className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Shipping Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" value={orderDetails.name} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="address" placeholder="Address" value={orderDetails.address} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="city" placeholder="City" value={orderDetails.city} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="state" placeholder="State" value={orderDetails.state} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="phone" placeholder="Phone Number" value={orderDetails.phone} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="zipcode" placeholder="Zip Code" value={orderDetails.zipcode} onChange={handleChange} required className="p-2 border rounded" />
          </div>

          <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Submit Order
          </button>
        </form>
      )}
    </div>
  );
};

export default Cart;