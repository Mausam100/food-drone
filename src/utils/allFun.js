import { useState, useEffect } from 'react';


export const handleStart = (setShowStartOverlay) => {
  setShowStartOverlay(false);
  // Request fullscreen when game starts
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  }
};

export const handleReachEnd = (setPoint1Reached, setPoint2Reached, setPoint3Reached, setShowEndOverlay) => {
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);
  setShowEndOverlay(true);
};

export const handleRestart = (setShowEndOverlay, setRestartTrigger, setShowStartOverlay) => {
  setShowEndOverlay(false);
  setRestartTrigger((prev) => !prev); // Toggle restart trigger to reset the drone
  setShowStartOverlay(true); // Show the start overlay again
};

export const handlePoint1Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  setPoint1Reached(true);
  setPoint2Reached(false);
  setPoint3Reached(false);
};

export const handlePoint2Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  setPoint1Reached(false);
  setPoint2Reached(true);
  setPoint3Reached(false);
};

export const handlePoint3Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(true);
};

export const usePointTimeout = (pointReached, setPointReached) => {
  useEffect(() => {
    if (!pointReached) return;
    
    const timeout = setTimeout(() => {
      setPointReached(false);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [pointReached, setPointReached]);
};

export const handlePointClose = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);
};

export const handleCheckpointsCleared = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);
  // The message will be shown through the existing overlay system
};