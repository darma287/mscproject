import React from 'react'
import Data from '../../shared/Data'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';
import app from '../../shared/FirebaseConfig';
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";


function Form() {
    const [inputs, setInputs] = useState({});
    const { data: session, status } = useSession();
    const db = getFirestore(app);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventDate = new Date(inputs["Date"]);
        const timestamp = Timestamp.fromDate(eventDate);

        const updatedInputs = { ...inputs, "Date": timestamp };

        console.log("OnSubmit", updatedInputs);
        await setDoc(doc(db, "post", Date.now().toString()), updatedInputs);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Title"
                    placeholder='Title'
                    required
                    onChange={handleChange}
                    className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
                />

                <textarea
                    name="Description"
                    placeholder='Write Description Here'
                    required
                    onChange={handleChange}
                    className='w-full mb-4 border-[1px] p-2 outline-blue-400 rounded-md'
                />
                <input
                    type="datetime-local"
                    name="Date"
                    required
                    onChange={handleChange}
                    placeholder='Select Date and Time'
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
                    name="sport"
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
