import React, { useEffect } from 'react';
import PostItem from './PostItem';

function Posts({ posts = [], onJoinPost, joinedPosts }) {
  useEffect(() => {
    console.log("Posts onJoinPost:", onJoinPost);
    console.log("Posts:", posts);
  }, [posts, onJoinPost]);

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-10">
        {posts.map((item, index) => (
          <div key={index} className="m-2">
            <PostItem post={item} onJoin={onJoinPost} isJoined={joinedPosts.includes(item.id)} /> {/* Ensure onJoinPost and isJoined are passed to PostItem */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
