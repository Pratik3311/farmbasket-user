import { useState, useEffect } from "react";

const SidebarFilter = ({ onFilterChange }) => {
  // States for different filters
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [customerRating, setCustomerRating] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  
  // State for sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  
  // States for section visibility
  const [sections, setSections] = useState({
    location: true,
    price: true,
    rating: true,
    delivery: true,
    payment: true
  });
  
  // List of all Indian states
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  
  // Toggle section visibility
  const toggleSection = (section) => {
    setSections({
      ...sections,
      [section]: !sections[section]
    });
  };
  
  // Handle location change
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    updateFilters({ location: e.target.value });
  };
  
  // Handle price slider change
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setPriceRange(newPriceRange);
    updateFilters({ priceRange: newPriceRange });
  };
  
  // Handle checkbox change for customer rating
  const handleRatingChange = (rating) => {
    const newRatings = customerRating.includes(rating)
      ? customerRating.filter(r => r !== rating)
      : [...customerRating, rating];
    setCustomerRating(newRatings);
    updateFilters({ customerRating: newRatings });
  };
  
  // Handle checkbox change for delivery time
  const handleDeliveryTimeChange = (time) => {
    const newDeliveryTimes = deliveryTime.includes(time)
      ? deliveryTime.filter(t => t !== time)
      : [...deliveryTime, time];
    setDeliveryTime(newDeliveryTimes);
    updateFilters({ deliveryTime: newDeliveryTimes });
  };
  
  // Handle checkbox change for payment options
  const handlePaymentOptionChange = (option) => {
    const newPaymentOptions = paymentOptions.includes(option)
      ? paymentOptions.filter(o => o !== option)
      : [...paymentOptions, option];
    setPaymentOptions(newPaymentOptions);
    updateFilters({ paymentOptions: newPaymentOptions });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setLocation("");
    setPriceRange([0, 50000]);
    setCustomerRating([]);
    setDeliveryTime([]);
    setPaymentOptions([]);
    // Apply the reset filters to the parent component
    if (onFilterChange) {
      onFilterChange({
        location: "",
        priceRange: [0, 50000],
        customerRating: [],
        deliveryTime: [],
        paymentOptions: []
      });
    }
  };
  
  // Update filters
  const updateFilters = (changedFilter) => {
    const filters = {
      location,
      priceRange,
      customerRating,
      deliveryTime,
      paymentOptions,
      ...changedFilter
    };
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };
  
  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Simple chevron icons
  const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  const ChevronUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );
  
  // Collapse button icon
  const CollapseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round">
      {collapsed ?
        <polyline points="13 17 18 12 13 7"></polyline> :
        <polyline points="11 17 6 12 11 7"></polyline>}
    </svg>
  );
  
  // Icons for the sidebar sections
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
         fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd" />
    </svg>
  );
  
  const PriceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
         fill="currentColor">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd" />
    </svg>
  );
  
  const RatingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
         fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  
  const DeliveryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
         fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  );
  
  const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
         fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
  );
  
  // Section header component
  const SectionHeader = ({ title, icon, section }) => (
    <div
      className="flex items-center justify-between cursor-pointer mb-2 bg-gray-700 p-2 rounded hover:bg-gray-600 transition-all"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      {sections[section] ? <ChevronUp /> : <ChevronDown />}
    </div>
  );
  
  return (
    <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-full'}`}>
      <div className="relative">
        {/* Main sidebar content */}
        <div className={`sidebar-filter bg-gray-800 text-white transition-all duration-300 rounded-lg shadow-lg ${collapsed ? 'p-2' : 'p-4'}`}>
          {!collapsed && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-300 hover:text-white underline"
                >
                  Reset All
                </button>
              </div>
              {/* Apply Filter Button */}
              <button
                onClick={() => updateFilters({})}
                className="w-full bg-yellow-500 text-black py-2 font-semibold rounded-md mb-4 hover:bg-yellow-400 transition-colors shadow-md"
              >
                Apply Filters
              </button>
              {/* Location Filter */}
              <div className="mb-4 border-b border-gray-700 pb-3">
                <SectionHeader
                  title="Location"
                  icon={<LocationIcon />}
                  section="location"
                />
                {sections.location && (
                  <select
                    className="w-full p-2 rounded text-black bg-gray-100 mt-2 border-2 border-gray-300 focus:border-yellow-500 focus:outline-none"
                    value={location}
                    onChange={handleLocationChange}
                  >
                    <option value="" disabled className="text-gray-300">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                )}
              </div>
              {/* Price Range Filter */}
              <div className="mb-4 border-b border-gray-700 pb-3">
                <SectionHeader
                  title="Price Range (₹)"
                  icon={<PriceIcon />}
                  section="price"
                />
                {sections.price && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-16 p-1 rounded text-black text-center bg-white border border-gray-300 text-sm"
                      />
                      <span className="text-gray-400 mx-2">---</span>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-16 p-1 rounded text-black text-center bg-white border border-gray-300 text-sm"
                      />
                    </div>
                    <div className="mb-4 px-2">
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Customer Rating Filter
              <div className="mb-4 border-b border-gray-700 pb-3">
                <SectionHeader
                  title="Customer Rating"
                  icon={<RatingIcon />}
                  section="rating"
                />
                {sections.rating && (
                  <div className="mt-2 space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={`rating${rating}`} className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors">
                        <input
                          type="checkbox"
                          id={`rating${rating}`}
                          checked={customerRating.includes(rating)}
                          onChange={() => handleRatingChange(rating)}
                          className="mr-2 h-4 w-4 accent-yellow-500"
                        />
                        <label htmlFor={`rating${rating}`} className="flex items-center cursor-pointer w-full">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}>
                              ★
                            </span>
                          ))}
                          <span className="ml-1 text-sm">&amp; Up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
              {/* Delivery Time Filter */}
              <div className="mb-4 border-b border-gray-700 pb-3">
                <SectionHeader
                  title="Delivery Time"
                  icon={<DeliveryIcon />}
                  section="delivery"
                />
                {sections.delivery && (
                  <div className="mt-2 space-y-2">
                    {[
                      { id: "nextDay", value: "next_day", label: "Next Day Delivery" },
                      { id: "2-3days", value: "2-3_days", label: "2-3 Days" },
                      { id: "4-7days", value: "4-7_days", label: "4-7 Days" }
                    ].map((option) => (
                      <div key={option.id} className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors">
                        <input
                          type="checkbox"
                          id={option.id}
                          checked={deliveryTime.includes(option.value)}
                          onChange={() => handleDeliveryTimeChange(option.value)}
                          className="mr-2 h-4 w-4 accent-yellow-500"
                        />
                        <label htmlFor={option.id} className="cursor-pointer w-full">{option.label}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Payment Options Filter */}
              <div className="mb-4">
                <SectionHeader
                  title="Payment Options"
                  icon={<PaymentIcon />}
                  section="payment"
                />
                {sections.payment && (
                  <div className="mt-2 space-y-2">
                    {[
                      { id: "cod", value: "cod", label: "Pay on Delivery" },
                      { id: "online", value: "online", label: "Online Payment" },
                      { id: "upi", value: "upi", label: "UPI" },
                      { id: "card", value: "card", label: "Card Payment" }
                    ].map((option) => (
                      <div key={option.id} className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors">
                        <input
                          type="checkbox"
                          id={option.id}
                          checked={paymentOptions.includes(option.value)}
                          onChange={() => handlePaymentOptionChange(option.value)}
                          className="mr-2 h-4 w-4 accent-yellow-500"
                        />
                        <label htmlFor={option.id} className="cursor-pointer w-full">{option.label}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {/* Collapsed sidebar with just icons */}
          {collapsed && (
            <div className="flex flex-col items-center py-4 space-y-6">
              <div className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all">
                <LocationIcon />
              </div>
              <div className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all">
                <PriceIcon />
              </div>
              {/* <div className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all">
                <RatingIcon />
              </div> */}
              <div className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all">
                <DeliveryIcon />
              </div>
              <div className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all">
                <PaymentIcon />
              </div>
            </div>
          )}
          
          {/* Collapse button - attached to the sidebar */}
          {/* <button
            onClick={toggleCollapse}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full shadow-lg text-white transition-all"
            aria-label={collapsed ? "Expand filters" : "Collapse filters"}
          >
            <CollapseIcon />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;