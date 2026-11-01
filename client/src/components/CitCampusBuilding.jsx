import React from 'react';

/**
 * CitCampusBuilding
 * Detailed architectural SVG illustration of the Chilika Institute of Technology
 * heritage main academic building, inspired by the booklet cover sketch.
 * Features:
 * - Neoclassical grand entrance portico with columns
 * - Engraved entablature: "CHILIKA INSTITUTE OF TECHNOLOGY" & "CIT"
 * - Academic observatory dome with lantern & spire
 * - Left & right multi-level classroom wings
 * - Flanking coastal palm trees & landscaped grounds
 * - Booklet color palette: Terracotta, Ochre, Sage Green, Warm Stone, Espresso
 */
export function CitCampusBuilding({ className = '', style = {} }) {
  return (
    <div
      className={`cit-building-bg-wrapper ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="citSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f7f1e7" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#fdf8f0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#faf6ef" stopOpacity="0.98" />
          </linearGradient>

          {/* Dome Gradient */}
          <linearGradient id="citDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67917a" />
            <stop offset="50%" stopColor="#4e7561" />
            <stop offset="100%" stopColor="#3d5c4c" />
          </linearGradient>

          {/* Facade Wall Gradient */}
          <linearGradient id="citWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3ede1" />
            <stop offset="100%" stopColor="#e5ded0" />
          </linearGradient>

          {/* Shadow Gradient */}
          <linearGradient id="citPillarShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d3c7b3" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f3ede1" stopOpacity="0.3" />
          </linearGradient>

          {/* Window Glass Gradient */}
          <linearGradient id="citWindowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d9e6e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bacdc5" stopOpacity="0.6" />
          </linearGradient>

          {/* Terracotta Brand Accents */}
          <linearGradient id="citTerraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c54a26" />
            <stop offset="50%" stopColor="#db822a" />
            <stop offset="100%" stopColor="#c54a26" />
          </linearGradient>

          {/* Palm Frond Gradients */}
          <linearGradient id="citPalmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5f8872" />
            <stop offset="100%" stopColor="#3d5d4d" />
          </linearGradient>

          {/* Subtle Ground Wash */}
          <linearGradient id="citGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ded5c4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#faf6ef" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1600" height="900" fill="url(#citSkyGrad)" />

        {/* Subtle Architectural Sun Rays / Geometric Lines */}
        <g stroke="#db822a" strokeWidth="0.75" strokeOpacity="0.18">
          <line x1="800" y1="120" x2="100" y2="0" />
          <line x1="800" y1="120" x2="350" y2="0" />
          <line x1="800" y1="120" x2="600" y2="0" />
          <line x1="800" y1="120" x2="1000" y2="0" />
          <line x1="800" y1="120" x2="1250" y2="0" />
          <line x1="800" y1="120" x2="1500" y2="0" />
        </g>

        {/* ========================================================
            CENTRAL DOME & OBSERVATORY TOWER (Estd. 1988)
            ======================================================== */}
        <g id="citDomeAssembly">
          {/* Spire Mast & Flag */}
          <line x1="800" y1="55" x2="800" y2="125" stroke="#3a2216" strokeWidth="2.5" />
          {/* CIT Orange/Terracotta Pennant Flag */}
          <polygon points="800,58 834,70 800,82" fill="#c54a26" />
          <circle cx="800" cy="55" r="3.5" fill="#db822a" />

          {/* Lantern Cupola */}
          <rect x="782" y="125" width="36" height="26" fill="#f3ede1" stroke="#3a2216" strokeWidth="1.8" />
          <line x1="791" y1="125" x2="791" y2="151" stroke="#3a2216" strokeWidth="1.2" />
          <line x1="800" y1="125" x2="800" y2="151" stroke="#3a2216" strokeWidth="1.2" />
          <line x1="809" y1="125" x2="809" y2="151" stroke="#3a2216" strokeWidth="1.2" />
          {/* Lantern Dome Cap */}
          <path d="M778 125 C778 112 822 112 822 125 Z" fill="url(#citDomeGrad)" stroke="#3a2216" strokeWidth="1.5" />

          {/* Grand Neoclassical Copper Dome */}
          <path
            d="M690 260 C690 145 910 145 910 260 Z"
            fill="url(#citDomeGrad)"
            stroke="#3a2216"
            strokeWidth="2.4"
          />

          {/* Dome Copper Seams / Ribs */}
          <path d="M720 260 C732 185 770 152 795 151" stroke="#324c3e" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M755 260 C762 195 785 155 798 151" stroke="#324c3e" strokeWidth="1.5" fill="none" opacity="0.6" />
          <line x1="800" y1="151" x2="800" y2="260" stroke="#324c3e" strokeWidth="1.8" opacity="0.7" />
          <path d="M845 260 C838 195 815 155 802 151" stroke="#324c3e" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M880 260 C868 185 830 152 805 151" stroke="#324c3e" strokeWidth="1.5" fill="none" opacity="0.6" />

          {/* Dome Drum / Base with Round Arched Windows */}
          <rect x="675" y="260" width="250" height="48" fill="#ede5d6" stroke="#3a2216" strokeWidth="2" />
          {/* Drum Arch Windows */}
          <g fill="#d9e6e1" stroke="#3a2216" strokeWidth="1.2">
            <path d="M695 292 V276 C695 269 709 269 709 276 V292 Z" />
            <path d="M727 292 V276 C727 269 741 269 741 276 V292 Z" />
            <path d="M759 292 V276 C759 269 773 269 773 276 V292 Z" />
            <path d="M791 292 V276 C791 269 805 269 805 276 V292 Z" />
            <path d="M823 292 V276 C823 269 837 269 837 276 V292 Z" />
            <path d="M855 292 V276 C855 269 869 269 869 276 V292 Z" />
            <path d="M887 292 V276 C887 269 901 269 901 276 V292 Z" />
          </g>
          {/* Drum Moulding Cornice */}
          <line x1="665" y1="308" x2="935" y2="308" stroke="#3a2216" strokeWidth="2.5" />
        </g>

        {/* ========================================================
            BUILDING WINGS (LEFT & RIGHT MAIN BLOCKS)
            ======================================================== */}
        {/* Left Academic Wing (CSE / ECE / Research Block) */}
        <g id="citLeftWing">
          <rect x="180" y="320" width="370" height="340" fill="url(#citWallGrad)" stroke="#3a2216" strokeWidth="2" />
          {/* Roof Balustrade */}
          <rect x="170" y="306" width="390" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.8" />
          {/* Balusters */}
          <g stroke="#3a2216" strokeWidth="1">
            {[...Array(24)].map((_, i) => (
              <line key={`bal-l-${i}`} x1={180 + i * 16} y1={306} x2={180 + i * 16} y2={320} />
            ))}
          </g>

          {/* Stepped Upper Attic Level */}
          <rect x="220" y="270" width="280" height="36" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.8" />
          <text x="360" y="293" textAnchor="middle" fill="#54463d" fontSize="11" fontWeight="700" letterSpacing="2">
            RESEARCH &amp; COMPUTING TOWER
          </text>

          {/* Floor 3 Windows */}
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="210" y="340" width="55" height="60" />
            <rect x="280" y="340" width="55" height="60" />
            <rect x="350" y="340" width="55" height="60" />
            <rect x="420" y="340" width="55" height="60" />
            <rect x="485" y="340" width="50" height="60" />
          </g>
          {/* Window Panes Grid */}
          <g stroke="#3a2216" strokeWidth="0.8">
            <line x1="237" y1="340" x2="237" y2="400" /><line x1="210" y1="370" x2="265" y2="370" />
            <line x1="307" y1="340" x2="307" y2="400" /><line x1="280" y1="370" x2="335" y2="370" />
            <line x1="377" y1="340" x2="377" y2="400" /><line x1="350" y1="370" x2="405" y2="370" />
            <line x1="447" y1="340" x2="447" y2="400" /><line x1="420" y1="370" x2="475" y2="370" />
            <line x1="510" y1="340" x2="510" y2="400" /><line x1="485" y1="370" x2="535" y2="370" />
          </g>

          {/* Floor 2 Cornice */}
          <rect x="180" y="420" width="370" height="8" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.2" />

          {/* Floor 2 Windows */}
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="210" y="445" width="55" height="70" />
            <rect x="280" y="445" width="55" height="70" />
            <rect x="350" y="445" width="55" height="70" />
            <rect x="420" y="445" width="55" height="70" />
            <rect x="485" y="445" width="50" height="70" />
          </g>
          <g stroke="#3a2216" strokeWidth="0.8">
            <line x1="237" y1="445" x2="237" y2="515" /><line x1="210" y1="480" x2="265" y2="480" />
            <line x1="307" y1="445" x2="307" y2="515" /><line x1="280" y1="480" x2="335" y2="480" />
            <line x1="377" y1="445" x2="377" y2="515" /><line x1="350" y1="480" x2="405" y2="480" />
            <line x1="447" y1="445" x2="447" y2="515" /><line x1="420" y1="480" x2="475" y2="480" />
            <line x1="510" y1="445" x2="510" y2="515" /><line x1="485" y1="480" x2="535" y2="480" />
          </g>

          {/* Floor 1 Windows & Colonnade Lower Level */}
          <rect x="180" y="535" width="370" height="8" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.2" />
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="210" y="560" width="55" height="75" />
            <rect x="280" y="560" width="55" height="75" />
            <rect x="350" y="560" width="55" height="75" />
            <rect x="420" y="560" width="55" height="75" />
            <rect x="485" y="560" width="50" height="75" />
          </g>
        </g>

        {/* Right Academic Wing (Mechanical / Civil / Central Library) */}
        <g id="citRightWing">
          <rect x="1050" y="320" width="370" height="340" fill="url(#citWallGrad)" stroke="#3a2216" strokeWidth="2" />
          {/* Roof Balustrade */}
          <rect x="1040" y="306" width="390" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.8" />
          {/* Balusters */}
          <g stroke="#3a2216" strokeWidth="1">
            {[...Array(24)].map((_, i) => (
              <line key={`bal-r-${i}`} x1={1050 + i * 16} y1={306} x2={1050 + i * 16} y2={320} />
            ))}
          </g>

          {/* Stepped Upper Attic Level */}
          <rect x="1100" y="270" width="280" height="36" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.8" />
          <text x="1240" y="293" textAnchor="middle" fill="#54463d" fontSize="11" fontWeight="700" letterSpacing="2">
            CENTRAL DIGITAL ARCHIVE &amp; LABS
          </text>

          {/* Floor 3 Windows */}
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="1070" y="340" width="50" height="60" />
            <rect x="1135" y="340" width="55" height="60" />
            <rect x="1205" y="340" width="55" height="60" />
            <rect x="1275" y="340" width="55" height="60" />
            <rect x="1345" y="340" width="55" height="60" />
          </g>
          <g stroke="#3a2216" strokeWidth="0.8">
            <line x1="1095" y1="340" x2="1095" y2="400" /><line x1="1070" y1="370" x2="1120" y2="370" />
            <line x1="1162" y1="340" x2="1162" y2="400" /><line x1="1135" y1="370" x2="1190" y2="370" />
            <line x1="1232" y1="340" x2="1232" y2="400" /><line x1="1205" y1="370" x2="1260" y2="370" />
            <line x1="1302" y1="340" x2="1302" y2="400" /><line x1="1275" y1="370" x2="1330" y2="370" />
            <line x1="1372" y1="340" x2="1372" y2="400" /><line x1="1345" y1="370" x2="1400" y2="370" />
          </g>

          {/* Floor 2 Cornice */}
          <rect x="1050" y="420" width="370" height="8" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.2" />

          {/* Floor 2 Windows */}
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="1070" y="445" width="50" height="70" />
            <rect x="1135" y="445" width="55" height="70" />
            <rect x="1205" y="445" width="55" height="70" />
            <rect x="1275" y="445" width="55" height="70" />
            <rect x="1345" y="445" width="55" height="70" />
          </g>
          <g stroke="#3a2216" strokeWidth="0.8">
            <line x1="1095" y1="445" x2="1095" y2="515" /><line x1="1070" y1="480" x2="1120" y2="480" />
            <line x1="1162" y1="445" x2="1162" y2="515" /><line x1="1135" y1="480" x2="1190" y2="480" />
            <line x1="1232" y1="445" x2="1232" y2="515" /><line x1="1205" y1="480" x2="1260" y2="480" />
            <line x1="1302" y1="445" x2="1302" y2="515" /><line x1="1275" y1="480" x2="1330" y2="480" />
            <line x1="1372" y1="445" x2="1372" y2="515" /><line x1="1345" y1="480" x2="1400" y2="480" />
          </g>

          {/* Floor 1 Windows */}
          <rect x="1050" y="535" width="370" height="8" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.2" />
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.2">
            <rect x="1070" y="560" width="50" height="75" />
            <rect x="1135" y="560" width="55" height="75" />
            <rect x="1205" y="560" width="55" height="75" />
            <rect x="1275" y="560" width="55" height="75" />
            <rect x="1345" y="560" width="55" height="75" />
          </g>
        </g>

        {/* ========================================================
            CENTRAL PORTICO & PEDIMENT (THE MAIN CIT FAÇADE)
            ======================================================== */}
        <g id="citCentralPortico">
          {/* Main Portico Body */}
          <rect x="520" y="270" width="560" height="400" fill="#f7f2e8" stroke="#3a2216" strokeWidth="2.2" />

          {/* Upper Triangular Classical Pediment */}
          <polygon
            points="500,270 800,165 1100,270"
            fill="#ede5d6"
            stroke="#3a2216"
            strokeWidth="2.6"
          />

          {/* Inner Pediment Frame */}
          <polygon
            points="530,265 800,178 1070,265"
            fill="#f7f2e8"
            stroke="#3a2216"
            strokeWidth="1.4"
          />

          {/* Pediment Tympanum Crest: CIT Monogram & Shield */}
          <circle cx="800" cy="225" r="28" fill="url(#citTerraGrad)" stroke="#3a2216" strokeWidth="1.8" />
          <text
            x="800"
            y="233"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="18"
            fontWeight="900"
            letterSpacing="2"
            fontFamily="Arial, sans-serif"
          >
            CIT
          </text>
          <text
            x="800"
            y="254"
            textAnchor="middle"
            fill="#3a2216"
            fontSize="9"
            fontWeight="800"
            letterSpacing="2.5"
          >
            ESTD 1988
          </text>

          {/* ========================================================
              GRAND ENGRAVED FRIEZE / ENTABLATURE:
              "CHILIKA INSTITUTE OF TECHNOLOGY"
              ======================================================== */}
          {/* Primary Terracotta Inscription Band */}
          <rect
            x="500"
            y="270"
            width="600"
            height="46"
            fill="#3a2216"
            stroke="#1c1815"
            strokeWidth="2"
          />

          {/* Golden / Parchment Accent Line above and below */}
          <line x1="500" y1="273" x2="1100" y2="273" stroke="#db822a" strokeWidth="2" />
          <line x1="500" y1="313" x2="1100" y2="313" stroke="#db822a" strokeWidth="2" />

          {/* THE BOLD CIT COLLEGE NAME ENGRAVING */}
          <text
            x="800"
            y="298"
            textAnchor="middle"
            fill="#faf6ef"
            fontSize="18"
            fontWeight="900"
            letterSpacing="4"
            fontFamily="'Cinzel', 'Trajan Pro', Georgia, serif"
          >
            CHILIKA INSTITUTE OF TECHNOLOGY
          </text>
          <text
            x="800"
            y="310"
            textAnchor="middle"
            fill="#f2a97c"
            fontSize="9"
            fontWeight="800"
            letterSpacing="3.5"
          >
            AUTONOMOUS &bull; CHILIKA LAKE CAMPUS &bull; CIT
          </text>

          {/* Secondary Entablature Architrave */}
          <rect x="510" y="316" width="580" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.5" />

          {/* Upper Portico Large Window Gallery */}
          <g fill="url(#citWindowGrad)" stroke="#3a2216" strokeWidth="1.4">
            <rect x="560" y="340" width="90" height="75" />
            <rect x="680" y="340" width="100" height="75" />
            <rect x="820" y="340" width="100" height="75" />
            <rect x="950" y="340" width="90" height="75" />
          </g>
          {/* Grid mullions */}
          <g stroke="#3a2216" strokeWidth="0.9">
            <line x1="605" y1="340" x2="605" y2="415" /><line x1="560" y1="377" x2="650" y2="377" />
            <line x1="730" y1="340" x2="730" y2="415" /><line x1="680" y1="377" x2="780" y2="377" />
            <line x1="870" y1="340" x2="870" y2="415" /><line x1="820" y1="377" x2="920" y2="377" />
            <line x1="995" y1="340" x2="995" y2="415" /><line x1="950" y1="377" x2="1040" y2="377" />
          </g>

          {/* Intermediate Horizontal Cornice */}
          <rect x="515" y="425" width="570" height="12" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.5" />

          {/* Bold Institutional Nameplate Plaque on Main Facade */}
          <g id="citCentralNameplate">
            <rect x="690" y="415" width="220" height="28" rx="6" fill="#c54a26" stroke="#3a2216" strokeWidth="2" />
            <rect x="694" y="419" width="212" height="20" rx="4" fill="none" stroke="#db822a" strokeWidth="1" />
            <text x="800" y="434" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900" letterSpacing="4" fontFamily="'Cinzel', Georgia, serif">
              CIT • CENTRAL BLOCK
            </text>
          </g>

          {/* ========================================================
              GRAND COLONNADE - TALL CLASSICAL PILLARS (PORTICO)
              ======================================================== */}
          {/* Recessed Grand Entry Hall behind pillars */}
          <rect x="545" y="437" width="510" height="230" fill="#2d1c14" />
          {/* Grand Main Portico Arched Entrance Portals */}
          <g fill="#1a110b" stroke="#3a2216" strokeWidth="1.5">
            <path d="M575 667 V480 C575 460 635 460 635 480 V667 Z" />
            <path d="M685 667 V470 C685 445 765 445 765 470 V667 Z" />
            <path d="M835 667 V470 C835 445 915 445 915 470 V667 Z" />
            <path d="M965 667 V480 C965 460 1025 460 1025 480 V667 Z" />
          </g>

          {/* Classical Columns with Corinthian / Tuscan Capitals */}
          {/* Column 1 */}
          <g id="citCol1">
            <rect x="548" y="437" width="28" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="551" y="449" width="22" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="546" y="659" width="32" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>

          {/* Column 2 */}
          <g id="citCol2">
            <rect x="646" y="437" width="32" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="650" y="449" width="24" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="644" y="659" width="36" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>

          {/* Column 3 (Center-Left) */}
          <g id="citCol3">
            <rect x="774" y="437" width="34" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="778" y="449" width="26" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="772" y="659" width="38" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>

          {/* Column 4 (Center-Right) */}
          <g id="citCol4">
            <rect x="798" y="437" width="34" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="802" y="449" width="26" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="796" y="659" width="38" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>

          {/* Column 5 */}
          <g id="citCol5">
            <rect x="922" y="437" width="32" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="926" y="449" width="24" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="920" y="659" width="36" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>

          {/* Column 6 */}
          <g id="citCol6">
            <rect x="1024" y="437" width="28" height="12" fill="#f0e9dd" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="1027" y="449" width="22" height="210" fill="url(#citPillarShadow)" stroke="#3a2216" strokeWidth="1.4" />
            <rect x="1022" y="659" width="32" height="14" fill="#dfd5c5" stroke="#3a2216" strokeWidth="1.4" />
          </g>
        </g>

        {/* ========================================================
            GRAND LIMESTONE ENTRANCE STAIRCASE
            ======================================================== */}
        <g id="citGrandStairs">
          <polygon points="460,670 1140,670 1160,684 440,684" fill="#ede5d6" stroke="#3a2216" strokeWidth="1.2" />
          <polygon points="440,684 1160,684 1180,698 420,698" fill="#e4dcce" stroke="#3a2216" strokeWidth="1.2" />
          <polygon points="420,698 1180,698 1200,714 400,714" fill="#dbd2c2" stroke="#3a2216" strokeWidth="1.2" />
          <polygon points="400,714 1200,714 1230,732 370,732" fill="#d2c8b7" stroke="#3a2216" strokeWidth="1.2" />
          <polygon points="370,732 1230,732 1260,750 340,750" fill="#c9beac" stroke="#3a2216" strokeWidth="1.4" />
        </g>

        {/* ========================================================
            FLANKING COASTAL PALM TREES (As seen in booklet cover!)
            ======================================================== */}
        {/* Left Palm Tree 1 (Large) */}
        <g id="citLeftPalmMain">
          {/* Trunk */}
          <path
            d="M130 760 Q138 600 152 470 Q156 460 160 450"
            stroke="#5c3f2d"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* Trunk Rings */}
          <g stroke="#3a2216" strokeWidth="1.5">
            <line x1="126" y1="720" x2="137" y2="723" />
            <line x1="129" y1="670" x2="140" y2="673" />
            <line x1="133" y1="620" x2="144" y2="623" />
            <line x1="138" y1="560" x2="148" y2="563" />
            <line x1="144" y1="500" x2="154" y2="503" />
          </g>
          {/* Palm Fronds Canopy */}
          <g fill="url(#citPalmGrad)" stroke="#2f493b" strokeWidth="1.2">
            {/* Top Fronds */}
            <path d="M160 450 Q130 380 90 395 Q130 425 160 450 Z" />
            <path d="M160 450 Q160 360 145 340 Q165 390 160 450 Z" />
            <path d="M160 450 Q190 360 215 350 Q195 400 160 450 Z" />
            <path d="M160 450 Q230 385 245 410 Q205 430 160 450 Z" />
            {/* Mid/Lower Fronds */}
            <path d="M160 450 Q235 435 250 470 Q195 470 160 450 Z" />
            <path d="M160 450 Q200 480 205 525 Q175 490 160 450 Z" />
            <path d="M160 450 Q120 485 105 520 Q130 480 160 450 Z" />
            <path d="M160 450 Q85 440 60 465 Q115 455 160 450 Z" />
          </g>
        </g>

        {/* Left Palm Tree 2 (Smaller, in perspective) */}
        <g id="citLeftPalmSecondary">
          <path
            d="M80 770 Q88 650 98 520"
            stroke="#5c3f2d"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <g fill="#4e7561" stroke="#2f493b" strokeWidth="1" opacity="0.85">
            <path d="M98 520 Q70 470 45 480 Q75 500 98 520 Z" />
            <path d="M98 520 Q95 450 115 440 Q110 480 98 520 Z" />
            <path d="M98 520 Q130 470 150 490 Q120 510 98 520 Z" />
            <path d="M98 520 Q135 520 130 550 Q110 535 98 520 Z" />
            <path d="M98 520 Q65 530 55 560 Q80 540 98 520 Z" />
          </g>
        </g>

        {/* Right Palm Tree 1 (Large) */}
        <g id="citRightPalmMain">
          {/* Trunk */}
          <path
            d="M1470 760 Q1460 600 1445 470 Q1440 460 1436 450"
            stroke="#5c3f2d"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <g stroke="#3a2216" strokeWidth="1.5">
            <line x1="1464" y1="720" x2="1475" y2="723" />
            <line x1="1460" y1="670" x2="1471" y2="673" />
            <line x1="1456" y1="620" x2="1467" y2="623" />
            <line x1="1451" y1="560" x2="1461" y2="563" />
            <line x1="1445" y1="500" x2="1455" y2="503" />
          </g>
          {/* Palm Fronds Canopy */}
          <g fill="url(#citPalmGrad)" stroke="#2f493b" strokeWidth="1.2">
            <path d="M1436 450 Q1466 380 1506 395 Q1466 425 1436 450 Z" />
            <path d="M1436 450 Q1436 360 1451 340 Q1431 390 1436 450 Z" />
            <path d="M1436 450 Q1406 360 1381 350 Q1401 400 1436 450 Z" />
            <path d="M1436 450 Q1366 385 1351 410 Q1391 430 1436 450 Z" />
            <path d="M1436 450 Q1361 435 1346 470 Q1401 470 1436 450 Z" />
            <path d="M1436 450 Q1396 480 1391 525 Q1421 490 1436 450 Z" />
            <path d="M1436 450 Q1476 485 1491 520 Q1466 480 1436 450 Z" />
            <path d="M1436 450 Q1511 440 1536 465 Q1481 455 1436 450 Z" />
          </g>
        </g>

        {/* Right Palm Tree 2 (Smaller) */}
        <g id="citRightPalmSecondary">
          <path
            d="M1520 770 Q1512 650 1502 520"
            stroke="#5c3f2d"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <g fill="#4e7561" stroke="#2f493b" strokeWidth="1" opacity="0.85">
            <path d="M1502 520 Q1530 470 1555 480 Q1525 500 1502 520 Z" />
            <path d="M1502 520 Q1505 450 1485 440 Q1490 480 1502 520 Z" />
            <path d="M1502 520 Q1470 470 1450 490 Q1480 510 1502 520 Z" />
            <path d="M1502 520 Q1465 520 1470 550 Q1490 535 1502 520 Z" />
            <path d="M1502 520 Q1535 530 1545 560 Q1520 540 1502 520 Z" />
          </g>
        </g>

        {/* ========================================================
            CAMPUS ESPLANADE & FORECOURT
            ======================================================== */}
        <rect x="0" y="750" width="1600" height="150" fill="url(#citGroundGrad)" />

        {/* Manicured Lawn Grass Strips (Sage Green Accents) */}
        <path
          d="M0 770 L400 770 L350 810 L0 810 Z"
          fill="#4e7561"
          opacity="0.35"
        />
        <path
          d="M1600 770 L1200 770 L1250 810 L1600 810 Z"
          fill="#4e7561"
          opacity="0.35"
        />

        {/* Warm Terracotta Brick Promenade Band */}
        <rect x="0" y="810" width="1600" height="12" fill="#c54a26" opacity="0.4" />
        <line x1="0" y1="810" x2="1600" y2="810" stroke="#3a2216" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="822" x2="1600" y2="822" stroke="#3a2216" strokeWidth="1" opacity="0.5" />

        {/* Subtle Bottom Vignette to Blend with White / Ivory Page Content */}
        <rect
          x="0"
          y="700"
          width="1600"
          height="200"
          fill="url(#citGroundGrad)"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

export default CitCampusBuilding;
