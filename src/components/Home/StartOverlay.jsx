import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useState, useRef } from "react";
import RotateOverlay from "./RotateOverlay";

const StartOverlay = ({ onStart }) => {
  const [controlsStep, setControlsStep] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [showRotateOverlay, setShowRotateOverlay] = useState(false);
  const touchTimeout = useRef(null);

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

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const lockOrientation = async () => {
    try {
      await screen.orientation.lock("landscape");
    } catch (error) {
      console.error("Orientation lock failed:", error);
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

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".NEXDROP", {
      opacity: 0,
      scale: 0,
      duration: 1,
      stagger: 0.2,
    });
    tl.from(".NEXDROP_P p", {
      opacity: 0,
      scale: 0,
      duration: 1,
      stagger: 0.2,
    });
  });

  useGSAP(() => {
    if (controlsStep === 1) {
      const tl = gsap.timeline();
      tl.from(".LEARNCONTROLS", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
      });
      tl.from(".LEARNCONTROLS_P p", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
      });
      tl.from(".LEARNCONTROLS_IMG", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
      });
    }
    if (controlsStep === 2) {
      const tl = gsap.timeline();
      tl.from(".MISSION_DELIVER_THE_PACKAGE", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
      });
      tl.from(".MISSION_DELIVER_THE_PACKAGE_UL li", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
      });
    }
  }, [controlsStep]);

  if (showRotateOverlay) {
    return (
      <RotateOverlay
        toggleFullScreen={toggleFullScreen}
        lockOrientation={lockOrientation}
      />
    );
  }

  if (controlsStep === 0) {
    return (
      <div className="page-overlay1 absolute w-full h-screen inset-0 p-6 font-mono bg-black flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 NEXDROP">
            WELCOME TO <span className="text-orange-500">NEXDROP</span>
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-12 ">
          <div className="NEXDROP_P uppercase text-lg md:text-xl tracking-wide leading-relaxed">
            <p>STEP INTO THE PILOT'S SEAT</p>

            <p>OF YOUR OWN DELIVERY</p>

            <p>DRONE. EXPLORE AN OPEN</p>

            <p>WORLD, COMPLETE MISSIONS,</p>

            <p>AND EXPERIENCE THE FUTURE</p>

            <p>OF DELIVERY TODAY.</p>
          </div>
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
        </div>
      </div>
    );
  }
  if (controlsStep === 1) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 LEARNCONTROLS">
            CONTROLS TO FLY <span className="text-orange-500">DRONE</span>
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-8">
          <div className="uppercase text-lg tracking-wide leading-relaxed mb-8 LEARNCONTROLS_P">
            <p>USE W,A,S,D TO MOVE THE DRONE AND ARROW</p>

            <p>KEYS TO CONTROL CAMERA DIRECTION.</p>

            <p>FORWARD, BACKWARD, LEFT, RIGHT, SPACE TO</p>

            <p>CONTROL CAMERA VIEW.</p>
          </div>
        </div>

        <div className="w-full flex justify-around items-center">
          <img
            src="/showcontrolsStep.svg"
            alt="WASD Controls"
            className="w-[25%] h-auto LEARNCONTROLS_IMG"
          />
          <img
            src="/f_key.svg"
            alt="WASD Controls"
            className="w-[10%] absolute top-[70%] left-[50%] -translate-x-[50%] -translate-y-[50%] LEARNCONTROLS_IMG"
          />
          <div
            className="relative cursor-pointer lg:-bottom-30"
            typeof="button"
            onClick={handleContinue}
          >
            <img src="/button.svg" width={220} />
            <h2 className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              CONTINUE
            </h2>
          </div>
          <img
            src="/arrow-controls.svg"
            alt="Arrow Controls"
            className="w-[25%] h-auto LEARNCONTROLS_IMG"
          />
        </div>
      </div>
    );
  }

  if (controlsStep === 2) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 text-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 MISSION_DELIVER_THE_PACKAGE">
            <span className="text-orange-500">MISSION</span> DELIVER THE PACKAGE
          </h1>
        </div>

        <div className="max-w-2xl text-center mb-12">
          <ul className="uppercase text-lg tracking-wide leading-relaxed space-y-6 MISSION_DELIVER_THE_PACKAGE_UL">
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
