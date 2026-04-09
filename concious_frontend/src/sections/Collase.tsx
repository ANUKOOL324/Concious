import { useState } from "react";
import WhyConsciousHero from "./consumehero";

export function Collase() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <WhyConsciousHero />

          <div className="grid grid-cols-12 gap-4 mb-5">
            <div className="col-span-12 md:col-span-4 space-y-4">
              <div className="bg-black border-black border-dashed text-white p-8 rounded-2xl h-64 flex flex-col justify-center ">
                <p className="text-sm uppercase tracking-widest text-purple-400 mb-4">
                  The Problem
                </p>
                <h3 className="text-2xl font-bold mb-3">
                  We save hundreds of videos, tweets, podcasts
                </h3>
                <p className="text-gray-400">Most are never revisited.</p>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-dashed border-l-blue-300 border-r-blue-300 h-56">
                <img
                  src="Screenshot 2026-01-08 014348.png"
                  alt="Content overload"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-blue-400 border-dashed">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/tdIUMkXxtHg"
                  title="Attention and modern consumption"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl border-4 border-purple-200 border-dashed h-40 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-purple-600 mb-2">
                  Attention is the bottleneck
                </p>
                <p className="text-gray-700 font-medium">
                  Information today is infinite.
                  <br />
                  Human attention is not.
                </p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 space-y-4">
              <div className="rounded-2xl overflow-scroll shadow-lg border-4 border-dashed border-black h-48">
                <img
                  src="Screenshot 2026-01-08 014753.png"
                  alt="Research data"
                  className=""
                />
              </div>

              <div className="bg-black text-white p-8 rounded-2xl h-72 flex flex-col justify-center">
                <p className="text-sm uppercase tracking-widest text-purple-400 mb-4">
                  What Research Shows
                </p>
                <h3 className="text-xl font-bold mb-3">
                  The brain doesn't learn through constant exposure
                </h3>
                <p className="text-gray-400 text-sm">
                  Learning happens through reflection, synthesis, and rest.
                </p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 rounded-2xl h-full flex flex-col justify-center shadow-2xl">
                <p className="text-sm uppercase tracking-widest text-purple-200 mb-4">
                  Our Belief
                </p>
                <h3 className="text-3xl font-bold mb-4">
                  Information should compound your thinking — not fragment it
                </h3>
                <p className="text-purple-100 text-lg">
                  Tools shouldn't fight for attention. They should protect it.
                </p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 space-y-4">
              <div className="rounded-2xl overflow-scroll shadow-lg border-4 border-dashed border-yellow-200 border-l-black h-48">
                <img
                  src="Screenshot 2026-01-08 020958.png"
                  alt="Conscious workflow"
                  className=""
                />
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border-4 border-dashed border-gray-300 h-auto">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                  What Concious Is
                </p>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">
                    → A place to store content intentionally
                  </p>
                  <p className="font-medium">
                    → A system that encourages reflection
                  </p>
                  <p className="font-medium">
                    → A second brain — not a second feed
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5">
              <div className="rounded-2xl overflow-scroll shadow-lg border-4 border-dashed border-gray-300 h-64 flex justify-center items-center">
                <img
                  src="Screenshot 2026-01-08 014829.png"
                  alt="Time analysis"
                  className="w-full h-20 object-cover"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-7">
              <div className="bg-black text-white p-10 rounded-2xl h-64 flex flex-col justify-center">
                <p className="text-sm uppercase tracking-widest text-purple-400 mb-4">
                  Why AI Exists Here
                </p>
                <h3 className="text-2xl font-bold mb-3">
                  Ashqnor is not built to push more content
                </h3>
                <p className="text-gray-400">
                  It exists to help you understand what you consume, why it
                  matters, and how it shapes your thinking.
                </p>
              </div>
            </div>

            <div className="col-span-12">
              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-dashed border-purple-600  border-b-black h-48">
                <img
                  src="Screenshot 2026-01-08 020451.png"
                  alt="Understanding metrics"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="text-center my-12">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full hover:bg-purple-600 transition-all duration-300 text-lg font-medium shadow-lg"
            >
              {isExpanded ? "Show Less Details" : "Read Full Story"}
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
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
            <div className="space-y-16 pt-8 border-t-4 border-dashed border-purple-200">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-center">
                  The Modern Problem in Depth
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    We save hundreds of videos, tweets, podcasts, and articles
                    with the best intentions. We tell ourselves we'll watch that
                    video later, read that article when we have time, listen to
                    that podcast on our commute.
                  </p>
                  <p>
                    But most of them are never revisited. They sit in bookmarks,
                    saved folders, and "Watch Later" playlists — digital
                    graveyards of good intentions.
                  </p>
                  <p className="text-xl font-semibold text-purple-600">
                    We scroll more than we reflect. We consume more than we
                    integrate.
                  </p>
                  <p>
                    The result isn't knowledge — it's cognitive overload. Our
                    minds become cluttered with half-processed information,
                    disconnected facts, and unintegrated insights.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-3xl p-12">
                <h2 className="text-4xl font-bold text-center mb-8">
                  What Cognitive Science Tells Us
                </h2>
                <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700">
                  <p>
                    Research consistently shows that the brain does not learn
                    through constant exposure or passive consumption. True
                    learning requires active engagement.
                  </p>
                  <p className="text-xl font-semibold text-purple-600 text-center py-4">
                    Learning happens through reflection, synthesis, and rest.
                  </p>
                  <p>
                    Excess input increases cognitive load. When our minds are
                    constantly processing new information without time to
                    integrate it, we experience:
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>
                        Reduced clarity in thinking and decision-making
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Lower memory retention and recall</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Decreased ability to form deep understanding</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Mental fatigue and decision exhaustion</span>
                    </li>
                  </ul>
                  <p className="text-center text-gray-600 font-medium pt-6">
                    Time spent consuming ≠ understanding gained
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-center">
                  The Concious Approach
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-black text-white p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4 text-purple-400">
                      What We Believe
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Information should compound your thinking — not fragment
                      it. Every piece of content you consume should build on
                      what you already know, creating a coherent web of
                      understanding rather than isolated facts.
                    </p>
                  </div>
                  <div className="bg-purple-600 text-white p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4">What We Built</h3>
                    <p className="text-purple-100 leading-relaxed">
                      A platform that protects your attention instead of
                      extracting it. A system that encourages reflection instead
                      of endless consumption. A second brain — not a second
                      feed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
                <h2 className="text-4xl font-bold text-center mb-12">
                  The Concious Workflow
                </h2>
                <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="text-xl font-bold mb-2">Consume</h3>
                    <p className="text-gray-600">
                      Save content that resonates with intention
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="text-xl font-bold mb-2">Reflect</h3>
                    <p className="text-gray-600">
                      Process what you've learned with AI assistance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="text-xl font-bold mb-2">Integrate</h3>
                    <p className="text-gray-600">
                      Connect ideas and build your knowledge graph
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      4
                    </div>
                    <h3 className="text-xl font-bold mb-2">Rest</h3>
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
    </>
  );
}
