import React, { forwardRef, useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineMapPin } from 'react-icons/hi2';
import Image from 'next/image';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../../shared/FirebaseConfig';

const PostModal = forwardRef(({ post, onClose }, ref) => {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 180 });
    const [reviews, setReviews] = useState([]); 

    useEffect(() => {
        if (post?.image) {
            const img = new window.Image();
            img.src = post.image;
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                setImageDimensions({ width: aspectRatio * 180, height: 180 });
            };
        }
    }, [post?.image]);

    useEffect(() => {
        const fetchReviews = async () => {
            const db = getFirestore(app);
            const reviewsRef = collection(db, 'Review');
            const q = query(reviewsRef, where('organizer', '==', post?.email));
            const querySnapshot = await getDocs(q);
            const fetchedReviews = [];
            querySnapshot.forEach((doc) => {
                fetchedReviews.push(doc.data());
            });
            setReviews(fetchedReviews);
        };

        if (post?.email) {
            fetchReviews();
        }
    }, [post?.email]);

    const hasTitle = post?.Title && post.Title.trim() !== "";
    const hasDescription = post?.Description && post.Description.trim() !== "";

    const formatDate = (timestamp) => {
        if (!timestamp) return 'No Date';
        let date;
        if (typeof timestamp.toDate === 'function') {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const generateGoogleMapsUrl = (location) => {
        const query = encodeURIComponent(location);
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyCOeAyDR1G61zzk6LpzDU0d_ZLaQDK3b8M&q=${query}`;
    };

    return (
        <dialog ref={ref} id="my_modal_3" className="modal p-0 rounded-lg">
            {post && (
                <div className="modal-box">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                    <div className="bg-white border border-gray-200 rounded-lg shadow" style={{ width: '800px' }}>
                        {post.image && imageDimensions.width > 0 ? (
                            <div className="relative w-full h-[180px]">
                                <Image
                                    className="rounded-t-lg object-cover"
                                    src={post.image}
                                    alt="Post image"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        ) : (
                            <div className="rounded-t-lg bg-gray-200 h-48 flex items-center justify-center">Loading image...</div>
                        )}
                        <div className="p-5 flex flex-col justify-between h-full">
                            <div>
                                {hasTitle ? (
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary">{post.Title}</h5>
                                ) : (
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary">No Title</h5>
                                )}
                                <div className="flex items-center text-accent gap-2 mb-2">
                                    <HiOutlineCalendar className="text-[20px]" />
                                    {formatDate(post.Date)}
                                </div>
                                <div className="flex items-center text-accent gap-2 mb-2">
                                    <HiOutlineMapPin className="text-[20px]" />
                                    {post.Location || 'No Location'} <div></div>
                                    {post.PostCode || ' '}
                                </div>
                                {hasDescription ? (
                                    <p className="mb-3 font-normal text-gray-700">{post.Description}</p>
                                ) : (
                                    <p className="mb-3 font-normal text-gray-700">No Description</p>
                                )}
                                <div className="flex items-center text-accent gap-2 mb-2">
                                    <p>Price (in Pounds): {post.Price || 'No Price'}</p>
                                </div>
                                <div className="flex items-center text-accent gap-2 mb-2">
                                    <p>Players Needed: {post.PlayersNeeded || 'No Players Needed'}</p>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold">Organizer</h3>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            className="rounded-full"
                                            src={post.userImage}
                                            alt="Organizer image"
                                            width={50}
                                            height={50}
                                            objectFit="cover"
                                        />
                                        <div>
                                            <p className="text-lg font-medium text-gray-700">{post.userName || 'No Name'}</p>
                                            <p className="text-sm text-gray-500">{post.email || 'No Email'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold">Reviews</h3>
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <div key={index} className="mb-4 p-4 rounded-s-sm shadow-sm">
                                                <p className="text-gray-700">{review.text}</p>
                                                <p className="text-sm text-gray-500">By: {review.userName}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-700">No Reviews Yet</p>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold">Map Location</h3>
                                    {post.Location ? (
                                        <iframe
                                            src={generateGoogleMapsUrl(post.Location)}
                                            width="100%"
                                            height="300"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Map Location"
                                        ></iframe>
                                    ) : (
                                        <p className="text-gray-700">No Location Available</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-primary-500 border border-primary-500 rounded-lg focus:ring-4 focus:outline-none hover:bg-primary-100 focus:ring-primary-200"
                                    onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </dialog>
    );
});

PostModal.displayName = 'PostModal';

export default PostModal;