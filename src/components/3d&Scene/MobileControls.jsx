import React from 'react';

export function MobileControls({ touchControls }) {
  return (
    <div className="fixed w-full h-full pointer-events-none z-[1000]">
      {/* Joystick */}
      <div className={`fixed bottom-[min(5vw,30px)] left-[min(5vw,30px)] w-[min(25vw,120px)] h-[min(25vw,120px)] bg-[#2a2a72] bg-opacity-80 rounded-full ${touchControls.joystick.active ? 'block' : 'hidden'} backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 transition-all duration-300 ease-out`}>
        <div className="absolute left-1/2 top-1/2 w-[min(8vw,40px)] h-[min(8vw,40px)] bg-[#00c3ae] bg-opacity-80 rounded-full transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30 transition-transform duration-150 ease-out"
             style={{
               transform: `translate(${touchControls.joystick.x - window.innerWidth / 4}px, ${touchControls.joystick.y - window.innerHeight / 2}px) scale(${touchControls.joystick.active ? 1.1 : 1})`
             }} />
      </div>

      {/* Rotation buttons */}
      <div className="fixed bottom-[min(5vw,30px)] right-[min(5vw,30px)] w-[min(25vw,120px)] h-[min(12vw,60px)] flex justify-between items-center px-[min(2vw,10px)] bg-[#2a2a72] bg-opacity-80 rounded-[min(6vw,30px)] backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 transition-all duration-300 ease-out">
        <div className={`w-[min(10vw,50px)] h-[min(10vw,50px)] ${touchControls.rotateLeft ? 'bg-[#00c3ae] bg-opacity-80 scale-110' : 'bg-[#2a2a72] bg-opacity-80 scale-100'} rounded-full flex items-center justify-center text-[min(6vw,30px)] text-white transition-all duration-200 ease-out backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30`}>
          ←
        </div>
        <div className={`w-[min(10vw,50px)] h-[min(10vw,50px)] ${touchControls.rotateRight ? 'bg-[#00c3ae] bg-opacity-80 scale-110' : 'bg-[#2a2a72] bg-opacity-80 scale-100'} rounded-full flex items-center justify-center text-[min(6vw,30px)] text-white transition-all duration-200 ease-out backdrop-blur-sm border-2 border-white border-opacity-50 shadow-md shadow-[#00c3ae]/30`}>
          →
        </div>
      </div>

      {/* Center Info Display */}
      <div className="fixed top-[min(5vw,30px)] left-1/2 transform -translate-x-1/2 px-[min(4vw,20px)] py-[min(2vw,10px)] bg-[#2a2a72] bg-opacity-80 rounded-[min(6vw,30px)] backdrop-blur-sm border-2 border-[#00c3ae] border-opacity-50 shadow-lg shadow-[#00c3ae]/20 text-white text-[min(4vw,20px)] text-center transition-all duration-300 ease-out">
        Drone Controls
      </div>
    </div>
  );
} 