"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => setVisible(false);

    if (document.readyState === "complete") {
      handleLoad();
      return;
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="loading-screen fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[min(560px,90vw)] text-center">
        <h1 className="loading-title mt-3 text-3xl font-semibold text-white">
          Welcome to my Portfolio Website
        </h1>
        <div className="mt-4 flex justify-center">
          <div className="intro-logo-wrap">
            <video
              className="intro-logo intro-logo--dark intro-logo--blend w-[32rem] max-w-full"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/assets/video/LogoIntroD.mp4" type="video/mp4" />
            </video>
            <video
              className="intro-logo intro-logo--light intro-logo--blend w-[32rem] max-w-full"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/assets/video/LogoIntroL.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
