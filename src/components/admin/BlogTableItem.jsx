// client/src/pages/admin/BlogTableItem.jsx

import React from 'react';
import { assets } from '../../assets/assets'; // Correct path to assets based on your directory structure
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
// import Navbar from '../components/Navbar'; // REMOVE THIS IMPORT - Navbar should NOT be here

const BlogTableItem = ({ blog, fetchBlogs, index }) => {

    const { title, createdAt } = blog;
    const BlogDate = new Date(createdAt);


    const {axios} = useAppContext();

    const deleteBlog = async ()=>{
      const confirm = window.confirm('Are you sure you want to delete this blog?')
      if(!confirm) return;
      try{
        const {data} = await axios.post('/api/blog/delete', {id: blog._id})
        if (data.success){
        toast.success(data.message)
        await fetchBlogs()
        } else{
        toast.error(data.message)
        }
      } catch (error){
        toast.error(error.message)
      }
    }

    const togglePublish = async()=>{
      try{
        const {data} = await axios.post('/api/blog/toggle-publish', {id: blog._id}) // ✅ Corrected line
      if (data.success){
        toast.success(data.message)
        await fetchBlogs()
      } else{
        toast.error(data.message)
      }
      } catch (error) {
        toast.error(error.message)
      }
    }

    return (
        // REMOVE THE <div> WRAPPER HERE. A <tr> must be a direct child of <tbody>.
        <tr className='border-y border-gray-300'>
            {/* REMOVE <Navbar/> from here. It's causing the repetition and potentially the 500 error due to invalid nesting. */}
            <th className='px-2 py-4'>{index}</th>
            <td className='px-2 py-4'>{title}</td>
            <td className='px-2 py-4'>{BlogDate.toDateString()}</td>
            <td className='px-2 py-4 max-sm:hidden'>
                <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>
                    {blog.isPublished ? 'Published' : 'Unpublished'}
                </p>
            </td>
            <td className='px-2 py-4 flex text-xs gap-3'>
                <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
                    {blog.isPublished ? 'Unpublished' : 'Published'}
                </button>
                <img src={assets.cross_icon} alt="" className='w-8 hover:scale-110 transition-all cursor-pointer' onClick={deleteBlog}/>
            </td>
        </tr>
    );
};

export default BlogTableItem;