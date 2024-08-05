import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import PostModal from './PostModal';

function Posts({ posts = [], onJoinPost, joinedPosts }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    console.log("Posts onJoinPost:", onJoinPost);
    console.log("Posts:", posts);
  }, [posts, onJoinPost]);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    modalRef.current.showModal();
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    modalRef.current.close();
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-10">
        {posts.map((item, index) => (
          <div key={index} className="m-2">
            <PostItem post={item} onJoin={onJoinPost} isJoined={joinedPosts.includes(item.id)} onReadMore={handleReadMore} />
          </div>
        ))}
      </div>
      <PostModal ref={modalRef} post={selectedPost} onClose={handleCloseModal} />
    </div>
  );
}

export default Posts;
