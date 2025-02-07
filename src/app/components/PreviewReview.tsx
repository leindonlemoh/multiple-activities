import React from 'react'

const PreviewReview = () => {
  return (
    <div>
         <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src="https://via.placeholder.com/400x300.png?text=Food+Image"
        alt="Food"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">Delicious Burger</h2>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500 text-sm">⭐⭐⭐⭐</span>
          <span className="text-gray-600 text-sm ml-2">(4.5/5)</span>
        </div>
        <p className="text-gray-600 mt-2 text-sm">
          This burger is absolutely amazing! The patty is juicy, and the toppings are fresh. A must-try for all burger lovers!
        </p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
          Read Full Review
        </button>
      </div>
    </div>
    </div>
  )
}

export default PreviewReview