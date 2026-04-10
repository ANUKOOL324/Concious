import BackgroundWrapper from "./wrapper";

export default function WhyConsciousHero() {
  return (
    <BackgroundWrapper
      backgroundImage="/hero.jpeg"
      className="mb-8 rounded-[2rem] border border-white/15 px-5 py-8 shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:mb-10 lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.34em] text-violet-200 backdrop-blur sm:px-5">
          Editorial Overview
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
              Why Concious
              <span className="block bg-gradient-to-r from-violet-200 via-white to-violet-400 bg-clip-text text-transparent">
                exists now
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg lg:text-[1.15rem]">
              The internet does not wear us down simply because we use it. It
              wears us down because most of our digital intake happens
              <span className="font-semibold text-violet-300">
                {" "}
                unconsciously
              </span>
              .
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-violet-200">
                The Shift
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Less noise, more reflection. Less saving, more synthesis.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-slate-950/45 p-5 backdrop-blur-xl">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-violet-200">
                The Promise
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                Build a second brain that protects attention instead of
                fragmenting it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
