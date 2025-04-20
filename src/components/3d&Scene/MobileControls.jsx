import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';

// Constants
const JOYSTICK_SIZE = 'min(30vw,150px)';
const JOYSTICK_THUMB_SIZE = 'min(10vw,50px)';
const BUTTON_SIZE = 'min(12vw,60px)';
const BUTTON_POSITION = 'min(8vw,50px)';
const BUTTON_GAP = 'min(10vw,70px)';

// Memoized base styles
const baseStyles = {
  joystick: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    bottom: BUTTON_POSITION,
    left: BUTTON_POSITION,
    boxShadow: '0 0 20px rgba(0, 195, 174, 0.3)',
  },
  joystickThumb: {
    width: JOYSTICK_THUMB_SIZE,
    height: JOYSTICK_THUMB_SIZE,
    transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
    boxShadow: '0 0 15px rgba(0, 195, 174, 0.5)',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    bottom: BUTTON_POSITION,
    fontSize: 'min(6vw,30px)',
    transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
    boxShadow: '0 0 15px rgba(0, 195, 174, 0.3)',
  },
  rotateButton: {
    right: `calc(${BUTTON_POSITION} + ${BUTTON_GAP})`,
  },
  rotateRightButton: {
    right: BUTTON_POSITION,
  },
  upButton: {
    right: `calc(${BUTTON_POSITION} + ${BUTTON_GAP} * 2)`,
    bottom: `calc(${BUTTON_POSITION} + ${BUTTON_GAP})`,
  },
  downButton: {
    right: `calc(${BUTTON_POSITION} + ${BUTTON_GAP} * 2)`,
    bottom: BUTTON_POSITION,
  },
  firstPersonButton: {
    top: BUTTON_POSITION,
    right: BUTTON_POSITION,
    padding: 'min(2vw,10px) min(4vw,20px)',
    fontSize: 'min(4vw,20px)',
    boxShadow: '0 0 15px rgba(0, 195, 174, 0.3)',
  },
};

export function MobileControls({ touchControls, setTouchControls, isFirstPerson, setIsFirstPerson }) {
  const [showRotateOverlay, setShowRotateOverlay] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const touchTimeout = useRef(null);
  const joystickRef = useRef(null);

  // Add fullscreen functionality
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Try different methods for different browsers
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, []);

  // Handle orientation lock
  const lockOrientation = useCallback(() => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        console.log('Orientation lock not supported');
      });
    }
  }, []);

  // Memoized dynamic styles
  const styles = useMemo(() => ({
    joystick: {
      ...baseStyles.joystick,
      transform: isTouching ? 'scale(1.1)' : 'scale(1)',
    },
    joystickThumb: {
      ...baseStyles.joystickThumb,
      transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
      opacity: touchControls.joystick.active ? 1 : 0.7,
    },
    button: baseStyles.button,
    rotateButton: baseStyles.rotateButton,
    rotateRightButton: baseStyles.rotateRightButton,
    upButton: baseStyles.upButton,
    downButton: baseStyles.downButton,
    firstPersonButton: baseStyles.firstPersonButton,
  }), [joystickPosition, touchControls.joystick.active, isTouching]);

  // Memoized handlers
  const handleTouch = useCallback((control, value) => {
    setTouchControls((prev) => ({
      ...prev,
      [control]: value,
    }));
    setIsTouching(value);
  }, [setTouchControls]);

  const handleJoystickStart = useCallback((e) => {
    const rect = joystickRef.current.getBoundingClientRect();
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
    setIsTouching(true);
  }, [setTouchControls]);

  const handleJoystickMove = useCallback((e) => {
    const x = e.touches[0].clientX - joystickCenter.x;
    const y = e.touches[0].clientY - joystickCenter.y;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 60;
    
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
  }, [joystickCenter, setTouchControls]);

  const handleJoystickEnd = useCallback((e) => {
    setJoystickPosition({ x: 0, y: 0 });
    setTouchControls(prev => ({
      ...prev,
      joystick: { active: false, x: 0, y: 0 }
    }));
    setIsTouching(false);
  }, [setTouchControls]);

  // Add touch event listeners with proper options
  useEffect(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;

    const options = { passive: false };

    const startHandler = (e) => {
      e.preventDefault();
      handleJoystickStart(e);
    };

    const moveHandler = (e) => {
      e.preventDefault();
      handleJoystickMove(e);
    };

    const endHandler = (e) => {
      e.preventDefault();
      handleJoystickEnd(e);
    };

    joystick.addEventListener('touchstart', startHandler, options);
    joystick.addEventListener('touchmove', moveHandler, options);
    joystick.addEventListener('touchend', endHandler, options);

    return () => {
      joystick.removeEventListener('touchstart', startHandler, options);
      joystick.removeEventListener('touchmove', moveHandler, options);
      joystick.removeEventListener('touchend', endHandler, options);
    };
  }, [handleJoystickStart, handleJoystickMove, handleJoystickEnd]);

  const handleFirstPersonToggle = useCallback(() => {
    setIsFirstPerson(!isFirstPerson);
  }, [isFirstPerson, setIsFirstPerson]);

  // Orientation check with debounce
  useEffect(() => {
    const checkOrientation = () => {
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
      touchTimeout.current = setTimeout(() => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        setShowRotateOverlay(isPortrait);
      }, 100);
    };

    checkOrientation();
    window.addEventListener("orientationchange", checkOrientation);
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("orientationchange", checkOrientation);
      window.removeEventListener("resize", checkOrientation);
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {/* ROTATE PHONE OVERLAY */}
      {showRotateOverlay && (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-90 text-white flex items-center justify-center text-center text-xl font-semibold p-4 pointer-events-auto">
          <div className="animate-pulse">
            <p>🔄</p>
            <p>📱 Please rotate your phone to landscape</p>
            <button 
              onClick={() => {
                toggleFullScreen();
                lockOrientation();
              }}
              className="mt-4 px-6 py-2 bg-[#00c3ae] rounded-lg text-white font-medium hover:bg-[#004a41] transition-colors"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* TOUCH CONTROLS */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Joystick */}
        <div
          ref={joystickRef}
          className="fixed bg-[#2a2a72] bg-opacity-80 rounded-full backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 transition-all duration-300 ease-out pointer-events-auto"
          style={styles.joystick}
        >
          {/* Joystick background */}
          <div className="absolute inset-0 rounded-full bg-[#2a2a72] bg-opacity-50" />
          
          {/* Joystick thumb */}
          <div 
            className="absolute left-1/2 top-1/2 bg-[#00c3ae] bg-opacity-90 rounded-full transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30 transition-transform duration-100"
            style={styles.joystickThumb}
          />
        </div>

        {/* ROTATE LEFT BUTTON */}
        <button
          className="pointer-events-auto fixed bg-[#00c3ae] bg-opacity-80 rounded-full text-white font-bold shadow-md border border-white/50 active:scale-95 active:opacity-70 hover:bg-opacity-90 transition-all duration-200"
          style={{ ...styles.button, ...styles.rotateButton }}
          onTouchStart={() => handleTouch("rotateLeft", true)}
          onTouchEnd={() => handleTouch("rotateLeft", false)}
        >
          ⟲
        </button>

        {/* ROTATE RIGHT BUTTON */}
        <button
          className="pointer-events-auto fixed bg-[#00c3ae] bg-opacity-80 rounded-full text-white font-bold shadow-md border border-white/50 active:scale-95 active:opacity-70 hover:bg-opacity-90 transition-all duration-200"
          style={{ ...styles.button, ...styles.rotateRightButton }}
          onTouchStart={() => handleTouch("rotateRight", true)}
          onTouchEnd={() => handleTouch("rotateRight", false)}
        >
          ⟳
        </button>

        {/* ASCEND BUTTON */}
        <button
          className="pointer-events-auto fixed bg-[#00c3ae] bg-opacity-80 rounded-full text-white font-bold shadow-md border border-white/50 active:scale-95 active:opacity-70 hover:bg-opacity-90 transition-all duration-200"
          style={{ ...styles.button, ...styles.upButton }}
          onTouchStart={() => handleTouch("up", true)}
          onTouchEnd={() => handleTouch("up", false)}
        >
          ↑
        </button>

        {/* DESCEND BUTTON */}
        <button
          className="pointer-events-auto fixed bg-[#00c3ae] bg-opacity-80 rounded-full text-white font-bold shadow-md border border-white/50 active:scale-95 active:opacity-70 hover:bg-opacity-90 transition-all duration-200"
          style={{ ...styles.button, ...styles.downButton }}
          onTouchStart={() => handleTouch("down", true)}
          onTouchEnd={() => handleTouch("down", false)}
        >
          ↓
        </button>

        {/* FIRST PERSON TOGGLE */}
        <button
          className={`pointer-events-auto fixed ${
            isFirstPerson ? 'bg-[#004a41]' : 'bg-[#00c3ae]'
          } text-white rounded-full shadow-md font-medium transition-all duration-200 active:scale-95 active:opacity-70 hover:bg-opacity-90`}
          style={styles.firstPersonButton}
          onClick={handleFirstPersonToggle}
        >
          {isFirstPerson ? '🎥 FP ON' : '🎥 FP OFF'}
        </button>
      </div>
    </>
  );
}
