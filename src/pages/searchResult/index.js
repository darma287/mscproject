import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, getFirestore } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import app from '../../../shared/FirebaseConfig';
import PostItem from '../../../components/Home/PostItem';
import PostModal from '../../../components/Home/PostModal';
import Search from '../../../components/Home/Search';

const SearchResult = () => {
  const router = useRouter();
  const { query: searchQuery } = router.query;
  const [results, setResults] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const { data: session } = useSession();
  const db = getFirestore(app);
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery) {
        const q = query(
          collection(db, 'post'),
          where('Title', '>=', searchQuery),
          where('Title', '<=', searchQuery + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const fetchedResults = [];
        querySnapshot.forEach(doc => {
          let data = doc.data();
          data.id = doc.id;
          fetchedResults.push(data);
        });

        setResults(fetchedResults);
      }
    };

    fetchResults();
    if (session?.user?.email) {
      const getJoinedPosts = async () => {
        const q = query(collection(db, "joinedPosts"), where("userEmail", "==", session.user.email));
        const querySnapshot = await getDocs(q);
        const joinedPostsArray = [];
        querySnapshot.forEach((doc) => {
          joinedPostsArray.push(doc.data().postId);
        });
        setJoinedPosts(joinedPostsArray);
      };
      getJoinedPosts();
    }
  }, [searchQuery, db, session]);

  const onJoinPost = async (post) => {
    if (session?.user?.email) {
      const joinedPost = { ...post, userEmail: session.user.email, postId: post.id };
      await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost);

      const postRef = doc(db, "post", post.id);
      await updateDoc(postRef, {
        PlayersNeeded: post.PlayersNeeded - 1
      });

      setResults(prevResults => prevResults.map(p => p.id === post.id ? { ...p, PlayersNeeded: p.PlayersNeeded - 1 } : p));
      setJoinedPosts([...joinedPosts, post.id]);
    }
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    modalRef.current.showModal();
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    modalRef.current.close();
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for: &quot;{searchQuery}&quot;</h1>
      <div className="flex items-center justify-center gap-4 mt-5 px-10">
      {results.length > 0 ? (
        results.map((item, index) => (
          <div key={index} className="m-2">
            <PostItem 
              post={item} 
              onJoin={() => onJoinPost(item)} 
              isJoined={joinedPosts.includes(item.id)} 
              onReadMore={() => handleReadMore(item)} 
            />
          </div>
        ))       
         ) : (
          <div className='flex flex-col align-middle items-center justify-center mt-4 mb-4 w-full h-full'>
          <h3  className='mt-8 mb-8'>Nothing available</h3>
          <p className='mt-8 mb-2'>You might want to refine your search</p>
          <div className='w-full mb-80'><Search /></div>
          </div>
          
                  )}
      </div>
      <PostModal ref={modalRef} post={selectedPost} onClose={handleCloseModal} />
    </div>
  );
};

export default SearchResult;
