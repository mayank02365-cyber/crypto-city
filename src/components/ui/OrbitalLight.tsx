import React from 'react';

interface OrbitalLightProps {
  children?: React.ReactNode;
  className?: string;
}

export const OrbitalLight: React.FC<OrbitalLightProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Orbital Perimeter Path Light Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] z-10">
        {/* Continuous GPU-Accelerated Blue Light Orb */}
        <div className="orbital-light-runner">
          {/* Layer 1: Concentrated Core Light */}
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#60A5FA] z-20" />
          
          {/* Layer 2: Soft Inner Cyan-Blue Glow */}
          <div className="absolute -inset-2 rounded-full bg-accent/80 blur-md z-10" />

          {/* Layer 3: Broad Ambient Top Illumination */}
          <div className="absolute -top-10 -bottom-10 -left-16 -right-16 rounded-full bg-gradient-to-r from-accent/0 via-accent/35 to-accent-dark/0 blur-xl opacity-75" />
        </div>
      </div>

      {/* Render Wrapped Content (Navbar / Top Header) */}
      {children}
    </div>
  );
};
