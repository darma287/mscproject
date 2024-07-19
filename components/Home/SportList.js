import React, { useEffect } from 'react'
import Data from '../../shared/Data'

function SportList() {
  const [game,setGames]=useState();
  useEffect(()=>{
    setGames(Data.SportList)
  },[])
  return (
    <div>
        Sport
    </div>
  )
}

export default SportList