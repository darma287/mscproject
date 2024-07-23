import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import PostModal from './PostModal';

function Posts({ posts = [] }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    console.log("Posts:", posts);
  }, [posts]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      setSelectedPost(null);
    }
  };

  return (
    <div>
      <PostModal ref={modalRef} post={selectedPost} onClose={handleCloseModal} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-10">
        {posts.map((item, index) => (
          <div key={index} className="m-2" onClick={() => handlePostClick(item)}>
            <PostItem post={item} modal={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
