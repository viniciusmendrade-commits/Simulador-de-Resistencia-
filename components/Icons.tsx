import React from 'react';

export const TsunamiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} role="img" aria-label="Tsunami">ꪆৎ</span>
);

export const HurricaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} role="img" aria-label="Furacão">༄</span>
);

export const EarthquakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} role="img" aria-label="Terremoto">ᨒ</span>
);
