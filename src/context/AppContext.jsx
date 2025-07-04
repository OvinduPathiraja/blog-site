import React, { createContext, useContext, useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [blogs, setBlogs] = useState([]); 
  const [input, setInput] = useState(''); 
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

  
  axios.defaults.baseURL = 'http://localhost:3000';

  // Function to fetch all blogs from the backend
  const fetchBlogs = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await axios.get('/api/blog/all'); // API endpoint to get all blogs
      if (response.data.success) {
        setBlogs(response.data.blogs); // Update blogs state with fetched data
      } else {
        console.error('Failed to fetch blogs:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    // Optionally show a toast error to the user here
  } finally {
    setLoading(false); // Set loading to false after fetching (whether success or failure)
  }
  };

  // useEffect hook to call fetchBlogs when the component mounts
  useEffect(() => {
    fetchBlogs();
  }, []); 

  return (
    <AppContext.Provider value={{ token, setToken, navigate, axios, blogs, input, setInput, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);