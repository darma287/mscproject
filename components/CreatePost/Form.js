import React from 'react'
import Data from '../../shared/Data'
import { useSession } from 'next-auth/react'

function Form() {
  return (
    <div>
        <input
        type="text"
        name="title"
        placeholder='Title'
        required
        className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
        />

<textarea
        type="text"
        name="title"
        placeholder='Write Description Here'
        required
        className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
        />
    </div>
  )
}

export default Form