import React from 'react';

interface AdFrameProps {
  src: string;
}

const AdFrame: React.FC<AdFrameProps> = ({ src }) => {
  return (
    <iframe
      className="adsbox ads ad adsbox doubleclick ad-placement carbon-ads"
      src={src}
      style={{ position: 'absolute', visibility: 'hidden', zIndex: -9999 }}
      title="Advertisement"
      aria-label="Advertisement frame"
      role="complementary"
    />
  );
};

export default AdFrame; 