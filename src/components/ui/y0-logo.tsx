interface Y0LogoProps {
  size?: number;
  className?: string;
}

export const Y0Logo = ({ size = 32, className = "" }: Y0LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="22" fill="currentColor" />
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="22"
      fontWeight="bold"
      fill="oklch(var(--primary-foreground))"
      fontFamily="Roobert, system-ui, sans-serif"
    >
      y0
    </text>
  </svg>
);

export const Y0LogoMark = ({ size = 24, className = "" }: Y0LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="15" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <path
      d="M10 10L16 18L22 10"
      stroke="oklch(var(--primary-foreground))"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="16"
      cy="22"
      r="3"
      fill="oklch(var(--primary-foreground))"
    />
  </svg>
);
