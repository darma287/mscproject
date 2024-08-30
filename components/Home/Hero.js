import React from 'react';
import Image from 'next/image';
import Search from '../../components/Home/Search';
import SportList from './SportList';

function Hero() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero.jpg"
                    alt="Hero Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
            </div>
            <div className="relative z-10 max-w-[800px] text-center text-white p-4">
                <h1 className="text-wrapper">Find Your Mate and Start Your Game</h1>
                <p className="mt-4 text-xl">Join us and discover sport games around you</p>
                <div className="mt-8 w-full flex flex-col items-center">
                    <div className="w-full max-w-lg">
                        <Search />
                    </div>
                    <div className="mt-4 w-full max-w-lg">
                        <SportList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
