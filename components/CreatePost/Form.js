import React from 'react';
import Data from '../../shared/Data';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import app from '../../shared/FirebaseConfig';
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function Form() {
    const [inputs, setInputs] = useState({});
    const { data: session, status } = useSession();
    const db = getFirestore(app);
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log("File selected:", e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            console.error("No file selected");
            return;
        }

        const eventDate = new Date(inputs["Date"]);
        const timestamp = Timestamp.fromDate(eventDate);

        const updatedInputs = { ...inputs, "Date": timestamp };

        console.log("OnSubmit inputs:", updatedInputs);

        const storage = getStorage();
        const storageRef = ref(storage, `sportapp/${file.name}`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            console.log('Uploaded a blob or file!', snapshot);

            const url = await getDownloadURL(storageRef);
            console.log('File available at', url);

            updatedInputs.image = url;

            await setDoc(doc(db, "post", Date.now().toString()), updatedInputs);
            console.log('Document successfully written!', updatedInputs);
        } catch (error) {
            console.error("Error writing document: ", error);
        }
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
                    type="number"
                    name="PlayersNeeded"
                    required
                    onChange={handleChange}
                    placeholder='Select Date and Time'
                    className='w-full mb-4 border-[1px] p-2 rounded-md'
                />
                <input 
                    type="number"
                    name="Price"
                    required
                    onChange={handleChange}
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
                    name="PostCode"
                    required
                    onChange={handleChange}
                    className="w-full mb-4 border-[1px] p-2 rounded-md"
                />
                <select
                    name="Sport"
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
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/gif, image/jpeg, image/png"
                    className='mb-5 border-[1px] w-full'
                />
                <button
                    type="submit"
                    className="bg-blue-500 w-full p-1 rounded-md text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Form;
