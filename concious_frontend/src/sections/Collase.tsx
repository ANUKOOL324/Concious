import { useState } from "react";
import WhyConsciousHero from "./consumehero";

export function Collase() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-1 py-1 sm:px-2 sm:py-2">
        <WhyConsciousHero />

        <div className="mb-6 grid grid-cols-12 gap-4 lg:gap-5">
          <div className="col-span-12 space-y-4 md:col-span-4">
            <div className="flex h-auto min-h-52 flex-col justify-center rounded-[1.5rem] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:h-64 sm:rounded-[1.75rem] sm:p-8">
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.24em] text-violet-300 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.32em]">
                The Problem
              </p>
              <h3 className="text-balance mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-2xl">
                We save hundreds of videos, tweets, podcasts
              </h3>
              <p className="text-pretty text-sm leading-5 text-slate-400 sm:text-base sm:leading-7">
                Most are never revisited.
              </p>
            </div>

            <div className="h-56 overflow-hidden rounded-[1.75rem] border border-violet-200/70 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0">
              <img
                src="Screenshot 2026-01-08 014348.png"
                alt="Content overload"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="col-span-12 space-y-4 md:col-span-4">
            <div className="aspect-video overflow-hidden rounded-[1.75rem] border border-blue-200/70 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/tdIUMkXxtHg"
                title="Attention and modern consumption"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex h-auto min-h-32 flex-col justify-center rounded-[1.5rem] border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(139,92,246,0.16)] active:translate-y-0 sm:h-40 sm:rounded-[1.75rem] sm:p-6">
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-violet-600 sm:mb-2 sm:text-[0.68rem] sm:tracking-[0.32em]">
                Attention is the bottleneck
              </p>
              <p className="text-pretty text-sm font-medium leading-5 text-slate-700 sm:text-base sm:leading-7">
                Information today is infinite.
                <br className="hidden min-[420px]:inline" />
                {" "}
                Human attention is not.
              </p>
            </div>
          </div>

          <div className="col-span-12 space-y-4 md:col-span-4">
            <div className="h-48 overflow-scroll rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0">
              <img
                src="Screenshot 2026-01-08 014753.png"
                alt="Research data"
              />
            </div>

            <div className="flex h-auto min-h-56 flex-col justify-center rounded-[1.5rem] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:h-72 sm:rounded-[1.75rem] sm:p-8">
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.24em] text-violet-300 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.32em]">
                What Research Shows
              </p>
              <h3 className="text-balance mb-2 text-base font-semibold tracking-tight sm:mb-3 sm:text-xl">
                The brain does not learn through constant exposure
              </h3>
              <p className="text-pretty text-[0.8rem] leading-5 text-slate-400 sm:text-sm sm:leading-7">
                Learning happens through reflection, synthesis, and rest.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="flex h-full flex-col justify-center rounded-[1.6rem] bg-gradient-to-br from-violet-600 via-violet-700 to-slate-900 p-5 text-white shadow-[0_32px_80px_rgba(91,33,182,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_38px_90px_rgba(91,33,182,0.34)] active:translate-y-0 sm:rounded-[1.9rem] sm:p-10">
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.24em] text-violet-200 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.34em]">
                Our Belief
              </p>
              <h3 className="text-balance mb-2.5 text-xl font-semibold tracking-tight sm:mb-4 sm:text-3xl">
                Information should compound your thinking, not fragment it.
              </h3>
              <p className="text-pretty text-sm leading-6 text-violet-100 sm:text-lg sm:leading-8">
                Tools should not fight for attention. They should protect it.
              </p>
            </div>
          </div>

          <div className="col-span-12 space-y-4 md:col-span-6">
            <div className="h-48 overflow-scroll rounded-[1.75rem] border border-amber-200/80 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0">
              <img
                src="Screenshot 2026-01-08 020958.png"
                alt="Conscious workflow"
              />
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0 sm:rounded-[1.75rem] sm:p-8">
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.24em] text-slate-500 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.32em]">
                What Concious Is
              </p>
              <div className="text-pretty space-y-2 text-sm text-slate-700 sm:space-y-3 sm:text-base">
                <p className="font-medium leading-5 sm:leading-7">
                  A place to store content intentionally
                </p>
                <p className="font-medium leading-5 sm:leading-7">
                  A system that encourages reflection
                </p>
                <p className="font-medium leading-5 sm:leading-7">
                  A second brain, not a second feed
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5">
            <div className="flex h-64 items-center justify-center overflow-scroll rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0">
              <img
                src="Screenshot 2026-01-08 014829.png"
                alt="Time analysis"
                className="h-20 w-full object-cover"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="flex h-auto min-h-52 flex-col justify-center rounded-[1.5rem] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:h-64 sm:rounded-[1.75rem] sm:p-10">
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.24em] text-violet-300 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.32em]">
                Why AI Exists Here
              </p>
              <h3 className="text-balance mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-2xl">
                Ashqnor is not built to push more content
              </h3>
              <p className="text-pretty text-sm leading-5 text-slate-400 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  It helps you understand what you consume and why it matters.
                </span>
                <span className="hidden sm:inline">
                  It exists to help you understand what you consume, why it
                  matters, and how it shapes your thinking.
                </span>
              </p>
            </div>
          </div>

          <div className="col-span-12">
            <div className="h-48 overflow-hidden rounded-[1.75rem] border border-violet-300/70 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(139,92,246,0.16)] active:translate-y-0">
              <img
                src="Screenshot 2026-01-08 020451.png"
                alt="Understanding metrics"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="my-8 text-center sm:my-12">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_16px_36px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-[0_22px_48px_rgba(91,33,182,0.24)] active:scale-[0.98] sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
          >
            {isExpanded ? "Show Less Details" : "Read Full Story"}
            <svg
              className={`h-4 w-4 transition-transform duration-300 sm:h-5 sm:w-5 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-8 border-t border-dashed border-violet-200/80 pt-8 sm:space-y-10 sm:pt-10 lg:space-y-12">
            <article className="mx-auto max-w-[40rem] space-y-4 sm:space-y-5">
              <h2 className="text-balance text-center text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-xl">
                The Modern Problem in Depth
              </h2>
              <div className="space-y-4 text-[0.92rem] leading-7 text-slate-600 sm:text-[0.98rem] sm:leading-[1.75]">
                <p>
                  We save hundreds of videos, tweets, podcasts, and articles
                  with the best intentions. We tell ourselves we&apos;ll watch
                  that video later, read that article when we have time, listen
                  to that podcast on our commute.
                </p>
                <p>
                  But most of them are never revisited. They sit in bookmarks,
                  saved folders, and &quot;Watch Later&quot; playlists — digital
                  graveyards of good intentions.
                </p>
                <p className="rounded-xl border border-violet-100 bg-violet-50/70 px-4 py-3 text-[0.92rem] font-medium leading-7 text-violet-700 sm:rounded-2xl sm:px-5 sm:text-[0.98rem]">
                  We scroll more than we reflect. We consume more than we
                  integrate.
                </p>
                <p>
                  The result isn&apos;t knowledge, it&apos;s cognitive overload.
                  Our minds become cluttered with half-processed information,
                  disconnected facts, and unintegrated insights.
                </p>
              </div>
            </article>

            <article className="mx-auto max-w-[42rem] rounded-[1.35rem] border border-violet-100/80 bg-violet-50/50 px-4 py-5 sm:rounded-[1.5rem] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
              <h2 className="mb-4 text-balance text-center text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:mb-5 sm:text-xl">
                What Cognitive Science Tells Us
              </h2>
              <div className="mx-auto max-w-[40rem] space-y-4 text-[0.92rem] leading-7 text-slate-600 sm:text-[0.98rem] sm:leading-[1.75]">
                <p>
                  Research consistently shows that the brain does not learn
                  through constant exposure or passive consumption. True
                  learning requires active engagement.
                </p>
                <p className="text-center font-medium text-violet-700">
                  Learning happens through reflection, synthesis, and rest.
                </p>
                <p>
                  Excess input increases cognitive load. When our minds are
                  constantly processing new information without time to
                  integrate it, we experience:
                </p>
                <ul className="space-y-2 sm:space-y-2.5">
                  {[
                    "Reduced clarity in thinking and decision-making",
                    "Lower memory retention and recall",
                    "Decreased ability to form deep understanding",
                    "Mental fatigue and decision exhaustion",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-1 text-center text-[0.85rem] font-medium text-slate-500 sm:text-[0.9rem]">
                  Time spent consuming does not equal understanding gained
                </p>
              </div>
            </article>

            <article className="mx-auto max-w-[42rem] space-y-4 sm:space-y-5">
              <h2 className="text-balance text-center text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-xl">
                The Concious Approach
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
                <div className="rounded-[1.25rem] bg-slate-950 p-4 text-white sm:rounded-[1.35rem] sm:p-5">
                  <h3 className="mb-2 text-[0.95rem] font-semibold text-violet-300 sm:text-base">
                    What We Believe
                  </h3>
                  <p className="text-[0.88rem] leading-7 text-slate-300 sm:text-[0.92rem] sm:leading-[1.7]">
                    Information should compound your thinking, not fragment it.
                    Every piece of content you consume should build on what you
                    already know, creating a coherent web of understanding
                    rather than isolated facts.
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-violet-600 p-4 text-white sm:rounded-[1.35rem] sm:p-5">
                  <h3 className="mb-2 text-[0.95rem] font-semibold sm:text-base">
                    What We Built
                  </h3>
                  <p className="text-[0.88rem] leading-7 text-violet-50 sm:text-[0.92rem] sm:leading-[1.7]">
                    A platform that protects your attention instead of
                    extracting it. A system that encourages reflection instead
                    of endless consumption. A second brain, not a second feed.
                  </p>
                </div>
              </div>
            </article>

            <article className="mx-auto max-w-[42rem] rounded-[1.35rem] border border-slate-200/80 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[1.5rem] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
              <h2 className="mb-5 text-balance text-center text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:mb-6 sm:text-xl">
                The Concious Workflow
              </h2>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-4">
                {[
                  {
                    step: "1",
                    title: "Consume",
                    body: "Save content that resonates with intention",
                  },
                  {
                    step: "2",
                    title: "Reflect",
                    body: "Process what you've learned with AI assistance",
                  },
                  {
                    step: "3",
                    title: "Integrate",
                    body: "Connect ideas and build your knowledge graph",
                  },
                  {
                    step: "4",
                    title: "Rest",
                    body: "Let insights settle and compound over time",
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white sm:mb-3 sm:h-10 sm:w-10 sm:text-sm">
                      {item.step}
                    </div>
                    <h3 className="mb-1 text-[0.85rem] font-semibold text-slate-900 sm:text-[0.95rem]">
                      {item.title}
                    </h3>
                    <p className="text-[0.72rem] leading-5 text-slate-500 sm:text-[0.8rem] sm:leading-5">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
