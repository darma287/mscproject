import { useEffect, useState } from 'react';
import Hero from '../../components/Home/Hero';
import Search from '../../components/Home/Search';
import SportList from '../../components/Home/SportList';
import app from '../../shared/FirebaseConfig';
import { collection, getDocs, setDoc, doc, updateDoc } from "firebase/firestore"; // added updateDoc
import { getFirestore } from 'firebase/firestore';
import { Inter } from 'next/font/google';
import Posts from '../../components/Home/Posts';
import { useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const db = getFirestore(app);

  const getPost = async () => {
    const querySnapshot = await getDocs(collection(db, "post"));
    const postsArray = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id; // Include the id in the post data
      postsArray.push(data);
    });
    setPosts(postsArray);
  };

  useEffect(() => {
    getPost();
  }, []);

  const onJoinPost = async (post) => {
    console.log("onJoinPost called with post:", post);
    if (session?.user?.email) {
      const joinedPost = { ...post, userEmail: session.user.email }; // Add user email to the joined post
      await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost); // Add joined post to Firestore

      // Decrease the PlayersNeeded count by 1
      const postRef = doc(db, "post", post.id);
      await updateDoc(postRef, {
        PlayersNeeded: post.PlayersNeeded - 1
      });

      // Update the local state to reflect the change in PlayersNeeded
      setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? { ...p, PlayersNeeded: p.PlayersNeeded - 1 } : p));
    }
  };

  return (
    <main className="p-5 sm:px-7 md:px-10">
      <Hero />
      <Search />
      <SportList />
      {posts.length > 0 ? <Posts posts={posts} onJoinPost={onJoinPost} /> : null} {/* Pass onJoinPost to Posts */}
    </main>
  );
}
