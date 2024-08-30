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
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { Box, Text, Heading, Stack, Icon } from '@chakra-ui/react';
import { FaPlusCircle, FaRegHandshake } from 'react-icons/fa';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const [userCity, setUserCity] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { data: session } = useSession();
  const db = getFirestore(app);

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
      data.id = doc.id; 
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
      const joinedPost = { ...post, userEmail: session.user.email, postId: post.id }; 
      await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost); 

      const postRef = doc(db, "post", post.id);
      await updateDoc(postRef, {
        PlayersNeeded: post.PlayersNeeded - 1
      });

      setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? { ...p, PlayersNeeded: p.PlayersNeeded - 1 } : p));
      setJoinedPosts([...joinedPosts, post.id]);
    }
  };

  return (
    <main className="p-5 sm:px-7 md:px-10">
      <Hero />
      <h2 className="mt-16">Discover All Sport: </h2>
      {posts.length > 0 ? <Posts posts={posts} onJoinPost={onJoinPost} joinedPosts={joinedPosts} /> : null} 
      
      <div className='mt-20'>
        <div className='flex'>
          <h2>Games in Your Location:  </h2><h2 className='text-primary-600'>{userCity}</h2>
        </div>
        {filteredPosts.length > 0 ? (
          <Posts posts={filteredPosts} onJoinPost={onJoinPost} joinedPosts={joinedPosts} />
        ) : (
          <p>No games available in your location.</p>
        )}
      </div>
      
      <h2 className="mt-16 justify-center flex">How It Works</h2>
      <div className="flex flex-col md:flex-row gap-8 mt-8 justify-center">
        <div className="bg-gray-100 rounded-lg p-5 flex flex-col justify-between h-800 max-w-sm">
          <div>
            <div className="flex justify-center mb-4">
              <FaPlusCircle className="text-primary-500 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Create a Game</h3>
            <p className="text-center text-gray-700">
              Start your own game and invite others to join. Simply choose your sport, set a location, and pick a time.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600">
              Start Now
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-5 flex flex-col justify-between h-800 max-w-sm">
          <div>
            <div className="flex justify-center mb-4">
              <FaRegHandshake className="text-primary-500 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Join a Game</h3>
            <p className="text-center text-gray-700">
              Browse available games in your area, find one that fits your schedule, and join the action!
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600">
              Find a Game
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

//Bug to fix:
//