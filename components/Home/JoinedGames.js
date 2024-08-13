import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';
import Image from 'next/image';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import app from '../../shared/FirebaseConfig';

function JoinedGames({ post, onJoin, isJoined, onReadMore, onPostDelete }) {
  const db = getFirestore(app);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 180 });

  useEffect(() => {
    if (post.image) {
      const img = new window.Image();
      img.src = post.image;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setImageDimensions({ width: aspectRatio * 180, height: 180 });
      };
    }
  }, [post.image]);

  const hasTitle = post.Title && post.Title.trim() !== '';
  const hasDescription = post.Description && post.Description.trim() !== '';

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

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

  const onDeletePost = async () => {
    await deleteDoc(doc(db, 'post', post.id));
    await deleteDoc(doc(db, 'joinedPosts', post.id));
    if (onPostDelete) {
      onPostDelete(post.id);
    }
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      {post.image && imageDimensions.width > 0 && imageDimensions.height > 0 ? (
        <Image 
          className="rounded-t-lg w-full h-[180px]" 
          src={post.image} 
          alt="Post image" 
          width={imageDimensions.width} 
          height={imageDimensions.height}
        />
      ) : (
        <div className="rounded-t-lg bg-gray-200 h-48 flex items-center justify-center">Loading image...</div>
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
            {truncateText(post.Location || 'No Location', 20)} 
            <div>{post.PostCode || 'No Postcode'}</div>
          </div>
          {hasDescription ? (
            <p className="mb-3 font-normal text-gray-700">{truncateText(post.Description || 'No Description', 30)}</p>
          ) : (
            <p className="mb-3 font-normal text-gray-700">No Description</p>
          )}
          <div className="flex items-center text-accent gap-2 mb-2">
            <p>Price (in Pounds): {post.Price || 'No Price'}</p>
          </div>
          <div className="flex items-center text-accent gap-2 mb-2">
            <p>Players Needed: {post.PlayersNeeded || 'No Players Needed'}</p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={onDeletePost}
            disabled={post.PlayersNeeded <= 0 || isJoined}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none ${
              post.PlayersNeeded <= 0 || isJoined ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary-500 hover:bg-secondary-600 focus:ring-secondary-300'
            }`}
          >
            {post.PlayersNeeded <= 0 ? 'Game is full' : isJoined ? 'Joined' : 'Delete'}
            {!isJoined && post.PlayersNeeded > 0 && (
              <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onReadMore(post)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-primary-500 border border-primary-500 rounded-lg focus:ring-4 focus:outline-none hover:bg-primary-100 focus:ring-primary-200"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinedGames;
