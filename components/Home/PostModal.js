import React, { forwardRef } from 'react';
import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';

const PostModal = forwardRef(({ post, onClose }, ref) => {
  const hasTitle = post?.Title && post.Title.trim() !== "";
  const hasDescription = post?.Description && post.Description.trim() !== "";

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
    <dialog ref={ref} id="my_modal_3" className="modal p-0 rounded-lg">
      {post && (
        <div className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            {post.image ? (
              <img className="rounded-t-lg w-full h-[180px]" src={post.image} alt="Post image" />
            ) : (
              <div className="rounded-t-lg bg-gray-200 h-48 flex items-center justify-center">Missing Image</div>
            )}
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                {hasTitle ? (
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary">{post.Title}</h5>
                ) : (
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary">No Title</h5>
                )}
                <div className="flex items-center text-accent gap-2 mb-2">
                  <HiOutlineCalendar className="text-[20px]" />
                  {formatDate(post.Date)}
                </div>
                <div className="flex items-center text-accent gap-2 mb-2">
                  <HiOutlineMapPin className="text-[20px]" />
                  {post.Location || 'No Location'} <div></div>
                  {post.PostCode || 'No Postcode'}
                </div>
                {hasDescription ? (
                  <p className="mb-3 font-normal text-gray-700">{post.Description}</p>
                ) : (
                  <p className="mb-3 font-normal text-gray-700">No Description</p>
                )}
                <div className="flex items-center text-accent gap-2 mb-2">
                  <p>Price (in Pounds): {post.Price || 'No Price'}</p>
                </div>
                <div className="flex items-center text-accent gap-2 mb-2">
                  <p>Players Needed: {post.PlayersNeeded || 'No Players Needed'}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  <p className="text-gray-700">No Reviews Yet</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn btn-secondary" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
});

export default PostModal;
