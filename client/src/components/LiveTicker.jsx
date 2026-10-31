import React, { useState } from 'react';
import { Sparkles, Radio, Bell, ArrowRight, X } from 'lucide-react';
import { LIVE_CAMPUS_NOTICES } from '../services/mockData';
import './LiveTicker.css';

export function LiveTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const combinedText = LIVE_CAMPUS_NOTICES.join('   ✦   ');

  return (
    <div
      className="cit-live-ticker-wrap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="CIT Live Campus Announcements"
    >
      <div className="ticker-badge">
        <span className="ticker-pulse-dot" />
        <span className="ticker-badge-text">CIT LIVE</span>
      </div>

      <div className="ticker-track-container">
        {/* Moves from left to right as requested */}
        <div className={`ticker-marquee-track ${isPaused ? 'ticker-paused' : ''}`}>
          <span className="ticker-content-item">{combinedText}</span>
          <span className="ticker-content-item" aria-hidden="true">{combinedText}</span>
        </div>
      </div>

      <button
        type="button"
        className="ticker-close-btn"
        onClick={() => setIsVisible(false)}
        title="Dismiss announcement bar"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default LiveTicker;
