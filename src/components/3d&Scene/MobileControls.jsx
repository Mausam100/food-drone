import React, { useEffect, useState } from 'react';

export function MobileControls({ touchControls, setTouchControls, isFirstPerson, setIsFirstPerson }) {
  const [showRotateOverlay, setShowRotateOverlay] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

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

  const handleJoystickStart = (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setJoystickCenter({ x: centerX, y: centerY });
    
    const x = e.touches[0].clientX - centerX;
    const y = e.touches[0].clientY - centerY;
    setJoystickPosition({ x, y });
    
    setTouchControls(prev => ({
      ...prev,
      joystick: { active: true, x, y }
    }));
  };

  const handleJoystickMove = (e) => {
    e.preventDefault();
    const x = e.touches[0].clientX - joystickCenter.x;
    const y = e.touches[0].clientY - joystickCenter.y;
    
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 60; // Maximum distance the joystick can move
    
    // Normalize if outside the max distance
    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      const normalizedX = Math.cos(angle) * maxDistance;
      const normalizedY = Math.sin(angle) * maxDistance;
      setJoystickPosition({ x: normalizedX, y: normalizedY });
      setTouchControls(prev => ({
        ...prev,
        joystick: { active: true, x: normalizedX, y: normalizedY }
      }));
    } else {
      setJoystickPosition({ x, y });
      setTouchControls(prev => ({
        ...prev,
        joystick: { active: true, x, y }
      }));
    }
  };

  const handleJoystickEnd = (e) => {
    e.preventDefault();
    setJoystickPosition({ x: 0, y: 0 });
    setTouchControls(prev => ({
      ...prev,
      joystick: { active: false, x: 0, y: 0 }
    }));
  };

  const handleFirstPersonToggle = () => {
    setIsFirstPerson(!isFirstPerson);
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
        {/* Joystick */}
        <div
          className="fixed bottom-[min(5vw,30px)] left-[min(5vw,30px)] w-[min(25vw,120px)] h-[min(25vw,120px)] bg-[#2a2a72] bg-opacity-80 rounded-full backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 transition-all duration-300 ease-out pointer-events-auto"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          {/* Joystick background */}
          <div className="absolute inset-0 rounded-full bg-[#2a2a72] bg-opacity-50" />
          
          {/* Joystick thumb */}
          <div 
            className="absolute left-1/2 top-1/2 w-[min(8vw,40px)] h-[min(8vw,40px)] bg-[#00c3ae] bg-opacity-90 rounded-full transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30 transition-transform duration-100"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
              opacity: touchControls.joystick.active ? 1 : 0.7
            }}
          />
          
          {/* Direction indicators */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 border-t-2 border-l-2 border-white border-opacity-30 rounded-tl-full" />
          </div>
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
          className={`pointer-events-auto fixed top-4 right-4 px-4 py-2 ${
            isFirstPerson ? 'bg-[#004a41]' : 'bg-[#00c3ae]'
          } text-white rounded-full shadow-md text-sm font-medium transition-colors duration-200`}
          onClick={handleFirstPersonToggle}
        >
          {isFirstPerson ? '🎥 FP ON' : '🎥 FP OFF'}
        </button>
      </div>
    </>
  );
}
