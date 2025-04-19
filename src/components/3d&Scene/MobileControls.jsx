import React, { useEffect, useState } from 'react';

export function MobileControls({ touchControls, setTouchControls }) {
  const [showRotateOverlay, setShowRotateOverlay] = useState(false);

  // Orientation check
  useEffect(() => {
    const checkOrientation = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setShowRotateOverlay(true);
      } else {
        setShowRotateOverlay(false);
      }
    };

    checkOrientation();
    window.addEventListener("orientationchange", checkOrientation);
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("orientationchange", checkOrientation);
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const handleTouch = (control, value) => {
    setTouchControls((prev) => ({
      ...prev,
      [control]: value,
    }));
  };

  return (
    <>
      {/* ROTATE PHONE OVERLAY */}
      {showRotateOverlay && (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-80 text-white flex items-center justify-center text-center text-xl font-semibold p-4 pointer-events-auto">
          📱 Please rotate your phone to landscape for better experience
        </div>
      )}

      {/* TOUCH CONTROLS */}
      <div className="fixed inset-0 pointer-events-none z-[1000]">
        {/* Joystick placeholder area (shows only when active) */}
        <div
          className={`fixed bottom-[min(5vw,30px)] left-[min(5vw,30px)] w-[min(25vw,120px)] h-[min(25vw,120px)] bg-[#2a2a72] bg-opacity-80 rounded-full ${
            touchControls.joystick.active ? 'block' : 'hidden'
          } backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 transition-all duration-300 ease-out pointer-events-auto`}
        >
          <div className="absolute left-1/2 top-1/2 w-[min(8vw,40px)] h-[min(8vw,40px)] bg-[#00c3ae] bg-opacity-80 rounded-full transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30"></div>
        </div>

        {/* ROTATE LEFT BUTTON */}
        <button
          className="pointer-events-auto fixed right-[80px] bottom-[min(5vw,30px)] w-[50px] h-[50px] bg-[#00c3ae] bg-opacity-80 rounded-full text-white text-lg font-bold shadow-md border border-white/50"
          onTouchStart={() => handleTouch("rotateLeft", true)}
          onTouchEnd={() => handleTouch("rotateLeft", false)}
        >
          ⟲
        </button>

        {/* ROTATE RIGHT BUTTON */}
        <button
          className="pointer-events-auto fixed right-[20px] bottom-[min(5vw,30px)] w-[50px] h-[50px] bg-[#00c3ae] bg-opacity-80 rounded-full text-white text-lg font-bold shadow-md border border-white/50"
          onTouchStart={() => handleTouch("rotateRight", true)}
          onTouchEnd={() => handleTouch("rotateRight", false)}
        >
          ⟳
        </button>

        {/* ASCEND BUTTON */}
        <button
          className="pointer-events-auto fixed right-[20px] bottom-[100px] w-[50px] h-[50px] bg-[#00c3ae] bg-opacity-80 rounded-full text-white text-xl font-bold shadow-md border border-white/50"
          onTouchStart={() => handleTouch("up", true)}
          onTouchEnd={() => handleTouch("up", false)}
        >
          ↑
        </button>

        {/* DESCEND BUTTON */}
        <button
          className="pointer-events-auto fixed right-[20px] bottom-[160px] w-[50px] h-[50px] bg-[#00c3ae] bg-opacity-80 rounded-full text-white text-xl font-bold shadow-md border border-white/50"
          onTouchStart={() => handleTouch("down", true)}
          onTouchEnd={() => handleTouch("down", false)}
        >
          ↓
        </button>

        {/* FIRST PERSON TOGGLE */}
        <button
          className="pointer-events-auto fixed top-4 right-4 px-4 py-2 bg-[#00c3ae] text-white rounded-full shadow-md text-sm font-medium"
          onClick={() => {
            const keyboardEvent = new KeyboardEvent("keydown", { key: "f" });
            window.dispatchEvent(keyboardEvent);
          }}
        >
          🎥 FP
        </button>
      </div>
    </>
  );
}
