import React, { useState, useEffect } from 'react';

const DRONE_COLORS = [
  { name: 'Default', value: '#efcd54' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Orange', value: '#ffa500' },
];

export default function DroneCustomization({ onColorChange, onModelChange }) {
  const [selectedColor, setSelectedColor] = useState(DRONE_COLORS[0].value);
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    // Initialize with the default color when component mounts
    onColorChange(DRONE_COLORS[0].value);
  }, []);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <>
      <button
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        className="fixed z-[1001] text-sm top-4 right-4 bg-[#00c3b0b2] backdrop-blur-sm p-2 rounded-lg border shadow-lg shadow-[#00c3ae]/10 text-white  transition-colors"
      >
        {isPanelVisible ? 'Hide' : 'Show'} Customization
      </button>
      
      {isPanelVisible && (
        <div className="fixed z-[1000] top-16 right-4 bg-[#1a1a1a]/80 backdrop-blur-sm p-4 rounded-lg border border-[#00c3ae]/20 shadow-lg shadow-[#00c3ae]/10">
          <h3 className="text-white font-medium mb-3">Drone Customization</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-sm block mb-1">Color</label>
              <div className="flex gap-2">
                {DRONE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    className="w-6 h-6 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color.value)}
                  />
                ))}
                <button
                  className="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-white"
                  onClick={() => setShowCustomColor(!showCustomColor)}
                >
                  +
                </button>
              </div>
            </div>

            {showCustomColor && (
              <div className="mt-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 