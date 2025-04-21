import React from "react";

const RotateOverlay = ({ toggleFullScreen, lockOrientation }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white/10 border border-white/20 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center max-w-sm w-full">
        <div className="mb-2">
          <span className="text-2xl md:text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
            Rotate Device
          </span>
        </div>
        <div className="mb-4">
          <img
            src="/rotate-phone.gif"
            alt="Rotate Device"
            className="w-35 block md:hidden h-auto"
          />
        </div>
        <div className="mb-6">
          <p className="text-base md:text-lg text-gray-200 font-medium text-center">
            For the best experience, please rotate your phone to{" "}
            <span className="text-[#00c3ae] font-bold">landscape</span> mode.
          </p>
        </div>
        <button
          onClick={() => {
            toggleFullScreen();
            lockOrientation();
          }}
          className="relative w-48 h-12 flex items-center justify-center group"
        >
          <img
            src="/button.svg"
            alt="Enter Fullscreen"
            className="absolute inset-0 w-full h-full"
          />
          <span className="relative z-10 uppercase font-semibold text-white tracking-wider text-base group-hover:text-[#00c3ae] transition-colors">
            Enter Fullscreen
          </span>
        </button>
      </div>
    </div>
  );
};

export default RotateOverlay;
