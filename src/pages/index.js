import { useEffect, useState, useCallback } from 'react';
import Hero from '../../components/Home/Hero';
import Search from '../../components/Home/Search';
import SportList from '../../components/Home/SportList';
import app from '../../shared/FirebaseConfig';
import { collection, getDocs, setDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import Posts from '../../components/Home/Posts';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const [userCity, setUserCity] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { data: session } = useSession();
  const db = getFirestore(app);

  // Function to get the user's city using an IP geolocation API
  const getUserCity = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      setUserCity(response.data.city);
    } catch (error) {
      console.error('Error fetching user city:', error);
    }
  };

  const getPost = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "post"));
    const postsArray = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id; // Include the id in the post data
      postsArray.push(data);
    });
    setPosts(postsArray);
  }, [db]);

  const getJoinedPosts = useCallback(async () => {
    if (session?.user?.email) {
      const q = query(collection(db, "joinedPosts"), where("userEmail", "==", session.user.email));
      const querySnapshot = await getDocs(q);
      const joinedPostsArray = [];
      querySnapshot.forEach((doc) => {
        joinedPostsArray.push(doc.data().postId);
      });
      setJoinedPosts(joinedPostsArray);
    }
  }, [db, session?.user?.email]);

  useEffect(() => {
    getUserCity();
    getPost();
    getJoinedPosts();
  }, [session, getJoinedPosts, getPost]);

  useEffect(() => {
    if (userCity) {
      const filtered = posts.filter(post => post.City === userCity);
      setFilteredPosts(filtered);
    }
  }, [userCity, posts]);

  const onJoinPost = async (post) => {
    console.log("onJoinPost called with post:", post);
    if (session?.user?.email) {
      const joinedPost = { ...post, userEmail: session.user.email, postId: post.id }; // Add user email and postId to the joined post
      await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost); // Add joined post to Firestore

      // Decrease the PlayersNeeded count by 1
      const postRef = doc(db, "post", post.id);
      await updateDoc(postRef, {
        PlayersNeeded: post.PlayersNeeded - 1
      });

      // Update the local state to reflect the change in PlayersNeeded and joined status
      setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? { ...p, PlayersNeeded: p.PlayersNeeded - 1 } : p));
      setJoinedPosts([...joinedPosts, post.id]);
    }
  };

  return (
    <main className="p-5 sm:px-7 md:px-10">
      <Hero />
      <h2 className='mt-16'>Discover All Sport: </h2>
      {posts.length > 0 ? <Posts posts={posts} onJoinPost={onJoinPost} joinedPosts={joinedPosts} /> : null} {/* Pass onJoinPost and joinedPosts to Posts */}
      
      <div>
        <h2>Games in Your Location: {userCity}</h2>
        {filteredPosts.length > 0 ? (
          <Posts posts={filteredPosts} onJoinPost={onJoinPost} joinedPosts={joinedPosts} />
        ) : (
          <p>No games available in your location.</p>
        )}
      </div>
      
      <h2 className='mt-16'>How It Works</h2>
    </main>
  );
}
