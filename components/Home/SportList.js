import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Data from '../../shared/Data';
import Image from 'next/image';

function SportList() {
  const [games, setGames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setGames(Data.SportList || []);
  }, []);

  const handleGameClick = (sportName) => {
    router.push(`/sportType?query=${sportName}`);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-4 p-4">
      {games.map((item, index) => (
        <div key={index} className='flex flex-col items-center cursor-pointer' onClick={() => handleGameClick(item.name)}>
          <Image src={item.image} width={45} height={45} className='hover:animate-bounce transition-all duration-150' alt='sporttype' />
          <h2 className='text-[14px] text-center'>{item.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default SportList;
