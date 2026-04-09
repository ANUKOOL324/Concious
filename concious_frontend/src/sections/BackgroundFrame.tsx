interface BackgroundFrameProps {
  backgroundImage: string;
  children: React.ReactNode;
  className?: string;
}

export default function BackgroundFrame({
  backgroundImage,
  children,
  className = "",
}: BackgroundFrameProps) {
  return (
    <div
      className={`
        relative
        min-h-screen
        rounded-3xl
        overflow-hidden
        border
        border-gray-200
        shadow-xl
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
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/30" />

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
