import React, {useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Modified Home component with DB integration
const Home = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  
  // Generate consistent user ID
  const userId = isAuthenticated ? `user_${user?.sub?.split('|')[1] || Math.random().toString(36).substring(2, 10)}` : null;
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products"); // Redirect to products page on successful login
      
      // Save user to database
      const saveUserToDatabase = async () => {
        try {
          // Prepare user data
          const userData = {
            userId: userId,
            name: user.name,
            email: user.email,
            picture: user.picture
          };
          
          // Send to backend
          const response = await axios.post(`http://localhost:5000/api/users`, userData);
          console.log('User saved to database:', response.data);
          setDbUser(response.data.user);
        } catch (error) {
          console.error('Error saving user to database:', error);
        }
      };
      
      saveUserToDatabase();
    }
  }, [isAuthenticated, navigate, user, userId]);
  
  return (
    <div className="flex flex-col lg:flex-row items-start px-8 py-16 bg-[#f9f4ef] min-h-screen font-sans">
      {/* Left Text Section */}
      <div className="text-left lg:w-1/2 space-y-6 lg:pt-16">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-black leading-tight">
          Fresh from the Farm, Straight to Your Home
        </h1>
        <p className="text-lg text-gray-700 max-w-xl">
          Join a movement where farms meet families directly. Support local farmers while enjoying natural, unprocessed products delivered to your doorstep
        </p>
        {isAuthenticated && (
          <div>
            <h2>{user.name}</h2>
            {dbUser && <p className="text-sm text-gray-500">User ID: {userId}</p>}
          </div>
        )}
        {isAuthenticated ? (
          <button 
            onClick={() => logout({ returnTo: window.location.origin })}
            className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-md mt-4 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-md mt-4 cursor-pointer"
          >
            Login now
          </button>
        )}
      </div>
      {/* Right Image Section */}
      <div className="grid min-h-[140px] w-1/2 place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <img className="object-cover object-center h-40 max-w-full rounded-lg md:h-60"
              src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1470&amp;q=80"
              alt="" />
          </div>
          <div>
            <img className="object-cover object-center h-40 max-w-full rounded-lg md:h-60"
              src="https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80"
              alt="" />
          </div>
          <div>
            <img className="object-cover object-center h-40 max-w-full rounded-lg md:h-60"
              src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2560&amp;q=80"
              alt="" />
          </div>
          <div>
            <img className="object-cover object-center h-40 max-w-full rounded-lg md:h-60"
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2940&amp;q=80"
              alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;