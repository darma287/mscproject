import React, { useEffect } from 'react';
import PostItem from './PostItem';

function Posts({ posts = [] }) {
  useEffect(() => {
    console.log("Posts:", posts);
  }, [posts]);

  return (
    <div className="flex flex-wrap">
      {posts.map((item, index) => (
        <div key={index} className="m-2">
          <PostItem post={item} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
