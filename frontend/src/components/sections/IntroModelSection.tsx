"use client";

import HeroThree from "@/components/HeroThree";

export default function IntroModelSection() {
  return (
    <section
      id="intro-3d"
      className="relative z-50 flex min-h-screen items-center justify-center overflow-visible pb-24"
    >
      <div className="relative z-50 flex w-full flex-col items-center overflow-visible">
        <div className="relative z-50 h-[160vh] w-full overflow-visible rounded-none bg-transparent -mb-96">
          <HeroThree
            className="relative z-50 h-full w-full overflow-visible"
            introZoom
            enableControls
            enableInteraction
            enableFloat={false}
            initialCameraPosition={{ x: 1.35, y: 1.85, z: 2.4 }}
            initialTarget={{ x: 0, y: 1.05, z: 0 }}
            initialModelRotationY={Math.PI * -0.567}
            modelOffset={{ x: 0.4, y: 1.5 }}
            modelUrl="/assets/models/room_IT_3d.glb"
          />
        </div>
      </div>
    </section>
  );
}
