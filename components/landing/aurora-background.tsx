"use client";

import { MeshGradient } from "@paper-design/shaders-react";

export function AuroraBackground() {
  return (
    <>
      {/* Sol diyagonal bant */}
      <div className="landing-aurora-band landing-aurora-band-left" aria-hidden>
        <MeshGradient
          width={1100}
          height={320}
          colors={["#5c42ff", "#3ecfff", "#9b50e8", "#6f59ff"]}
          distortion={1}
          swirl={0.12}
          grainMixer={0}
          grainOverlay={0}
          speed={0.28}
        />
      </div>

      {/* Sağ diyagonal bant */}
      <div className="landing-aurora-band landing-aurora-band-right" aria-hidden>
        <MeshGradient
          width={1100}
          height={320}
          colors={["#7b5cff", "#f27dbe", "#4ac8f0", "#5c42ff"]}
          distortion={0.95}
          swirl={0.1}
          grainMixer={0}
          grainOverlay={0}
          speed={0.24}
        />
      </div>

      <div className="landing-vignette" aria-hidden />
    </>
  );
}
