// client\src\components\pages\UnauthorizedAccess.js
import React from "react";

function UnauthorizedAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Unauthorized Access
        </h2>
        <p className="text-center text-gray-500 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}

export default UnauthorizedAccess;
