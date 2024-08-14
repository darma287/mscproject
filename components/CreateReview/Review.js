import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import app from '../../shared/FirebaseConfig';
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function Review() {
  const [reviewText, setReviewText] = useState("");
  const { data: session, status } = useSession();
  const db = getFirestore(app);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    // Set file state when a file is selected
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
    };

    if (file) {
      const storage = getStorage();
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
      // Write the review to the 'Review' collection in Firestore
      await setDoc(doc(db, "Review", Date.now().toString()), reviewData);
      // Optionally, you can reset the form here after successful submission
      setReviewText("");
      setFile(null);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Review Input Section */}
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

        {/* Image Upload Section */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary-500 w-full p-2 rounded-md text-white"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default Review;
