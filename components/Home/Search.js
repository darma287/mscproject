import React, { useState } from 'react';
import { useRouter } from 'next/router';

function Search() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const onSearchButtonClick = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/searchResult?query=${searchText}`);
    }
  }

  return (
    <form className="max-w-md mx-auto" onSubmit={onSearchButtonClick}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input 
          type="search" 
          onChange={(e) => setSearchText(e.target.value)} 
          id="default-search" 
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500" 
          placeholder="Search Football, Basketball, Volleyball..." 
          required 
        />
        <button 
          type="submit" 
          className="text-white absolute right-2.5 bottom-2.5 bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default Search;
