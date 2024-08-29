import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import app from '../../shared/FirebaseConfig';
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Data from '../../shared/Data';

const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false });

function Form() {
  const [inputs, setInputs] = useState({});
  const { data: session, status } = useSession();
  const db = getFirestore(app);
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      setInputs((values) => ({ ...values, userName: session.user.name, userImage: session.user.image, email: session.user.email }));
    }
  }, [session, status]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    const eventDate = new Date(inputs["Date"]);
    const timestamp = Timestamp.fromDate(eventDate);

    const updatedInputs = { ...inputs, "Date": timestamp, "Location": location ? location.name : '' };

    const storage = getStorage();
    const storageRef = ref(storage, `sportapp/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      updatedInputs.image = url;

      await setDoc(doc(db, "post", Date.now().toString()), updatedInputs);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <section>
          <h2 className="text-3xl font-semibold text-primary-700 mb-4">Game Details</h2>
          <h4 className="text-lg text-forGrey-800 mb-4">Write the details of your Game</h4>

          <div className="mb-4">
            <label htmlFor="title" className="block text-primary-700 mb-1">Game Title</label>
            <input
              type="text"
              id="title"
              name="Title"
              placeholder="e.g., Sunday Football Match"
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 outline-primary-400 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-primary-700 mb-1">Game Description</label>
            <textarea
              id="description"
              name="Description"
              placeholder="e.g., Join us for a friendly football match..."
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 outline-primary-400 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-primary-700 mb-1">Date and Time</label>
            <input
              type="datetime-local"
              id="date"
              name="Date"
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="playersNeeded" className="block text-primary-700 mb-1">Number of Players Needed</label>
            <input 
              type="number"
              id="playersNeeded"
              name="PlayersNeeded"
              placeholder="e.g., 10"
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-primary-700 mb-1">Fee Per Person</label>
            <input 
              type="number"
              id="price"
              name="Price"
              placeholder="e.g., 5"
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-primary-700 mb-1">City</label>
            <input
              type="text"
              id="city"
              name="City"
              placeholder="e.g., New York"
              required
              onChange={handleChange}
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sport" className="block text-primary-700 mb-1">Sport</label>
            <select
              id="sport"
              name="Sport"
              onChange={handleChange}
              required
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            >
              <option value="" disabled selected>Select Sport</option>
              {Data.SportList.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary-700 mb-4">Select Game Location</h2>
          <div className="mb-4">
            <DynamicMap setLocation={setLocation} location={location} />
          </div>
          {location && (
            <div>
              <p className="text-primary-700">Selected Location:</p>
              <p>{location.name}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary-700 mb-4">Game Image</h2>
          <div className="mb-4">
            <label htmlFor="image" className="block text-primary-700 mb-1">Upload Image</label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              accept="image/gif, image/jpeg, image/png"
              className="w-full border-[1px] p-2 rounded-md hover:border-primary-100"
            />
          </div>
        </section>

        <button
          type="submit"
          className="bg-primary-500 w-full p-2 rounded-md text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
