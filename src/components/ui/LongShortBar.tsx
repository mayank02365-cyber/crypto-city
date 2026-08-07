import React from 'react';

export interface LongShortBarProps {
  longPercentage?: number;
  shortPercentage?: number;
  longVolume?: string;
  shortVolume?: string;
}

export const LongShortBar: React.FC<LongShortBarProps> = ({
  longPercentage = 64.5,
  shortPercentage = 35.5,
  longVolume = '$1.84B',
  shortVolume = '$1.01B',
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-positive flex items-center gap-1 font-mono">
          <span className="w-2 h-2 rounded-full bg-positive inline-block" /> Long {longPercentage}%
          {longVolume && <span className="text-text-muted text-[10px]">({longVolume})</span>}
        </span>
        <span className="text-text-muted text-[11px] uppercase font-bold tracking-wider">Position Ratio</span>
        <span className="text-negative flex items-center gap-1 font-mono">
          {shortVolume && <span className="text-text-muted text-[10px]">({shortVolume})</span>}
          Short {shortPercentage}% <span className="w-2 h-2 rounded-full bg-negative inline-block" />
        </span>
      </div>

      <div className="h-2.5 w-full bg-bg-secondary rounded-full overflow-hidden flex p-0.5 border border-border">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-positive rounded-l-full transition-all duration-500"
          style={{ width: `${longPercentage}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-negative rounded-r-full transition-all duration-500"
          style={{ width: `${shortPercentage}%` }}
        />
      </div>
    </div>
  );
};
