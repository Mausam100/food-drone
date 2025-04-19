import React from "react";

const PointOverlay = ({ onClose, heading }) => {
  return (
    <div className="absolute sm:top-[50%]  md:top-[50%] md:right-40 md:-translate-y-[50%] flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-center text-2xl text-yellow-500 font-bold mb-6">
          {heading}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <div className="w-full py-2 text-white text-center uppercase tracking-wider">
              AI-POWERED DRONE NAVIGATION
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full py-2 text-white text-center uppercase tracking-wider">
              3D WEB EXPERIENCE
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full py-2 text-white text-center uppercase tracking-wider">
              ULTRA-FAST DISPATCH
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full py-2 text-white text-center uppercase tracking-wider">
              END-TO-END SECURITY
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md uppercase font-semibold tracking-wider transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointOverlay;
