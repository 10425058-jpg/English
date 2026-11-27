import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function QuestCard({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-[#E5E5E5] bg-white p-5 shadow-[0_2px_0_#E5E5E5] ${className}`}
    >
      {children}
    </div>
  );
}

interface PillBadgeProps {
  children: ReactNode;
  tone?: 'green' | 'blue' | 'gold' | 'purple' | 'red' | 'neutral';
  className?: string;
}

const BADGE_TONES = {
  green: 'bg-[#E9FCD9] text-[#46A302] border-[#B8EE8A]',
  blue: 'bg-[#E3F6FF] text-[#0E8BC9] border-[#A7E2FF]',
  gold: 'bg-[#FFF5CC] text-[#A67800] border-[#FFE175]',
  purple: 'bg-[#F5E8FF] text-[#8E3FD6] border-[#E0B8FF]',
  red: 'bg-[#FFE6E6] text-[#D32F2F] border-[#FFB8B8]',
  neutral: 'bg-[#F7F8FA] text-[#555555] border-[#E5E5E5]',
};

export function PillBadge({ children, tone = 'neutral', className = '' }: PillBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  heightClass?: string;
  label?: string;
}

export function QuestProgressBar({
  value,
  max,
  color = '#58CC02',
  heightClass = 'h-3.5',
  label,
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 1 : max;
  const pct = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

  return (
    <div
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-[#E5E5E5] ${heightClass}`}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface HonestNoticeProps {
  title: string;
  description: string;
  tone?: 'info' | 'warning';
}

export function HonestNotice({ title, description, tone = 'info' }: HonestNoticeProps) {
  const colors =
    tone === 'warning'
      ? 'border-[#FFE175] bg-[#FFFBEB] text-[#785300]'
      : 'border-[#BCE7FD] bg-[#F2FAFF] text-[#0C5E8A]';

  return (
    <div className={`flex items-start gap-3 rounded-2xl border-2 p-3.5 text-sm ${colors}`}>
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-extrabold">{title}</p>
        <p className="mt-0.5 leading-relaxed opacity-90">{description}</p>
      </div>
    </div>
  );
}
