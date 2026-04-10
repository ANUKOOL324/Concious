import { useState } from "react";

const faqs = [
  {
    question: "What can I store in Concious right now?",
    answer:
      "You can save links from YouTube, Twitter (X), Spotify, articles, blogs, podcasts, and any web content you want to revisit later. Concious acts as one place for everything you consume online.",
  },
  {
    question: "How is Concious different from bookmarks or Notion?",
    answer:
      "Bookmarks only store links, and Notion usually needs manual structure. Concious is designed around retrieval, context, and a better reading flow, so your saved content stays easier to search and revisit.",
  },
  {
    question: "What does Ashqnor actually do?",
    answer:
      "Ashqnor is an AI assistant for your saved knowledge. It helps you find, summarize, and recommend content based on what you already collected, so you can ask naturally instead of hunting through folders.",
  },
  {
    question: "Can Ashqnor recommend content I have not saved yet?",
    answer:
      "Yes. Ashqnor can suggest new videos, podcasts, or articles based on your saved content and interests, helping you discover useful material instead of drifting into endless random scrolling.",
  },
  {
    question: "Why build Concious around AI at all?",
    answer:
      "Because manual organization breaks down as your library grows. AI helps Concious understand meaning, context, and patterns so your saved knowledge stays usable instead of getting buried.",
  },
];

export function ProductFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="fAQs"
      className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-stone-100/84 backdrop-blur-md">
          FAQs
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-[3.7rem]">
          How Concious works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-200/88 sm:text-base">
          Simple to start with today, but designed to become a more powerful way
          to save, retrieve, and think over time.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-4xl space-y-4 lg:mt-10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-[1.6rem] border backdrop-blur-xl transition duration-300 ${
                isOpen
                  ? "border-violet-300/28 bg-white/14 shadow-[0_24px_52px_rgba(76,29,149,0.16)]"
                  : "border-white/12 bg-white/8 shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/5"
              >
                <span className="text-base font-medium tracking-tight text-white sm:text-lg">
                  {faq.question}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition duration-300 ${
                    isOpen
                      ? "rotate-45 border-violet-300/30 bg-violet-400/16 text-violet-200"
                      : "border-white/14 bg-white/8 text-stone-200"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`overflow-hidden px-6 transition-all duration-300 ${
                  isOpen ? "max-h-64 pb-5" : "max-h-0"
                }`}
              >
                <p className="max-w-3xl text-sm leading-7 text-stone-200/82 sm:text-[0.98rem]">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center lg:mt-10">
        <p className="text-lg tracking-tight text-white/92">
          Concious starts as a place to save.
          <span className="ml-1 text-violet-300">It grows into a place to think.</span>
        </p>
      </div>
    </section>
  );
}
