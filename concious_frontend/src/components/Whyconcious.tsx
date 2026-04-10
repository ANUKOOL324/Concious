import { Consume } from "../sections/Consume";
import { Collase } from "../sections/Collase";
import { BackIcon } from "../Icon/BackIcon";
import { useNavigate } from "react-router-dom";

export default function WhyConscious() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_36%),linear-gradient(180deg,_#fbfbff_0%,_#f5f4ff_42%,_#ffffff_100%)] text-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-5rem] h-64 w-64 rounded-full bg-violet-200/40 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-slate-200/60 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="sticky top-4 z-30 mb-5 flex justify-start sm:mb-7">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)] active:translate-y-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition-colors duration-300 group-hover:bg-violet-600">
              <BackIcon />
            </span>
            <span className="text-left">
              <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
                Back
              </span>
              <span className="block text-sm tracking-tight text-slate-900">
                Return home
              </span>
            </span>
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent" />
          <div className="relative px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
            <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-slate-200/70 bg-white/75 px-4 py-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5 sm:py-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 text-[0.7rem] uppercase tracking-[0.35em] text-violet-500">
                  Why Concious
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:text-[2.4rem]">
                  A calmer product story for how digital attention should feel.
                </h1>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-[0.95rem]">
                This page keeps your original narrative, but frames it more like
                a premium editorial experience that breathes properly on phones,
                tablets, laptops, and wider screens.
              </p>
            </div>

            <Collase />
          </div>
        </section>

        <section
          id="testimonial"
          className="relative mt-6 bg-transparent sm:mt-8"
        >
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-4 lg:p-5"
        >
          <div
            className="absolute inset-0 z-0 rounded-[1.7rem] bg-cover bg-center lg:bg-fixed"
            style={{
              backgroundImage: "url('c2.png')",
            }}
          />
          <div className="absolute inset-0 z-10 rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(3,7,18,0.64)_0%,rgba(15,23,42,0.58)_48%,rgba(9,9,11,0.72)_100%)]" />
          <div className="relative z-20 overflow-hidden rounded-[1.7rem] border border-white/10">
            <Consume />
          </div>
        </div>
        </section>
      </div>
    </main>
  );
}
