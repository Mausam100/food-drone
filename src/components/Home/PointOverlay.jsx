import React from "react";

const PointOverlay = ({ onClose, heading, span, description, description2, description3 }) => {
  return (
    <div className="absolute sm:bottom-5  md:left-[50%]  md:-translate-x-[50%] flex items-center justify-center z-30 w-[90%]   my-auto">
      <div className="rounded-xl overflow-hidden w-fit ">
        <div className="flex items-center p-2 bg-[#202023] rounde">
          <span className="text-[#FF6A00] text-xl font-bold mr-2">
            {span}
          </span>
          <h2 className="text-xl text-white font-bold">
            {heading}
          </h2>
        </div>

        <div className={`flex ${!description2 && !description3 ? "justify-center" : "justify-between"} bg-[#2d2d30] items-center gap-10 p-5`}>
          <p className="text-white text-sm font-bold ">
            {description}
          </p>
          <p className="text-white text-sm font-bold">
            {description2}
          </p>
          <p className="text-white text-sm font-bold">
            {description3}
          </p>
        </div>
        <div className="flex justify-center">
      
        </div>
      </div>
    </div>
  );
};

export default PointOverlay;
