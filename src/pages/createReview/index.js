import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getFirestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import app from '../../../shared/FirebaseConfig';

function CreateReview() {
  const router = useRouter();
  const { postId, title, date, location, price, playersNeeded, image } = router.query;
  const [reviewText, setReviewText] = useState("");
  const [file, setFile] = useState(null);
  const { data: session } = useSession(); 
  const db = getFirestore(app);
  const [formattedDate, setFormattedDate] = useState('');
  const [organizer, setOrganizer] = useState(''); 

  useEffect(() => {
    if (date) {
      const postDate = new Date(parseInt(date)); 
      setFormattedDate(postDate.toLocaleDateString() + ' ' + postDate.toLocaleTimeString());
    }
  }, [date]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        const postDocRef = doc(db, 'joinedPosts', postId);
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();
          setOrganizer(postData.email); 
        } else {
          console.error('No such post!');
        }
      }
    };

    fetchPostData();
  }, [db, postId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText) {
      console.error("Review text is required");
      return;
    }

    const reviewData = {
      text: reviewText,
      date: Timestamp.now(),
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      userImage: session?.user?.image,
      postId: postId,  
      organizer: organizer,  
    };

    if (file) {
      const storage = getStorage(app); 
      const storageRef = ref(storage, `reviews/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        reviewData.image = url;
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }

    try {
      await setDoc(doc(db, "Review", Date.now().toString()), reviewData);
      setReviewText("");
      setFile(null);
      router.push('/thankyou'); 
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-primary-700 mb-4">Review the Post</h2>
      
      <div className="mb-6">
        {image && (
          <Image 
            src={image}
            alt="Post image"
            width={400}
            height={300}
            className="rounded-lg"
          />
        )}
        <h3 className="text-xl font-bold mt-4">{title}</h3>
        <p className="text-md text-gray-700">{formattedDate}</p>
        <p className="text-md text-gray-700">Location: {location}</p>
        <p className="text-md text-gray-700">Price: £{price}</p>
        <p className="text-md text-gray-700">Players Needed: {playersNeeded}</p>
        <p className="text-md text-gray-700">Organizer: {organizer}</p> 
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section>
          <h2 className="text-3xl font-semibold text-primary-700 mb-4">Submit Your Review</h2>
          <div className="mb-4">
            <label htmlFor="review" className="block text-primary-700 mb-1">Your Review</label>
            <textarea
              id="review"
              name="review"
              placeholder="Write your review here..."
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border-[1px] p-2 outline-primary-400 rounded-md hover:border-primary-100"
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary-700 mb-4">Upload an Image (Optional)</h2>
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
          Submit Review
        </button>
        <button
          type="cancel"
          className="w-full items-center px-3 py-2 text-sm font-medium text-center text-primary-500 border border-primary-500 rounded-lg focus:ring-4 focus:outline-none hover:bg-primary-100 focus:ring-primary-200"
          onClick={() => router.push('/profile')}>
          Cancel Writing
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
