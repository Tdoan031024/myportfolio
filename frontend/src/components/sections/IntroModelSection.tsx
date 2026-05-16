"use client";

import dynamic from "next/dynamic";

const HeroThree = dynamic(() => import("@/components/HeroThree"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-[36px] glass" aria-hidden="true" />
  ),
});

export default function IntroModelSection() {
  return (
    <section
      id="intro-3d"
      className="relative z-50 flex min-h-screen items-center justify-center overflow-visible pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(82,245,255,0.22),transparent_65%)] blur-3xl" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,106,224,0.2),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(184,255,122,0.18),transparent_70%)] blur-3xl" />
      </div>

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
