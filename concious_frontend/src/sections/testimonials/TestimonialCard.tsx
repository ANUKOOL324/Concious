export function TestimonialCard({
  name,
  mobileName,
  role,
  text,
  mobileText,
}: {
  name: string;
  mobileName?: string;
  role: string;
  text: string;
  mobileText?: string;
}) {
  return (
    <div className="flex h-full w-[9.5rem] shrink-0 flex-col rounded-lg border border-white/20 bg-white/10 p-2.5 text-white shadow-lg backdrop-blur-lg sm:w-[11rem] sm:rounded-xl sm:p-3 md:w-[14.5rem] md:rounded-2xl md:p-4 lg:w-[19.5rem] lg:p-6">
      <p className="mb-2 flex-1 text-[0.65rem] leading-[1.35] text-gray-300 sm:mb-2.5 sm:text-xs sm:leading-5 md:mb-3.5 md:text-sm md:leading-5 lg:mb-4 lg:text-base lg:leading-6">
        <span className="md:hidden">“{mobileText ?? text}”</span>
        <span className="hidden md:inline">“{text}”</span>
      </p>
      <div className="truncate text-[0.62rem] font-semibold sm:text-[0.68rem] md:text-xs lg:text-sm">
        <span className="md:hidden">{mobileName ?? name}</span>
        <span className="hidden md:inline">{name}</span>
      </div>
      <div className="mt-0.5 hidden truncate text-[0.58rem] text-gray-400 sm:text-[0.62rem] md:block md:text-[0.68rem] lg:text-xs">
        {role}
      </div>
    </div>
  );
}
