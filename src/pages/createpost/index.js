import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

function CreatePost() {
    const { data: session } = useSession;
    const router = useRouter();
    useEffect(() => {
        if (!session) {
            router.push('/')
            //for now redirect to homescreen, later should redirect to sign in page
        }
    })
    return (
        <div className='flex justify-center'>
            <div className='p-6 mt-8 lg:w-[35%] md:w-[100%]'>

            </div>
        </div>
    )
}

export default CreatePost 