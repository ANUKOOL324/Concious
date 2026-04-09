import { useState } from "react";

const faqs = [
  {
    question: "What can I store in Concious right now?",
    answer:
      "You can save and share your Dashboard of links from YouTube, Twitter (X), Spotify, articles, blogs, podcasts, and any web content you want to revisit later. Concious acts as a single place for everything you consume online.",
  },
  {
    question: "How is Concious different from bookmarks or Notion?",
    answer:
      "Bookmarks only store links, and Notion requires manual organization. Concious provide a better UI, automatically understands your content, keeps it searchable, and lets you retrieve it using natural language instead of folders.",
  },
  {
    question: "What does Ashqnor actually do?",
    answer:
      "Ashqnor is an AI chatbot that helps you find, summarize, and recommend content based on what you’ve saved. You can ask things like “show me videos about focus” or “what should I watch next?”",
  },
  {
    question: "Can Ashqnor recommend content I haven’t saved?",
    answer:
      "Yes. Ashqnor can suggest new videos, podcasts, or articles based on your saved content and interests — helping you discover relevant material instead of endless random scrolling.",
  },
  {
    question: "Why build Concious around AI at all?",
    answer:
      "Because as your content grows, manual organization stops working. AI allows Concious to understand meaning, context, and patterns — so your saved knowledge stays usable, not buried.",
  },
];

export function ProductFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="fAQs" className="relative bg-black/75 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 mt-8">
          <h2 className="text-5xl md:text-6xl font-semibold mb-3 tracking-tighter">
            How Concious Works
          </h2>
          <p className="text-purple-400 max-w-2xl mx-auto text-lg tracking-tight">
            Simple today.
            <span className="text-white tracking-tighter ml-1">
              Powerful by design.
            </span>
          </p>
        </div>
        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-noneoverflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-medium hover:bg-white/5 transition tracking-tight"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`transition-transform ${
                      isOpen ? "rotate-45 text-purple-400" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`
                    px-6
                    transition-all
                    duration-300
                    overflow-hidden
                    ${isOpen ? "max-h-72 py-4" : "max-h-0"}
                  `}
                >
                  <p className="text-gray-300 leading-relaxed tracking-tight">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <p className="text-White text-lg tracking-tighter">
            Concious starts as a place to save.
            <span className="text-purple-400 tracking-tighter ml-1">
              It grows as a place to think.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
