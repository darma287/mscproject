import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Form from '../../../components/CreatePost/Form';

function CreatePost() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (status === "loading") return; 
        if (!session) {
            router.push('/')
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>; 
    }

    return (
        <div className='flex justify-center'>
            <div className='p-6 mt-8 lg:w-[35%] md:w-[100%]'>
                <Form />
            </div>
        </div>
    )
}

export default CreatePost
