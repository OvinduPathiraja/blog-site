import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Moment from 'moment';
import toast from 'react-hot-toast';

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/blog/${id}`);

      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        setError(response.data.message || 'Failed to fetch blog details.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching the blog.');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/blog/add-comment', {
        blog: id,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setName('');
        setContent('');
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
      fetchComments();
    } else {
      setLoading(false);
      setError('No blog ID provided in the URL.');
    }
  }, [id, axios]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 text-lg py-20">Error: {error}</div>;
  if (!blog) return <div className="text-center text-gray-500 text-lg py-20">Blog not found or deleted.</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-primary py-4 font-medium">Published on: {Moment(blog.createdAt).format('MMMM Do, YYYY')}</p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">{blog.title}</h1>
          <h2 className='my-5 max-w-lg truncate mx-auto'>{blog.subTitle}</h2>
          <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>Michael Brown</p>
        </div>

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-lg mb-8 shadow-md"
          />
        )}

        <div
          className="text-gray-700 leading-relaxed rich-text"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        ></div>

        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.map((item, index) => (
              <div key={index} className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form onSubmit={addComment} className="flex flex-col items-start gap-4 max-w-lg">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Comment"
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">Share this article on social media</p>
          <div className="flex">
            <img src={assets.facebook_icon} width={50} alt="facebook" />
            <img src={assets.twitter_icon} width={50} alt="twitter" />
            <img src={assets.googleplus_icon} width={50} alt="google plus" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
