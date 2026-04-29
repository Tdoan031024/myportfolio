"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10131f]">
      <div className="w-[min(560px,90vw)] text-center">
        <div className="flex items-center justify-center gap-4">
          {["</>", "{}", "<>"].map((logo) => (
            <div
              key={logo}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/80"
            >
              {logo}
            </div>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Welcome to my Portfolio Website
        </h1>
      </div>
    </div>
  );
}
