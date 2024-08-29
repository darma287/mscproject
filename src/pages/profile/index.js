import { collection, getDocs, getFirestore, query, where, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';
import app from '../../../shared/FirebaseConfig';
import PostItem from '../../../components/Home/PostItem';
import Image from 'next/image';
import UpcomingGames from '../../../components/Home/UpcomingGames';
import PastGames from '../../../components/Home/PastGames'; 
import JoinedGames from '../../../components/Home/JoinedGames';


function Profile() {
  const { data: session } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const db = getFirestore(app);

  const getUserPosts = useCallback(async () => {
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
  }, [db, session?.user?.email]);

  const getJoinedPosts = useCallback(async () => {
    if (session?.user?.email) {
      const q = query(collection(db, 'joinedPosts'), where('userEmail', '==', session.user.email));
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
  
      const today = new Date();
      const past = [];
      const upcoming = [];
  
      posts.forEach(post => {
        const postDate = post.Date.toDate();
        if (postDate < today) {
          past.push(post);
        } else {
          upcoming.push(post);
        }
      });
  
      setPastGames(past);
      setUpcomingGames(upcoming);
    }
  }, [db, session?.user?.email]);
  

  useEffect(() => {
    if (session) {
      getUserPosts();
      getJoinedPosts();
    }
  }, [session, getUserPosts, getJoinedPosts]);



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
        <Image src={session?.user?.image} alt="User Picture" className="w-16 h-16 rounded-full mr-4" width={64} height={64} />
        <div>
          <p className="text-lg"><strong>Name:</strong> {session?.user?.name}</p>
          <p className="text-lg"><strong>Email:</strong> {session?.user?.email}</p>
          <p className="text-lg"><strong>Games created:</strong> {userPosts.length}</p>
        </div>
      </div>
      <div className="p-5 sm:px-7 md:px-10">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Your Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts && userPosts.map((item, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg">
                <div className="p-4">
                  <JoinedGames post={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3">Joined Sports</h3>
          <div>
            <h4 className="text-lg font-semibold mb-2">Past Games</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pastGames && pastGames.map((item, index) => (
                <div key={index} className="bg-white shadow-sm rounded-lg">
                  <div className="p-4">
                    <PastGames post={item} />
                  </div>
                </div>
              ))}
            </div>
            <h4 className="text-lg font-semibold mb-2">Upcoming Games</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames && upcomingGames.map((item, index) => (
                <div key={index} className="bg-white shadow-sm rounded-lg">
                  <div className="p-4">
                    <UpcomingGames post={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

//bug to fix:
//handle cancel -> add number of players back, delete from joinedSport list
//handle readmore -> open postModal
//fix past game