import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "../components/common/useScrollReveal";

const faqs = [
  {
    question: "What can I store in Concious right now?",
    mobileQuestion: "What can I store?",
    answer:
      "You can save links from YouTube, Twitter (X), Spotify, articles, blogs, podcasts, and any web content you want to revisit later. Concious acts as one place for everything you consume online.",
    mobileAnswer:
      "YouTube, Twitter, Spotify, articles, podcasts, and any link you want to revisit later.",
  },
  {
    question: "How is Concious different from bookmarks or Notion?",
    mobileQuestion: "How is it different from bookmarks?",
    answer:
      "Bookmarks only store links, and Notion usually needs manual structure. Concious is designed around retrieval, context, and a better reading flow, so your saved content stays easier to search and revisit.",
    mobileAnswer:
      "Bookmarks only store links. Concious is built for retrieval, context, and easier search.",
  },
  {
    question: "What does Ashqnor actually do?",
    mobileQuestion: "What does Ashqnor do?",
    answer:
      "Ashqnor is an AI assistant for your saved knowledge. It helps you find, summarize, and recommend content based on what you already collected, so you can ask naturally instead of hunting through folders.",
    mobileAnswer:
      "Ashqnor helps you find, summarize, and explore content from what you already saved.",
  },
  {
    question: "Can Ashqnor recommend content I have not saved yet?",
    mobileQuestion: "Can Ashqnor recommend new content?",
    answer:
      "Yes. Ashqnor can suggest new videos, podcasts, or articles based on your saved content and interests, helping you discover useful material instead of drifting into endless random scrolling.",
    mobileAnswer:
      "Yes. It can suggest new content based on what you already saved and care about.",
  },
  {
    question: "Why build Concious around AI at all?",
    mobileQuestion: "Why use AI here?",
    answer:
      "Because manual organization breaks down as your library grows. AI helps Concious understand meaning, context, and patterns so your saved knowledge stays usable instead of getting buried.",
    mobileAnswer:
      "Manual organization breaks down as your library grows. AI keeps saved knowledge usable.",
  },
];

export function ProductFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reveal = useScrollReveal();

  return (
    <section
      id="fAQs"
      className="relative z-10 flex min-h-0 flex-col justify-center px-4 py-8 text-white sm:px-6 sm:py-10 md:px-8 md:py-12 lg:min-h-[calc(100vh-3.5rem)] lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-stone-100/84 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.68rem] md:text-[0.72rem] md:tracking-[0.28em]">
          FAQs
        </p>
        <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:mt-4 sm:text-4xl md:mt-5 md:text-[2.6rem] lg:text-5xl lg:text-[3.7rem] lg:tracking-[-0.06em]">
          How Concious works
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-stone-200/88 sm:text-sm sm:leading-6 md:mt-4 md:text-[0.95rem] md:leading-7 lg:text-base">
          <span className="md:hidden">
            Simple to start today, powerful as your library grows.
          </span>
          <span className="hidden md:inline lg:hidden">
            Simple to start today, designed to become more powerful over time.
          </span>
          <span className="hidden lg:inline">
            Simple to start with today, but designed to become a more powerful way
            to save, retrieve, and think over time.
          </span>
        </p>
      </div>

      <div className="mx-auto mt-5 w-full max-w-sm space-y-2.5 sm:mt-7 sm:max-w-lg sm:space-y-3 md:mt-8 md:max-w-2xl lg:mt-10 lg:max-w-4xl lg:space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={faq.question}
              {...reveal({ delay: index * 0.06 })}
              className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition duration-300 sm:rounded-[1.6rem] ${
                isOpen
                  ? "border-violet-300/28 bg-white/14 shadow-[0_24px_52px_rgba(76,29,149,0.16)]"
                  : "border-white/12 bg-white/8 shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition hover:bg-white/5 sm:gap-4 sm:px-4 sm:py-3.5 md:gap-6 md:px-5 md:py-4 lg:px-6 lg:py-5"
              >
                <span className="text-[0.82rem] font-medium tracking-tight text-white sm:text-sm md:text-base lg:text-lg">
                  <span className="md:hidden">{faq.mobileQuestion}</span>
                  <span className="hidden md:inline">{faq.question}</span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition duration-300 sm:h-8 sm:w-8 md:h-9 md:w-9 md:text-base lg:text-lg ${
                    isOpen
                      ? "rotate-45 border-violet-300/30 bg-violet-400/16 text-violet-200"
                      : "border-white/14 bg-white/8 text-stone-200"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`overflow-hidden px-3.5 transition-all duration-300 sm:px-4 md:px-5 lg:px-6 ${
                  isOpen ? "max-h-44 pb-3.5 sm:max-h-52 sm:pb-4 md:max-h-60 md:pb-5 lg:max-h-64" : "max-h-0"
                }`}
              >
                <p className="max-w-3xl text-[0.72rem] leading-5 text-stone-200/82 sm:text-xs sm:leading-6 md:text-sm md:leading-7 lg:text-[0.98rem]">
                  <span className="md:hidden">{faq.mobileAnswer}</span>
                  <span className="hidden md:inline">{faq.answer}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 text-center sm:mt-7 md:mt-8 lg:mt-10">
        <p className="text-xs tracking-tight text-white/92 sm:text-sm md:text-base lg:text-lg">
          <span className="md:hidden">
            Save first.
            <span className="ml-1 text-violet-300">Think later.</span>
          </span>
          <span className="hidden md:inline lg:hidden">
            Concious starts as a place to save.
            <span className="ml-1 text-violet-300">It grows into a place to think.</span>
          </span>
          <span className="hidden lg:inline">
            Concious starts as a place to save.
            <span className="ml-1 text-violet-300">It grows into a place to think.</span>
          </span>
        </p>
      </div>
    </section>
  );
}
