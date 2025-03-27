
import React from 'react';

interface HomeButtonControlProps {
  createHomeButton: (controlDiv: HTMLDivElement) => void;
}

const HomeButtonControl: React.FC<HomeButtonControlProps> = ({ createHomeButton }) => {
  const controlRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (controlRef.current) {
      createHomeButton(controlRef.current);
    }
  }, [createHomeButton]);

  return <div ref={controlRef} />;
};

export default HomeButtonControl;
