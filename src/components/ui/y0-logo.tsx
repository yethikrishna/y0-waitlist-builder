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
    <rect x="2" y="2" width="44" height="44" rx="10" fill="currentColor" />
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="20"
      fontWeight="500"
      fill="oklch(var(--primary-foreground))"
      fontFamily="system-ui, -apple-system, sans-serif"
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
    <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />
    <text
      x="16"
      y="21.5"
      textAnchor="middle"
      fontSize="13"
      fontWeight="500"
      fill="oklch(var(--primary-foreground))"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      y0
    </text>
  </svg>
);
