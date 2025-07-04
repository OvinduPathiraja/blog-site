import React, { useState } from 'react';
import { blogCategories } from '../assets/assets'; 
import { motion } from "framer-motion";
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader'; 

const BlogList = () => {
  const [menu, setMenu] = useState('All'); 
  const { blogs, input, loading } = useAppContext(); 

  // Function to filter blogs based on search input
  const filteredBlogs = () => {
    if (!blogs) return [];

    if (input === '') {
      return blogs;
    }

    // Filter blogs whose title or category includes the search input (case-insensitive)
    return blogs.filter((blog) => 
      blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Display a loader while blogs are being fetched
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
        {/* Map through blogCategories to create clickable category tabs */}
        {blogCategories.map((item) => (
          <div key={item} className='relative'>
            <button
              onClick={() => setMenu(item)} // Set the active menu item on click
              // Dynamically apply styles based on whether this tab is active
              className={`cursor-pointer text-gray-500 ${menu === item ? 'text-white px-4 pt-0.5' : ''}`}
            >
              {item}
              {/* Animated underline for the active tab */}
              {menu === item && (
                <motion.div
                  layout // Enables layout animations with Framer Motion
                  id='underline'
                  transition={{ type: "spring", stiffness: 500, damping: 30 }} // Smooth spring animation
                  className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {/* Render BlogCard components:
          1. First, apply the search filter using filteredBlogs().
          2. Then, apply the category filter:
             - If 'All' tab is selected (menu === "All"), show all blogs that passed the search filter.
             - Otherwise, compare the blog's category with the selected menu item,
               converting both to lowercase to ensure case-insensitive matching.
        */}
        {filteredBlogs()
          .filter((blog) => menu === "All" ? true : blog.category.toLowerCase() === menu.toLowerCase())
          .map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>
    </div>
  );
};

export default BlogList;