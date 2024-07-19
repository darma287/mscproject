import { useEffect } from 'react';
import Hero from '../../components/Home/Hero';
import Search from '../../components/Home/Search';
import SportList from '../../components/Home/SportList';
import app from '../../shared/FirebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const db = getFirestore(app);

const getPost = async () => {
  const querySnapshot = await getDocs(collection(db, "post"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

export default function Home() {
  useEffect(() => {
    getPost();
  }, []);

  return (
    <main className="p-5 sm:px-7 md:px-10">
      <Hero />
      <Search />
      <SportList />
    </main>
  );
}
