import { collection, getDocs, getFirestore, query, where, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import app from '../../../shared/FirebaseConfig';
import PostItem from '../../../components/Home/PostItem';
import Posts from '../../../components/Home/Posts';

function Profile() {
    const { data: session } = useSession();
    const [userPost, setUserPost] = useState([]);
    const [joinedPosts, setJoinedPosts] = useState([]); // State for joined posts
    const db = getFirestore(app);

    useEffect(() => {
        if (session) {
            getUserPost();
            getJoinedPosts(); // Fetch joined posts
        }
    }, [session]);

    const getUserPost = async () => {
        if (session?.user?.email) {
            const q = query(collection(db, 'post'), where('email', '==', session.user.email));
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id; // Include the id in the post data
                posts.push(data); // Push the post data including the id
            });
            setUserPost(posts);
        }
    };

    const getJoinedPosts = async () => { // Function to fetch joined posts
        if (session?.user?.email) {
            const q = query(collection(db, 'joinedPosts'), where('userEmail', '==', session.user.email));
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id; // Include the id in the post data
                posts.push(data); // Push the post data including the id
            });
            setJoinedPosts(posts); // Set the state with the joined posts
        }
    };

    const onDeletePost = async (id) => {
        console.log(id); // Log the id of the post to be deleted
        await deleteDoc(doc(db, "post", id)); // Delete the document with the specified id
        setUserPost(userPost.filter(post => post.id !== id)); // Update the state to remove the deleted post
    };

    const onJoinPost = async (post) => { // Function to join a post
        console.log("onJoinPost called with post:", post);
        if (session?.user?.email) {
            const joinedPost = { ...post, userEmail: session.user.email }; // Add user email to the joined post
            await setDoc(doc(db, "joinedPosts", `${post.id}-${session.user.email}`), joinedPost); // Add joined post to Firestore
            setJoinedPosts([...joinedPosts, joinedPost]); // Update the state to include the new joined post
        }
    };

    console.log("Profile onJoinPost:", onJoinPost);

    return (
        <div className='p-6 mt-8 lg:w-[35%] md:w-[100%]'>
            <h2 className='text-[30-px] font-extrabold text-blue-500'>Profile</h2>
            <p>Manage your posts</p>
            <div className="p-5 sm:px-7 md:px-10">
                <h3>Your Posts</h3> {/* Section for user's own posts */}
                {userPost && userPost.map((item, index) => (
                    <div key={index}>
                        <PostItem post={item} />
                        <button onClick={() => onDeletePost(item.id)}>Delete</button>
                    </div>
                ))}
                <h3>Joined Sports</h3> {/* Section for joined posts */}
                {joinedPosts && joinedPosts.map((item, index) => (
                    <div key={index}>
                        <PostItem post={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
