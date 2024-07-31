import React from 'react';
import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';

function PostItem({ post,modal=false }) {
  console.log("PostItem post:", post);

  const hasTitle = post.Title && post.Title.trim() !== "";
  const hasDescription = post.Description && post.Description.trim() !== "";

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No Date';
    let date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {post.image ? (
        <img className="rounded-t-lg w-full h-[180px]" src={post.image} alt="Post image" />
      ) : (
        <div className="rounded-t-lg bg-gray-200 h-48">Missing Image</div> 
      )}
      <div className="p-5">
        {hasTitle ? (
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.Title}</h5>
        ) : (
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">No Title</h5>
        )}
        <div className="flex items-center text-green-500 gap-2 mb-2">
          <HiOutlineCalendar className="text-[20px]" />
          {formatDate(post.Date)}
        </div>
        <div className="flex items-center text-green-500 gap-2 mb-2">
          <HiOutlineMapPin className="text-[20px]" />
          {post.Location || 'No Location'}
        </div>
        {hasDescription ? (
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.Description}</p>
        ) : (
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">No Description</p>
        )}
        <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Join
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default PostItem;
