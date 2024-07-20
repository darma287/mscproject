import { useEffect, useState } from 'react';
import Hero from '../../components/Home/Hero';
import Search from '../../components/Home/Search';
import SportList from '../../components/Home/SportList';
import app from '../../shared/FirebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { Inter } from 'next/font/google';
import Posts from '../../components/Home/Posts';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [posts, setPosts] = useState([]);

  const db = getFirestore(app);

  const getPost = async () => {
    const querySnapshot = await getDocs(collection(db, "post"));
    const postsArray = [];
    querySnapshot.forEach((doc) => {
      postsArray.push(doc.data());
    });
    setPosts(postsArray);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <main className="p-5 sm:px-7 md:px-10">
      <Hero />
      <Search />
      <SportList />
      {posts.length > 0 ? <Posts posts={posts} /> : null}
    </main>
  );
}
