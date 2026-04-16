import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CrazyTransition.css';

export default function CrazyTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState('idle'); // idle, exiting, entering
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionState('exiting');
      setAnimationClass('smooth-exit');
    }
  }, [location, displayLocation.pathname]);

  const handleAnimationEnd = (e) => {
    const animName = e.animationName;
    if (animName.includes('Out') || animName.includes('Exit')) {
      setDisplayLocation(location);
      setTransitionState('entering');
      setAnimationClass('smooth-enter');
    } else if (animName.includes('In') || animName.includes('Enter')) {
      setTransitionState('idle');
      setAnimationClass('');
    }
  };

  return (
    <>
      <div className="transition-backdrop" />
      <div 
        className={`crazy-page-wrapper ${animationClass}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="crazy-page-content">
          {transitionState === 'exiting' ? (
            <React.Fragment key={displayLocation.pathname}>
              {React.cloneElement(children, { location: displayLocation })}
            </React.Fragment>
          ) : (
            <React.Fragment key={location.pathname}>
              {React.cloneElement(children, { location: location })}
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  );
}
