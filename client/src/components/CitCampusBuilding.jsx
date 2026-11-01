import React, { useState } from 'react';
import './CitCampusBuilding.css';

/**
 * CitCampusBuilding
 * Real-life photorealistic architectural photograph background of the Chilika Institute
 * of Technology (CIT) heritage main college campus building, featuring the central dome,
 * stately neoclassical columns, grand portico with engraved "CHILIKA INSTITUTE OF TECHNOLOGY",
 * "CIT" crest, and coastal palm trees.
 */
export function CitCampusBuilding({ className = '', style = {} }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`cit-real-building-wrapper ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Real-Life Campus Photograph */}
      {!imageError ? (
        <div className="cit-photo-container">
          <img
            src="/cit_campus_heritage.jpg"
            alt="Chilika Institute of Technology Heritage Main Campus Building"
            className="cit-real-photo"
            onError={() => setImageError(true)}
          />
          {/* Subtle Warm Vignette & Palette Wash */}
          <div className="cit-photo-overlay" />
          <div className="cit-photo-glow" />
        </div>
      ) : (
        /* Stylized Architectural Realism Fallback */
        <div className="cit-photo-fallback">
          <div className="cit-photo-overlay fallback-active" />
        </div>
      )}
    </div>
  );
}

export default CitCampusBuilding;
