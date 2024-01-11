import React from "react";

function ErrorPage () {
  return (
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <img
                src="https://illustrations.popsy.co/sky/crashed-error.svg"
                alt="404 Error Illustration"
                className="mx-auto mb-8 w-64 md:w-96"
                />
                <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-4">404 Not Found</h1>
                <p className="text-gray-700 text-lg mb-4">The page you are looking for might be under maintenance or doesn`&apos;`t exist.</p>
                <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  window.history.back();
                }}
                >
                Go Back
                </button>
            </div>
            </div>
        </>
  );
}

export default ErrorPage;
