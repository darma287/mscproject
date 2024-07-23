import Image from 'next/image';
import React from 'react';
import { HiMiniPencilSquare } from "react-icons/hi2";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router';

const USER_IMAGE = 'https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png';

function Header() {
    const router=useRouter();
    const { data: session, status } = useSession();
    console.log("Session", session);

    return (
        <div>
            <div className='flex justify-between p-2 border-b-[2px]'>
                <Image src="/logoipsum.png" alt="Logo" width={150} height={40} />
                <div className='flex gap-4 items-center'>
                    <button onClick={()=>router.push('/createpost')} className="bg-black p-2 px-3 text-white rounded-full h-12">
                        <span className='hidden sm:block'>Create Post</span>
                        <HiMiniPencilSquare className='sm:hidden text-[20px]' />
                    </button>
                    {status === 'unauthenticated' ? (
                        <button 
                            className="bg-white text-red-500 p-2 px-3 border-[1px] rounded-full h-12"
                            onClick={() => signIn()}
                        >
                            <span className='hidden sm:block'>Sign In</span>
                            <HiOutlineArrowLeftOnRectangle className='sm:hidden text-[20px]' />
                        </button>
                    ) : (
                        <button 
                            className="bg-white text-red-500 p-2 px-3 border-[1px] rounded-full h-12"
                            onClick={() => signOut()}
                        >
                            <span className='hidden sm:block'>Sign Out</span>
                            <HiOutlineArrowLeftOnRectangle className='sm:hidden text-[20px]' />
                        </button>
                    )}
                    <Image src={session?session?.user?.image:USER_IMAGE} width={40} height={40} alt="User Profile" className='rounded-full' />
                </div>
            </div>
        </div>
    );
}

export default Header;
