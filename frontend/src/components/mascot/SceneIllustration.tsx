export type SceneKind = 'cafe' | 'airport' | 'workspace' | 'park';

interface SceneIllustrationProps {
  kind: SceneKind;
  className?: string;
}

/**
 * Original SVG scene illustrations for Speaking Picture Descriptions & Scenarios.
 */
export function SceneIllustration({ kind, className = '' }: SceneIllustrationProps) {
  if (kind === 'cafe') {
    return (
      <svg
        viewBox="0 0 360 190"
        fill="none"
        role="img"
        aria-label="A sunny corner cafe with pastries, coffee cups, and two friends chatting"
        className={`w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#FFF8E6] ${className}`}
      >
        <rect width="360" height="190" fill="#FFF8E6" />
        <rect x="0" y="138" width="360" height="52" fill="#F2E2C4" />
        {/* Window */}
        <rect x="24" y="22" width="120" height="84" rx="12" fill="#DDF4FF" stroke="#1CB0F6" strokeWidth="4" />
        <circle cx="52" cy="46" r="14" fill="#FFC800" />
        <path d="M26 84 Q60 66 95 82 T142 78 L142 104 L26 104 Z" fill="#89E219" />
        {/* Counter & Menu board */}
        <rect x="172" y="20" width="160" height="52" rx="10" fill="#3C3C3C" />
        <text x="190" y="42" fill="#FFC800" fontSize="13" fontWeight="800">SUNNY CAFE MENU</text>
        <text x="190" y="60" fill="#FFFFFF" fontSize="11" fontWeight="600">Coffee • Tea • Croissant</text>
        {/* Table & Coffee */}
        <rect x="70" y="114" width="110" height="14" rx="7" fill="#D9A600" />
        <rect x="118" y="128" width="14" height="40" fill="#B88800" />
        <rect x="92" y="92" width="24" height="22" rx="5" fill="#FFFFFF" stroke="#3C3C3C" strokeWidth="2.5" />
        <path d="M116 97 Q124 97 124 103 Q124 109 116 109" stroke="#3C3C3C" strokeWidth="2.5" />
        <ellipse cx="148" cy="108" rx="16" ry="7" fill="#F6B93B" stroke="#D9A600" strokeWidth="2" />
        {/* Plant */}
        <rect x="292" y="112" width="28" height="28" rx="6" fill="#FF7B54" />
        <ellipse cx="306" cy="96" rx="16" ry="20" fill="#58CC02" />
      </svg>
    );
  }

  if (kind === 'airport') {
    return (
      <svg
        viewBox="0 0 360 190"
        fill="none"
        role="img"
        aria-label="An international airport departure hall with a flight board, suitcase, and airplane outside"
        className={`w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#EAF8FF] ${className}`}
      >
        <rect width="360" height="190" fill="#EAF8FF" />
        <rect x="0" y="140" width="360" height="50" fill="#E5E5E5" />
        {/* Large departure window */}
        <rect x="20" y="20" width="180" height="96" rx="12" fill="#BAE8FF" stroke="#1CB0F6" strokeWidth="4" />
        {/* Airplane */}
        <path d="M62 72 L126 60 L150 68 L126 76 L62 72 Z" fill="#FFFFFF" stroke="#3C3C3C" strokeWidth="2" />
        <path d="M96 66 L82 46 L96 48 L112 64 Z" fill="#58CC02" />
        {/* Departure board */}
        <rect x="218" y="22" width="122" height="68" rx="10" fill="#3C3C3C" />
        <text x="230" y="42" fill="#FFC800" fontSize="11" fontWeight="800">DEPARTURES</text>
        <text x="230" y="58" fill="#89E219" fontSize="10" fontWeight="700">LON  GATE 12  ON TIME</text>
        <text x="230" y="74" fill="#FFFFFF" fontSize="10" fontWeight="600">SGN  GATE 04  BOARDING</text>
        {/* Suitcase */}
        <rect x="238" y="108" width="42" height="48" rx="8" fill="#CE82FF" stroke="#A55EEA" strokeWidth="3" />
        <rect x="251" y="94" width="16" height="14" rx="4" stroke="#3C3C3C" strokeWidth="3" />
        <circle cx="247" cy="158" r="5" fill="#3C3C3C" />
        <circle cx="271" cy="158" r="5" fill="#3C3C3C" />
      </svg>
    );
  }

  if (kind === 'workspace') {
    return (
      <svg
        viewBox="0 0 360 190"
        fill="none"
        role="img"
        aria-label="A bright modern study desk with a laptop, notebook, clock, and bookshelf"
        className={`w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F8FA] ${className}`}
      >
        <rect width="360" height="190" fill="#F7F8FA" />
        {/* Desk */}
        <rect x="30" y="130" width="300" height="16" rx="8" fill="#E6C280" stroke="#C59B52" strokeWidth="2.5" />
        <rect x="52" y="146" width="14" height="36" fill="#C59B52" />
        <rect x="294" y="146" width="14" height="36" fill="#C59B52" />
        {/* Laptop */}
        <rect x="115" y="70" width="106" height="58" rx="8" fill="#3C3C3C" />
        <rect x="122" y="77" width="92" height="44" rx="4" fill="#1CB0F6" />
        <rect x="104" y="124" width="128" height="8" rx="4" fill="#999999" />
        {/* Notebook */}
        <rect x="242" y="106" width="54" height="24" rx="5" fill="#58CC02" stroke="#46A302" strokeWidth="2" />
        {/* Clock */}
        <circle cx="72" cy="56" r="24" fill="#FFFFFF" stroke="#FFC800" strokeWidth="4" />
        <path d="M72 56 L72 42 M72 56 L83 56" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 360 190"
      fill="none"
      role="img"
      aria-label="A lively green city park with trees, a bench, pathway, and sunshine"
      className={`w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#E8F9FF] ${className}`}
    >
      <rect width="360" height="190" fill="#E8F9FF" />
      <circle cx="305" cy="40" r="22" fill="#FFC800" />
      <path d="M0 128 Q180 112 360 128 L360 190 L0 190 Z" fill="#89E219" />
      <path d="M130 190 Q175 150 220 124 L250 126 Q210 156 190 190 Z" fill="#F5E6C8" />
      {/* Trees */}
      <rect x="60" y="90" width="14" height="44" rx="4" fill="#8D5B4C" />
      <circle cx="67" cy="76" r="28" fill="#58CC02" />
      <rect x="276" y="84" width="14" height="48" rx="4" fill="#8D5B4C" />
      <circle cx="283" cy="68" r="30" fill="#46A302" />
      {/* Bench */}
      <rect x="116" y="116" width="76" height="12" rx="4" fill="#D9A600" />
      <rect x="122" y="128" width="6" height="18" fill="#3C3C3C" />
      <rect x="180" y="128" width="6" height="18" fill="#3C3C3C" />
    </svg>
  );
}
