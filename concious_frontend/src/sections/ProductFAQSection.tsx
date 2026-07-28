import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="fAQs"
      className="relative z-10 flex min-h-0 flex-col justify-center px-4 py-8 text-white sm:px-6 sm:py-10 md:px-8 md:py-12 lg:min-h-[calc(100vh-3.5rem)] lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full border border-white/18 bg-white/8 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-stone-100/84 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.65rem] sm:tracking-[0.26em]">
          FAQs
        </p>
        <h2 className="mt-3 text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:mt-4 sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] lg:tracking-[-0.05em]">
          How{" "}
          <span className="text-white">Conc</span>
          <span className="text-violet-400">ious</span>
          {" "}works
        </h2>
        <p className="mx-auto mt-2.5 whitespace-nowrap text-[0.68rem] leading-none text-stone-300/90 sm:mt-3 sm:text-[0.85rem] lg:text-[0.9rem]">
          Simple to start today, powerful as your library grows.
        </p>
      </div>

      <div className="mx-auto mt-5 w-full max-w-sm space-y-2 sm:mt-7 sm:max-w-lg sm:space-y-2.5 md:mt-8 md:max-w-2xl lg:mt-9 lg:max-w-3xl lg:space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={faq.question}
              {...reveal({ delay: index * 0.05 })}
              className={`rounded-[1.25rem] border backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-300 sm:rounded-[1.4rem] ${
                isOpen
                  ? "border-violet-300/28 bg-white/14 shadow-[0_20px_44px_rgba(76,29,149,0.14)]"
                  : "border-white/12 bg-white/8 shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors duration-200 hover:bg-white/5 sm:gap-4 sm:px-4 sm:py-3.5 md:px-5 md:py-4"
              >
                <span className="text-[0.88rem] font-medium leading-snug tracking-[-0.01em] text-white sm:text-[0.95rem] md:text-[1rem]">
                  <span className="sm:hidden">{faq.mobileQuestion}</span>
                  <span className="hidden sm:inline">{faq.question}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-300 sm:h-8 sm:w-8 ${
                    isOpen
                      ? "rotate-45 border-violet-300/30 bg-violet-400/16 text-violet-200"
                      : "rotate-0 border-white/14 bg-white/8 text-stone-200"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] ease-out ${
                  reduceMotion ? "duration-0" : "duration-300"
                } ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="max-w-2xl px-3.5 pb-3.5 text-[0.8rem] leading-6 text-stone-300/88 sm:px-4 sm:pb-4 sm:text-[0.88rem] sm:leading-7 md:px-5 md:pb-4.5 md:text-[0.92rem]">
                    <span className="sm:hidden">{faq.mobileAnswer}</span>
                    <span className="hidden sm:inline">{faq.answer}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 text-center sm:mt-7 md:mt-8">
        <p className="text-[0.8rem] tracking-tight text-stone-200/90 sm:text-[0.9rem] md:text-[0.95rem]">
          <span className="sm:hidden">
            Save first.
            <span className="ml-1 text-violet-300">Think later.</span>
          </span>
          <span className="hidden sm:inline">
            Concious starts as a place to save.
            <span className="ml-1 text-violet-300">It grows into a place to think.</span>
          </span>
        </p>
      </div>
    </section>
  );
}
