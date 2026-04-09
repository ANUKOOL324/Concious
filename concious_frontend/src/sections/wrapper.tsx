interface BackgroundWrapperProps {
  backgroundImage: string;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
}

export default function BackgroundWrapper({
  backgroundImage,
  children,
  overlay = true,
  className = "",
}: BackgroundWrapperProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          z-0
          bg-center
          bg-cover
          bg-fixed
          will-change-transform
        "
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {overlay && <div className="absolute inset-0 z-10 bg-black/50" />}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
