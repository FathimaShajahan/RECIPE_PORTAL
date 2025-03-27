import React from "react";
import Navbar from "./Navbar";

const Landing = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/heacurry.avif')",
        width: "100vw",  // Full width
        height: "100vh", // Full height of the viewport
        backgroundSize: "cover", // Ensures the image covers the entire div
        backgroundPosition: "center", // Centers the image
      }}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50 p-6">
       
      </div>
    </div>
  );
};

export default Landing;
