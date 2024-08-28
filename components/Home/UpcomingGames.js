import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';
import Image from 'next/image';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

function UpcomingGames({ post, isJoined, onReadMore }) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 180 });
  const { data: session } = useSession();
  const db = getFirestore();

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

  const hasTitle = post.Title && post.Title.trim() !== "";
  const hasDescription = post.Description && post.Description.trim() !== "";

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

  const handleCancel = async () => {
    if (isJoined) {
      try {
        const joinedPostDocRef = doc(db, "joinedPosts", `${post.id}-${session.user.email}`);
        await deleteDoc(joinedPostDocRef);

        // Increase the PlayersNeeded count by 1
        const postRef = doc(db, "post", post.id);
        await updateDoc(postRef, {
          PlayersNeeded: post.PlayersNeeded + 1,
        });

        // Optionally, you might want to update the local state to reflect the change
        setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? { ...p, PlayersNeeded: p.PlayersNeeded + 1 } : p));
        setJoinedPosts(prevJoinedPosts => prevJoinedPosts.filter(postId => postId !== post.id));
      } catch (error) {
        console.error("Error canceling join:", error);
      }
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
            {truncateText(post.Location || 'No Location', 20)} <div></div>
            {post.PostCode || 'No Postcode'}
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
            onClick={handleCancel}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-red-500 hover:bg-red-600`}
          >
            Cancel
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

export default UpcomingGames;
