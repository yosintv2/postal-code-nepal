export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="url(#p2-grad)" />
      <text x="11" y="27" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="white">P</text>
      <text x="25" y="19" fontFamily="Georgia, 'Times New Roman', serif" fontSize="11" fontWeight="700" fill="white">2</text>
      <defs>
        <linearGradient id="p2-grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#7b241c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
