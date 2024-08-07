import { collection, getDocs, getFirestore, query, where, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import app from '../../../shared/FirebaseConfig';
import PostItem from '../../../components/Home/PostItem';

function Profile() {
  const { data: session } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (session) {
      getUserPosts();
      getJoinedPosts();
    }
  }, [session, getJoinedPosts, getUserPosts]);

  const getUserPosts = async () => {
    if (session?.user?.email) {
      const q = query(collection(db, 'post'), where('email', '==', session.user.email));
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
      setUserPosts(posts);
    }
  };

  const getJoinedPosts = async () => {
    if (session?.user?.email) {
      const q = query(collection(db, 'joinedPosts'), where('userEmail', '==', session.user.email));
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
      setJoinedPosts(posts);
    }
  };

  const onDeletePost = async (id) => {
    await deleteDoc(doc(db, "post", id));
    setUserPosts(userPosts.filter(post => post.id !== id));
    await deleteDoc(doc(db, "joinedPosts", id));
    setJoinedPosts(userPosts.filter(post => post.id !== id));
  };

  const onJoinPost = async (post) => {
    if (session?.user?.email) {
      const joinedPost = { ...post, userEmail: session.user.email };
      await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost);
      setJoinedPosts([...joinedPosts, joinedPost]);
    }
  };

  return (
    <div className="p-6 mt-8 lg:w-[70%] md:w-full mx-auto bg-background text-forGrey-900">
      <div className="p-6 bg-white shadow-sm rounded-lg mb-8">
        <h2 className="text-2xl font-extrabold text-primary-500 mb-4">Profile</h2>
        <Image src={session?.user?.image} alt="User Picture" className="w-16 h-16 rounded-full mr-4" />
          <div>
            <p className="text-lg"><strong>Name:</strong> {session?.user?.name}</p>
            <p className="text-lg"><strong>Email:</strong> {session?.user?.email}</p>
            <p className="text-lg"><strong>Gender:</strong> {session?.user?.gender}</p>
            <p className="text-lg"><strong>Date of Birth:</strong> {session?.user?.dob}</p>
          </div>
      </div>
      <div className="p-5 sm:px-7 md:px-10">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Your Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts && userPosts.map((item, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg">
                <div className="p-4">
                  <PostItem post={item} />
                  <button
                    onClick={() => onDeletePost(item.id)}
                    className="mt-2 px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-700 w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3">Joined Sports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedPosts && joinedPosts.map((item, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg">
                <div className="p-4">
                  <PostItem post={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
