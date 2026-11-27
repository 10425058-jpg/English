import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type TactileVariant =
  | 'primary'
  | 'secondary'
  | 'gold'
  | 'purple'
  | 'danger'
  | 'outline'
  | 'ghost';

export type TactileSize = 'sm' | 'md' | 'lg';

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TactileVariant;
  size?: TactileSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<TactileVariant, string> = {
  primary:
    'bg-[#58CC02] hover:bg-[#61DA06] text-white border-[#46A302] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  secondary:
    'bg-[#1CB0F6] hover:bg-[#2EBCFF] text-white border-[#0E8BC9] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  gold:
    'bg-[#FFC800] hover:bg-[#FFD324] text-[#3C3C3C] border-[#D9A600] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  purple:
    'bg-[#CE82FF] hover:bg-[#D696FF] text-white border-[#A55EEA] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  danger:
    'bg-[#FF4B4B] hover:bg-[#FF6161] text-white border-[#D32F2F] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  outline:
    'bg-white hover:bg-[#F7F8FA] text-[#3C3C3C] border-[#E5E5E5] border-2 border-b-4 active:border-b-2 active:translate-y-[2px]',
  ghost:
    'bg-transparent hover:bg-[#F7F8FA] text-[#3C3C3C] border-transparent border-2',
};

const SIZE_CLASSES: Record<TactileSize, string> = {
  sm: 'min-h-[38px] px-3.5 py-1.5 text-sm rounded-xl',
  md: 'min-h-[44px] px-5 py-2.5 text-base rounded-2xl',
  lg: 'min-h-[52px] px-6 py-3 text-lg rounded-2xl',
};

export function TactileButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  type = 'button',
  ...rest
}: TactileButtonProps) {
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-extrabold tracking-wide transition-all duration-100 select-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${disabledClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
