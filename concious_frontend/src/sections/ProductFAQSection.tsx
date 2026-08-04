import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useScrollReveal } from "../components/common/useScrollReveal";

const faqs = [
  {
    question: "What can I store in Concious right now?",
    mobileQuestion: "What can I store?",
    answer:
      "You can save YouTube, Twitter/X, Spotify, articles, PDFs, and other links, then add notes, tags, collections, and why you saved each item. Concious becomes one vault for the knowledge you want to keep.",
    mobileAnswer:
      "YouTube, Twitter/X, Spotify, articles, PDFs, plus notes, tags, and why you saved it.",
  },
  {
    question: "How is Concious different from bookmarks or Notion?",
    mobileQuestion: "How is it different from bookmarks?",
    answer:
      "Bookmarks only store links, and Notion usually needs manual structure. Concious indexes what you save so you can search by meaning, ask Ashqnor grounded questions, and share a read-only brain link when you want.",
    mobileAnswer:
      "Bookmarks store links. Concious indexes them for semantic search, Ashqnor chat, and sharing.",
  },
  {
    question: "What does Ashqnor actually do?",
    mobileQuestion: "What does Ashqnor do?",
    answer:
      "Ashqnor is an AI assistant over your own library. It retrieves relevant chunks from what you saved and answers with source-backed context, so responses stay grounded in your content instead of generic chat.",
    mobileAnswer:
      "Ashqnor answers from your saved sources with grounded, source-backed context.",
  },
  {
    question: "Can Ashqnor recommend content I have not saved yet?",
    mobileQuestion: "Can Ashqnor recommend new content?",
    answer:
      "Not yet. Right now Ashqnor focuses on retrieving and answering from what you already saved. Smarter recommendations based on your interests are planned for later.",
    mobileAnswer:
      "Not yet. Ashqnor currently works on your saved library; recommendations are coming later.",
  },
  {
    question: "Why build Concious around AI at all?",
    mobileQuestion: "Why use AI here?",
    answer:
      "Because folders alone break down as your library grows. Embeddings, hybrid search, and Ashqnor help Concious understand meaning so your saved knowledge stays findable and useful over time.",
    mobileAnswer:
      "Folders break down as libraries grow. AI keeps saved knowledge searchable by meaning.",
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
