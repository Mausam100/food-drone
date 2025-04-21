import React, { useEffect, useState } from "react";

const EndOverlay = ({ onRestart }) => {
  const [fullScreen, setFullScreen] = useState(true);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#1e1e1e]/95 flex items-center justify-center z-50 p-4">
      <div className="relative flex flex-col md:flex-row items-center md:items-start w-full max-w-4xl">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="flex flex-row justify-start items-start">
            <div>
              <div className="flex items-center justify-center md:justify-start mb-2 md:mb-4">
                <span className="text-[#11982A] font-mono text-3xl md:text-5xl font-bold mr-2 tracking-widest">
                  MISSION
                </span>
                <span className="text-white text-3xl md:text-5xl font-bold tracking-widest">
                  COMPLETE
                </span>
              </div>
              <div className="mb-6">
                <p className="uppercase text-base md:text-lg tracking-wide text-gray-100 leading-relaxed">
                  YOU HAVE SUCCESSFULLY COMPLETED THE
                  <br />
                  MISSION AND EXPERIENCED THE FUTURE OF
                  <br />
                  FOOD DELIVERY.
                </p>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0 flex justify-center items-start">
              <img
                src="/drone.png"
                alt="Drone"
                className="w-48 md:w-64 h-auto drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="bg-[#152418]/40 rounded-md px-4 py-3 mb-8 w-full border border-black">
            <p className="text-[#ACACAC] text-xs md:text-sm font-mono tracking-wide leading-8">
              OUR DEVELOPERS AND DESIGNERS HAVE POURED THEIR HEARTS INTO
              BRINGING THIS VISION OF FUTURE DRONE DELIVERY TO LIFE. IF YOU
              ENJOYED THE EXPERIENCE, SUPPORT US BY FOLLOWING THE PROJECT ON
              GITHUB – YOUR FEEDBACK AND LOVE MEAN THE WORLD.{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>
            </p>
          </div>
          <div className="flex w-full gap-6 justify-around">
            <div
              className="relative cursor-pointer"
              style={{ width: 140, height: 44 }}
              onClick={() => {
                toggleFullScreen();
                onRestart();
              }}
            >
              <img src="/button.svg" alt="Replay" className="w-full h-full" />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase font-bold text-sm tracking-wider text-white"
                style={{ color: "#fff" }}
              >
                REPLAY
              </span>
            </div>
            <a
              href="https://github.com/Mausam100/food-drone"
              target="_blank"
              className="relative cursor-pointer"
              style={{ width: 140, height: 44 }}
            >
              <img src="/button.svg" alt="Github" className="w-full h-full" />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase font-bold text-sm tracking-wider"
                style={{ color: "#fff" }}
              >
                GITHUB
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndOverlay;
