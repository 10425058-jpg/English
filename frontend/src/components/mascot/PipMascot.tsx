import { motion } from 'motion/react';

export type PipMood =
  | 'idle'
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'listening'
  | 'speaking';

interface PipMascotProps {
  mood?: PipMood;
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Pip the Quest Finch — Original animated mascot designed exclusively for English Quest.
 */
export function PipMascot({
  mood = 'idle',
  size = 96,
  className = '',
  label = 'Pip, your English Quest companion',
}: PipMascotProps) {
  const isBouncing = mood === 'celebrating' || mood === 'happy';
  const isListening = mood === 'listening';

  return (
    <motion.div
      role="img"
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center select-none ${className}`}
      animate={
        isBouncing
          ? { y: [0, -7, 0], rotate: [0, -2, 2, 0] }
          : mood === 'thinking'
            ? { rotate: [0, -3, 0] }
            : { y: [0, -3, 0] }
      }
      transition={{
        duration: isBouncing ? 1.1 : 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Soft shadow underneath */}
        <ellipse cx="60" cy="110" rx="28" ry="6" fill="#E5E5E5" />

        {/* Crest feathers */}
        <path
          d="M46 28 C48 12, 62 11, 64 25 C69 14, 80 18, 75 30 Z"
          fill="#FFC800"
          stroke="#D9A600"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Wings */}
        <motion.path
          d="M22 68 C14 58, 17 48, 28 52 L32 76 C26 78, 22 74, 22 68 Z"
          fill="#46A302"
          animate={mood === 'celebrating' ? { rotate: [0, -18, 0] } : undefined}
          style={{ originX: '30px', originY: '66px' }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.path
          d="M98 68 C106 58, 103 48, 92 52 L88 76 C94 78, 98 74, 98 68 Z"
          fill="#46A302"
          animate={mood === 'celebrating' ? { rotate: [0, 18, 0] } : undefined}
          style={{ originX: '90px', originY: '66px' }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        {/* Body */}
        <ellipse cx="60" cy="68" rx="34" ry="36" fill="#58CC02" stroke="#46A302" strokeWidth="3" />

        {/* Belly patch */}
        <ellipse cx="60" cy="77" rx="22" ry="21" fill="#FFFFFF" />

        {/* Explorer scarf */}
        <path
          d="M32 78 Q60 90 88 78 L84 89 Q60 99 36 89 Z"
          fill="#1CB0F6"
          stroke="#0E8BC9"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M72 85 L85 98 L75 103 L66 89 Z"
          fill="#1CB0F6"
          stroke="#0E8BC9"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Face mask */}
        <circle cx="47" cy="54" r="11" fill="#FFFFFF" />
        <circle cx="73" cy="54" r="11" fill="#FFFFFF" />

        {/* Eyes */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <>
            <path d="M41 55 Q47 48 53 55" stroke="#3C3C3C" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M67 55 Q73 48 79 55" stroke="#3C3C3C" strokeWidth="3.2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="48" cy="54" r="5" fill="#3C3C3C" />
            <circle cx="72" cy="54" r="5" fill="#3C3C3C" />
            <circle cx="46.5" cy="52" r="1.8" fill="#FFFFFF" />
            <circle cx="70.5" cy="52" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Thinking eyebrow */}
        {mood === 'thinking' && (
          <path d="M66 42 Q73 39 79 42" stroke="#3C3C3C" strokeWidth="2.6" strokeLinecap="round" />
        )}

        {/* Rosy cheeks */}
        <ellipse cx="36" cy="63" rx="4.5" ry="2.6" fill="#FF8A8A" opacity="0.7" />
        <ellipse cx="84" cy="63" rx="4.5" ry="2.6" fill="#FF8A8A" opacity="0.7" />

        {/* Beak */}
        {mood === 'speaking' ? (
          <>
            <path
              d="M52 62 L68 62 L60 72 Z"
              fill="#FFC800"
              stroke="#D9A600"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <ellipse cx="60" cy="67" rx="4" ry="3" fill="#FF4B4B" />
          </>
        ) : (
          <path
            d="M53 62 L67 62 L60 72 Z"
            fill="#FFC800"
            stroke="#D9A600"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Headphones when listening */}
        {isListening && (
          <>
            <path d="M26 54 C26 28, 94 28, 94 54" stroke="#CE82FF" strokeWidth="5" strokeLinecap="round" />
            <rect x="20" y="47" width="10" height="18" rx="5" fill="#CE82FF" stroke="#A55EEA" strokeWidth="2" />
            <rect x="90" y="47" width="10" height="18" rx="5" fill="#CE82FF" stroke="#A55EEA" strokeWidth="2" />
          </>
        )}

        {/* Sparkle on celebrating */}
        {mood === 'celebrating' && (
          <>
            <path d="M16 28 L19 21 L22 28 L29 31 L22 34 L19 41 L16 34 L9 31 Z" fill="#FFC800" />
            <path d="M100 22 L102 17 L104 22 L109 24 L104 26 L102 31 L100 26 L95 24 Z" fill="#1CB0F6" />
          </>
        )}
      </svg>
    </motion.div>
  );
}
