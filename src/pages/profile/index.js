import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import app from '../../../shared/FirebaseConfig';
import { useState } from 'react';
import PostItem from '../../../components/Home/PostItem';

function Profile() {
    const { data: session } = useSession();
    const [userPost, setUserPost] = useState([]);
    const db = getFirestore(app);

    useEffect(() => {
        if (session) {
            getUserPost();
        }
    }, [session]);

    const getUserPost = async () => {
        if (session?.user?.email) {
            const q = query(collection(db, 'post'), where('email', '==', session.user.email));
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            setUserPost(posts);
        }
    };

    return (
        <div className='p-6 mt-8 lg:w-[35%] md:w-[100%]'>
            <h2 className='text-[30-px] font-extrabold text-blue-500'>Profile</h2>
            <p>Manage your posts</p>
            <div>
                {userPost && userPost.map((item, index) => (
                    <PostItem key={index} post={item} />
                ))}
            </div>
        </div>
    );
}

export default Profile;