import Hero from '../../components/Home/Hero';
import Search from '../../components/Home/Search';
import SportList from '../../components/Home/SportList';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="p-5 sm:px-7 md:px-10">
<Hero />
<Search />
<SportList />

    </main>
  );
}

