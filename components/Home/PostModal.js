import React, { forwardRef } from 'react';
import PostItem from './PostItem';

const PostModal = forwardRef(({ post, onClose }, ref) => {
  return (
    <dialog ref={ref} id="my_modal_3" className="modal p-0 rounded-lg">
      {post && (
        <div className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
          <PostItem post={post} />
          <div className="modal-action">
          </div>
        </div>
      )}
    </dialog>
  );
});

export default PostModal;
