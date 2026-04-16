import React, { useState } from 'react';
import { ONBOARDING_SLIDES } from '../utils/constants';
import useStore from '../store/useStore';
import './Onboarding.css';

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useStore();
  const slide = ONBOARDING_SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  return (
    <div className="onboarding" id="onboarding-screen">
      <div className="onboarding-header">
        <button className="skip-btn" onClick={completeOnboarding}>
          Skip
        </button>
      </div>

      <div className="onboarding-content" key={currentSlide}>
        <div
          className="onboarding-illustration animate-scale-in"
          style={{ background: `${slide.color}15`, color: slide.color }}
        >
          {slide.icon}
        </div>
        <h2 className="onboarding-title animate-fade-in-up">{slide.title}</h2>
        <p className="onboarding-description animate-fade-in-up delay-1">
          {slide.description}
        </p>
      </div>

      <div className="onboarding-dots">
        {ONBOARDING_SLIDES.map((_, i) => (
          <div
            key={i}
            className={`onboarding-dot ${i === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="onboarding-actions">
        {currentSlide > 0 && (
          <button className="btn btn-outline btn-lg" onClick={handleBack}>
            Back
          </button>
        )}
        <button className="btn btn-primary btn-lg" onClick={handleNext} id="onboarding-next-btn">
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
