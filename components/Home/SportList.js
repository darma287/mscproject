import React, { useEffect } from 'react'
import Data from '../../shared/Data'
import { useState } from 'react';
import Image from 'next/image';
function SportList() {
  const [games, setGames] = useState([]); // Initialize with an empty array

  useEffect(() => {
    setGames(Data.SportList || []); // Ensure Data.SportList is not undefined
  }, []);

  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 mt-4'>
        {games.map((item, index) => (
          <div key={index} className='flex flex-col items-center cursor-pointer'>
            <Image src={item.image} width={45} height={45} className='hover:animate-bounce transition-all duration-150' alt='sporttype'/>
            <h2 className='text-[14px] text-center'>{item.name}</h2>
          </div>
        ))}
    </div>
  );
}

export default SportList;
