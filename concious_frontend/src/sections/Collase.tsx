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
            <div className="flex h-64 flex-col justify-center rounded-[1.75rem] border border-slate-900 bg-slate-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:p-8">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.32em] text-violet-300">
                The Problem
              </p>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                We save hundreds of videos, tweets, podcasts
              </h3>
              <p className="leading-7 text-slate-400">
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

            <div className="flex h-40 flex-col justify-center rounded-[1.75rem] border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(139,92,246,0.16)] active:translate-y-0">
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.32em] text-violet-600">
                Attention is the bottleneck
              </p>
              <p className="font-medium leading-7 text-slate-700">
                Information today is infinite.
                <br />
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

            <div className="flex h-72 flex-col justify-center rounded-[1.75rem] border border-slate-900 bg-slate-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:p-8">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.32em] text-violet-300">
                What Research Shows
              </p>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">
                The brain does not learn through constant exposure
              </h3>
              <p className="text-sm leading-7 text-slate-400">
                Learning happens through reflection, synthesis, and rest.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="flex h-full flex-col justify-center rounded-[1.9rem] bg-gradient-to-br from-violet-600 via-violet-700 to-slate-900 p-8 text-white shadow-[0_32px_80px_rgba(91,33,182,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_38px_90px_rgba(91,33,182,0.34)] active:translate-y-0 sm:p-10">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.34em] text-violet-200">
                Our Belief
              </p>
              <h3 className="mb-4 text-3xl font-semibold tracking-tight">
                Information should compound your thinking, not fragment it.
              </h3>
              <p className="text-lg leading-8 text-violet-100">
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

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)] active:translate-y-0 sm:p-8">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.32em] text-slate-500">
                What Concious Is
              </p>
              <div className="space-y-3 text-slate-700">
                <p className="font-medium">
                  A place to store content intentionally
                </p>
                <p className="font-medium">
                  A system that encourages reflection
                </p>
                <p className="font-medium">
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
            <div className="flex h-64 flex-col justify-center rounded-[1.75rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)] active:translate-y-0 sm:p-10">
              <p className="mb-4 text-[0.72rem] uppercase tracking-[0.32em] text-violet-300">
                Why AI Exists Here
              </p>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                Ashqnor is not built to push more content
              </h3>
              <p className="leading-7 text-slate-400">
                It exists to help you understand what you consume, why it
                matters, and how it shapes your thinking.
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

        <div className="my-12 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-lg font-medium text-white shadow-[0_20px_45px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-violet-600 hover:shadow-[0_28px_60px_rgba(91,33,182,0.28)] active:scale-[0.98] active:translate-y-0"
          >
            {isExpanded ? "Show Less Details" : "Read Full Story"}
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${
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
          <div className="space-y-16 border-t-4 border-dashed border-purple-200 pt-8">
            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="text-center text-4xl font-bold">
                The Modern Problem in Depth
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  We save hundreds of videos, tweets, podcasts, and articles
                  with the best intentions. We tell ourselves we&apos;ll watch
                  that video later, read that article when we have time, listen
                  to that podcast on our commute.
                </p>
                <p>
                  But most of them are never revisited. They sit in bookmarks,
                  saved folders, and &quot;Watch Later&quot; playlists, digital
                  graveyards of good intentions.
                </p>
                <p className="text-xl font-semibold text-purple-600">
                  We scroll more than we reflect. We consume more than we
                  integrate.
                </p>
                <p>
                  The result isn&apos;t knowledge, it&apos;s cognitive overload.
                  Our minds become cluttered with half-processed information,
                  disconnected facts, and unintegrated insights.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-purple-50 p-12">
              <h2 className="mb-8 text-center text-4xl font-bold">
                What Cognitive Science Tells Us
              </h2>
              <div className="mx-auto max-w-4xl space-y-6 text-lg text-gray-700">
                <p>
                  Research consistently shows that the brain does not learn
                  through constant exposure or passive consumption. True
                  learning requires active engagement.
                </p>
                <p className="py-4 text-center text-xl font-semibold text-purple-600">
                  Learning happens through reflection, synthesis, and rest.
                </p>
                <p>
                  Excess input increases cognitive load. When our minds are
                  constantly processing new information without time to
                  integrate it, we experience:
                </p>
                <ul className="ml-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-purple-600">•</span>
                    <span>Reduced clarity in thinking and decision-making</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-purple-600">•</span>
                    <span>Lower memory retention and recall</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-purple-600">•</span>
                    <span>Decreased ability to form deep understanding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-purple-600">•</span>
                    <span>Mental fatigue and decision exhaustion</span>
                  </li>
                </ul>
                <p className="pt-6 text-center font-medium text-gray-600">
                  Time spent consuming does not equal understanding gained
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="text-center text-4xl font-bold">
                The Concious Approach
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-2xl bg-black p-8 text-white">
                  <h3 className="mb-4 text-2xl font-bold text-purple-400">
                    What We Believe
                  </h3>
                  <p className="leading-relaxed text-gray-300">
                    Information should compound your thinking, not fragment it.
                    Every piece of content you consume should build on what you
                    already know, creating a coherent web of understanding
                    rather than isolated facts.
                  </p>
                </div>
                <div className="rounded-2xl bg-purple-600 p-8 text-white">
                  <h3 className="mb-4 text-2xl font-bold">What We Built</h3>
                  <p className="leading-relaxed text-purple-100">
                    A platform that protects your attention instead of
                    extracting it. A system that encourages reflection instead
                    of endless consumption. A second brain, not a second feed.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-white p-12">
              <h2 className="mb-12 text-center text-4xl font-bold">
                The Concious Workflow
              </h2>
              <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Consume</h3>
                  <p className="text-gray-600">
                    Save content that resonates with intention
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Reflect</h3>
                  <p className="text-gray-600">
                    Process what you&apos;ve learned with AI assistance
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Integrate</h3>
                  <p className="text-gray-600">
                    Connect ideas and build your knowledge graph
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                    4
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Rest</h3>
                  <p className="text-gray-600">
                    Let insights settle and compound over time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
