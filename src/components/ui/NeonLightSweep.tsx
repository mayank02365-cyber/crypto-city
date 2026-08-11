import React from 'react';

interface NeonLightSweepProps {
  children?: React.ReactNode;
  className?: string;
}

export const NeonLightSweep: React.FC<NeonLightSweepProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Top Edge Ambient Blue Light Sweep Layer */}
      <div className="absolute -top-6 left-0 right-0 h-16 pointer-events-none overflow-hidden z-0">
        {/* Continuous Horizontal Light Sweep Beam */}
        <div className="neon-sweep-beam-container">
          {/* Main Elongated Electric Blue Ambient Beam */}
          <div className="neon-sweep-beam" />
          {/* Trailing Soft Ambient Illumination */}
          <div className="neon-sweep-trail" />
        </div>
      </div>

      {/* Navbar Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
