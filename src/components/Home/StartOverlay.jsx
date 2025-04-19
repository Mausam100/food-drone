import React, { useEffect, useState } from "react";

const StartOverlay = ({ onStart }) => {
  const [controlsStep, setControlsStep] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  const handleLearnControls = () => {
    setControlsStep(1);
  };

  const handleContinue = () => {
    setControlsStep(2);
  };

  const handleLetsGo = () => {
    setControlsStep(0);
    onStart();
  };
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
  if (controlsStep === 0) {
    return (
      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            WELCOME TO <span className="text-orange-500">NEXDROP</span>
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-12">
          <p className="uppercase text-lg md:text-xl tracking-wide leading-relaxed">
            STEP INTO THE PILOT'S SEAT
            <br />
            OF YOUR OWN DELIVERY
            <br />
            DRONE. EXPLORE AN OPEN
            <br />
            WORLD, COMPLETE MISSIONS,
            <br />
            AND EXPERIENCE THE FUTURE
            <br />
            OF DELIVERY TODAY.
          </p>
        </div>

        <div className="flex gap-6">
          <div
            className="relative cursor-pointer"
            typeof="button"
            onClick={handleLearnControls}
          >
            <img src="/button.svg" width={220} />
            <h2 className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              LEARN CONTROLS
            </h2>
          </div>

          <div
            className="relative cursor-pointer"
            typeof="button"
            onClick={() => {
            
                toggleFullScreen();
              
              onStart();
            }}
          >
            <img src="/button.svg" width={220} />
            <h2 className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]" >
              FLY DRONE
            </h2>
          </div>
        </div>
      </div>
    );
  }
  if (controlsStep === 1) {
    return (
      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            CONTROLS TO FLY <span className="text-orange-500">DRONE</span>
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-8">
          <p className="uppercase text-lg tracking-wide leading-relaxed mb-8">
            USE W,A,S,D TO MOVE THE DRONE AND ARROW
            <br />
            KEYS TO CONTROL CAMERA DIRECTION.
            <br />
            FORWARD, BACKWARD, LEFT, RIGHT, SPACE TO
            <br />
            CONTROL CAMERA VIEW.
          </p>
        </div>

        <div className="w-full flex justify-around items-center">
          <img
            src="/wasd-controls.png"
            alt="WASD Controls"
            className="w-[25%] h-auto"
          />
          <div
            className="relative cursor-pointer"
            typeof="button"
            onClick={handleContinue}
          >
            <img src="/button.svg" width={220} />
            <h2 className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              CONTINUE
            </h2>
          </div>
          <img
            src="/arrow-controls.png"
            alt="Arrow Controls"
            className="w-[25%] h-auto"
          />
        </div>
      </div>
    );
  }

  if (controlsStep === 2) {
    return (
      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">MISSION</span> DELIVER THE PACKAGE
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-12">
          <ul className="uppercase text-lg tracking-wide leading-relaxed space-y-6">
            <li>• FLY THROUGH EACH GLOWING CHECKPOINT.</li>
            <li>
              • STAY ON THE PATH TO REACH{" "}
              <span className="text-orange-500">THE DELIVERY ZONE</span>.
            </li>
            <li>• MISSED ONE? TURN BACK AND COLLECT IT.</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <div
            className="relative cursor-pointer"
            typeof="button"
            onClick={handleLetsGo}
          >
            <img src="/button.svg" width={220} />
            <h2 className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              LET'S GO
            </h2>
          </div>
        </div>
      </div>
    );
  }
};

export default StartOverlay;
