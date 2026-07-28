import BackgroundWrapper from "./wrapper";

export default function WhyConsciousHero() {
  return (
    <BackgroundWrapper
      backgroundImage="/hero.jpeg"
      className="mb-5 rounded-[1.5rem] border border-white/15 px-4 py-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:mb-6 sm:rounded-[1.75rem] sm:px-6 sm:py-6 lg:mb-8 lg:rounded-[2rem] lg:px-8 lg:py-7"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-violet-200 backdrop-blur sm:mb-3.5 sm:px-3.5 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.28em]">
          Editorial Overview
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.7fr)] lg:items-center lg:gap-8">
          <div className="min-w-0">
            <h1 className="text-[1.2rem] font-semibold leading-tight tracking-[-0.04em] text-white sm:whitespace-nowrap sm:text-[1.75rem] sm:leading-none lg:text-[2.1rem] lg:tracking-[-0.05em]">
              Why Concious{" "}
              <span className="bg-gradient-to-r from-violet-200 via-white to-violet-400 bg-clip-text text-transparent">
                exists now
              </span>
            </h1>

            <p className="mt-2.5 text-[0.8rem] leading-5 text-slate-200 sm:mt-3 sm:whitespace-nowrap sm:text-[0.9rem] sm:leading-none lg:text-[0.95rem]">
              <span className="sm:hidden">
                Intake wears us down when it happens
                <span className="font-semibold text-violet-300"> unconsciously</span>.
              </span>
              <span className="hidden sm:inline">
                Digital intake wears us down when it happens
                <span className="font-semibold text-violet-300"> unconsciously</span>.
              </span>
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-1 lg:gap-2">
            <div className="rounded-[1.1rem] border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-xl sm:rounded-[1.25rem] sm:px-4 sm:py-3.5">
              <p className="text-[0.55rem] uppercase tracking-[0.22em] text-violet-200 sm:text-[0.6rem] sm:tracking-[0.26em]">
                The Shift
              </p>
              <p className="mt-1.5 text-[0.8rem] leading-5 text-slate-200 sm:whitespace-nowrap sm:text-[0.85rem] sm:leading-none">
                Less noise, more reflection.
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-white/15 bg-slate-950/45 px-3.5 py-3 backdrop-blur-xl sm:rounded-[1.25rem] sm:px-4 sm:py-3.5">
              <p className="text-[0.55rem] uppercase tracking-[0.22em] text-violet-200 sm:text-[0.6rem] sm:tracking-[0.26em]">
                The Promise
              </p>
              <p className="mt-1.5 text-[0.8rem] leading-5 text-slate-100 sm:whitespace-nowrap sm:text-[0.85rem] sm:leading-none">
                <span className="sm:hidden">A second brain for attention.</span>
                <span className="hidden sm:inline">A second brain that protects attention.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
