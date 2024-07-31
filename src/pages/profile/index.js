import { collection, getDocs, getFirestore, query, doc, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import app from '../../../shared/FirebaseConfig';
import PostItem from '../../../components/Home/PostItem';
import { deleteDoc } from 'firebase/firestore';

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
                let data = doc.data();
                data.id = doc.id; // Include the id in the post data
                posts.push(data); // Push the post data including the id
            });
            setUserPost(posts);
        }
    };

    const onDeletePost =async (id) => {
        console.log(id);
        await deleteDoc(doc(db,"post",id))
        setUserPost(userPost.filter(post => post.id !== id));
    }

    return (
        <div className='p-6 mt-8 lg:w-[35%] md:w-[100%]'>
            <h2 className='text-[30-px] font-extrabold text-blue-500'>Profile</h2>
            <p>Manage your posts</p>
            <div className="p-5 sm:px-7 md:px-10">
                {userPost && userPost.map((item, index) => (
                    <div key={index}>
                        <PostItem post={item} />
                        <button onClick={() => onDeletePost(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
