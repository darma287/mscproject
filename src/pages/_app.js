import '../styles/globals.css';
import Footer from '../../components/Home/Footer';
import Header from '../../components/Home/Header';
import { SessionProvider } from "next-auth/react";
import 'leaflet/dist/leaflet.css';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
    </SessionProvider>
  );
}
