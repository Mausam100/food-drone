import React, { useEffect, useState } from "react";

const EndOverlay = ({ onRestart, message }) => {
  const [fullScreen, setFullScreen] = useState  (true);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullScreen(false);
      }
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <h1 className="text-3xl font-bold mb-4 text-white">{message}</h1>
      <button
        onClick={() => {
          
            toggleFullScreen();
          
          onRestart();
        }}
        className="bg-[#00c3ae] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#004a41] transition-all duration-200"
      >
        Restart
      </button>
    </div>
  );
};

export default EndOverlay;
