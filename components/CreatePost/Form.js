import React from 'react'
import Data from '../../shared/Data'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';

function Form() {
    const [inputs, setInputs] = useState({});
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session) {
            setInputs((values) => ({ ...values, userName: session.user.name }));
            setInputs((values) => ({ ...values, userImage: session.user.image }));
            setInputs((values) => ({ ...values, email: session.user.email }));
        }
    }, [session, status]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("OnSubmit", inputs);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder='Title'
                    required
                    className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
                />

                <textarea
                    name="desc"
                    placeholder='Write Description Here'
                    required
                    className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
                />
                <input
                    type="date"
                    name="Date of the Event"
                    required
                    onChange={handleChange}
                    placeholder='Select Date'
                    className='w-full mb-4 border-[1px] p-2 rounded-md'
                />
                <input
                    type="text"
                    name="Location"
                    placeholder='Location of The Event'
                    required
                    onChange={handleChange}
                    className="w-full mb-4 border-[1px] p-2 rounded-md"
                />

                <input
                    type="text"
                    placeholder='Post code'
                    name="Post code"
                    required
                    onChange={handleChange}
                    className="w-full mb-4 border-[1px] p-2 rounded-md"
                />
                <select
                    name="game"
                    onChange={handleChange}
                    required
                    className="w-full mb-4 border-[1px] p-2 rounded-md"
                >
                    <option disabled defaultValue>
                        Select Sport
                    </option>
                    {Data.SportList.map((item) => (
                        <option key={item.id}>{item.name}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 w-full p-1 rounded-md text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Form
