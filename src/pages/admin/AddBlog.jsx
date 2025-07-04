import React, { useEffect, useState, useRef} from 'react'
import {assets, blogCategories} from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import {parse} from 'marked'

const AddBlog = () => {

  const {axios} = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)


  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async()=>{
    if(!title) return toast.error('Please enter a title')

      try{
        setLoading(true);
        const {data} = await axios.post('api/blog/generate', {prompt: title})
        if(data.success){
          quillRef.current.root.innerHTML = parse(data.content)
        } else{
          toast.error(data.message)
        }
      } catch(error){
        toast.error(error.message)
      } finally{
        setLoading(false)
      }
  }

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    setIsAdding(true); // Disable button immediately

    let descriptionContent = '';
    // ✅ ADDED: Safely get Quill editor content
    if (quillRef.current) {
        descriptionContent = quillRef.current.root.innerHTML;
    } else {
        toast.error("Text editor not initialized. Please refresh the page.");
        setIsAdding(false);
        return; // Stop execution if editor isn't ready
    }

    try{
      const blog = {
        title, subTitle,
        description: descriptionContent, // Use the safely obtained description
        category, isPublished
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      // ✅ ADDED: Check if image is selected before appending
      if (image) {
        formData.append('image', image);
      } else {
        // Optionally, show a warning or make image optional
        toast.error("Please upload a thumbnail image.");
        setIsAdding(false);
        return;
      }


      // Check if image is a File object before proceeding
      if (image && !(image instanceof File)) {
          toast.error("Invalid image selected. Please select a valid image file.");
          setIsAdding(false);
          return;
      }


      const {data} = await axios.post('/api/blog/add', formData); // Removed '/api' assuming baseURL handles it

      if(data.success){
        toast.success(data.message); // ✅ FIXED: toast.sucess to toast.success
        // Reset form fields
        setImage(false);
        setTitle('');
        setSubTitle(''); // Clear subTitle
        if (quillRef.current) { // Safely clear editor
          quillRef.current.root.innerHTML = '';
        }
        setCategory('Startup'); // Reset to default
        setIsPublished(false); // Reset checkbox
      } else{
        toast.error(data.message);
      }
    } catch(error){
      console.error("Error adding blog:", error); // Log error for debugging
      toast.error(error.response?.data?.message || error.message || 'Error adding blog.'); // More robust error message
    } finally{
      setIsAdding(false); // Re-enable button
    }
  };

  useEffect(()=>{
    // Initialize Quill editor only once when the component mounts and the editorRef is available
    if (editorRef.current && !quillRef.current) { // Ensure quillRef is not already set
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }

    // Cleanup function for Quill (optional, but good practice if component unmounts frequently)
    return () => {
        if (quillRef.current) {
            quillRef.current = null; // Clear ref on unmount
        }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          {/* Display selected image or upload area icon */}
          <img
            src={ !image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Upload Area"
            className='mt-2 h-16 rounded cursor-pointer'
          />
          {/* Input for file selection */}
          <input
            onChange={(e)=> setImage(e.target.files[0])}
            type="file"
            id='image'
            hidden
            required // Ensure an image is selected
          />
        </label>

        <p className='mt-4'>Blog Title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={e => setTitle(e.target.value)}
          value={title}
        />

        <p className='mt-4'>Sub Title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={e => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className='mt-4'>Blog Description</p>
        <div className="relative max-w-lg min-h-[200px] pb-16 sm:pb-10 pt-2">
          {/* Quill Editor will mount here */}
          <div ref={editorRef}></div> 
          {loading && (
            <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
            <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'>
              </div>
            </div>)}
          <button disabled={loading}
            type="button" // Important: type="button" to prevent form submission
            onClick={generateContent}
            className="absolute bottom-4 right-4 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            Generate with AI
          </button>
        </div>

        <p className='mt-4'>Blog Category</p>
        <select
          onChange={e => setCategory (e.target.value)}
          name="category"
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
          value={category} // Controlled component: set value from state
        >
          <option value="">Select Category</option> {/* Added a default empty option */}
          {blogCategories.map((item, index)=>{
            return <option key={index} value={item}>{item}</option>
          })}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={e => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding} // Button disabled when isAdding is true
          type='submit'
          className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50' // Added disabled style
        >
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;