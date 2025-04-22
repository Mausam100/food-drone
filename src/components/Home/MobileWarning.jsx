import React from 'react';

export default function MobileWarning({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full border border-[#00c3ae]/20 shadow-lg shadow-[#00c3ae]/10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Mobile Experience Notice</h2>
          <p className="text-gray-300 mb-4">
            For the best experience, we recommend using a desktop device. The mobile version has limited features and may not perform optimally.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="bg-[#00c3ae] hover:bg-[#00a895] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Continue Anyway
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 