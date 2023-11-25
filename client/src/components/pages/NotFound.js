// client\src\components\pages\NotFound.js
import React from "react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          404 - Page Not Found
        </h1>
        <p className="text-center text-gray-500 mt-2">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
