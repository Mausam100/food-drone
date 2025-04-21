import { useState, useEffect } from 'react';

// Function to handle the start of the game
export const handleStart = (setShowStartOverlay) => {
  // Hide the start overlay
  setShowStartOverlay(false);

  // Request fullscreen mode when the game starts
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  }
};

// Function to handle reaching the end of the game
export const handleReachEnd = (setPoint1Reached, setPoint2Reached, setPoint3Reached, setShowEndOverlay) => {
  // Reset all points and show the end overlay
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);
  setShowEndOverlay(true);
};

// Function to handle restarting the game
export const handleRestart = (setShowEndOverlay, setRestartTrigger, setShowStartOverlay) => {
  // Hide the end overlay and toggle the restart trigger
  setShowEndOverlay(false);
  setRestartTrigger((prev) => !prev); // Toggle restart trigger to reset the drone

  // Show the start overlay again
  setShowStartOverlay(true);
};

// Function to handle reaching Point 1
export const handlePoint1Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  // Mark Point 1 as reached and reset others
  setPoint1Reached(true);
  setPoint2Reached(false);
  setPoint3Reached(false);
};

// Function to handle reaching Point 2
export const handlePoint2Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  // Mark Point 2 as reached and reset others
  setPoint1Reached(false);
  setPoint2Reached(true);
  setPoint3Reached(false);
};

// Function to handle reaching Point 3
export const handlePoint3Reached = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  // Mark Point 3 as reached and reset others
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(true);
};

// Custom hook to reset a point after a timeout
export const usePointTimeout = (pointReached, setPointReached) => {
  useEffect(() => {
    // If the point is not reached, do nothing
    if (!pointReached) return;

    // Set a timeout to reset the point after 20 seconds
    const timeout = setTimeout(() => {
      setPointReached(false);
    }, 20000);

    // Clear the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timeout);
  }, [pointReached, setPointReached]);
};

// Function to handle closing a point overlay
export const handlePointClose = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  // Reset all points
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);
};

// Function to handle clearing all checkpoints
export const handleCheckpointsCleared = (setPoint1Reached, setPoint2Reached, setPoint3Reached) => {
  // Reset all points
  setPoint1Reached(false);
  setPoint2Reached(false);
  setPoint3Reached(false);

  // The message will be shown through the existing overlay system
};