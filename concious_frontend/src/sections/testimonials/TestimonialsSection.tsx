import { MovingRow } from "./MovingRow";

const testimonials = [
  {
    name: "Jorge Armstrong",
    mobileName: "Jorge A.",
    role: "Developer @Adobe",
    text: "Now, I feel free from Brain Rot.",
    mobileText: "Free from brain rot.",
  },
  {
    name: "Ana Bell",
    mobileName: "Ana Bell",
    role: "Creator, Youtube",
    text: "Saving content and rediscovering it is magical.",
    mobileText: "Rediscovering saves feels magical.",
  },
  {
    name: "Krishna Ram Tripathi",
    mobileName: "Krishna R.",
    role: "SWE @Microsoft",
    text: "Semantic search actually works.",
    mobileText: "Semantic search works.",
  },
  {
    name: "Priyanshu Mishra",
    mobileName: "Priyanshu M.",
    role: "SWE @ Meta",
    text: "Better and control watching.",
    mobileText: "Better control over watching.",
  },
  {
    name: "Ayush Shukla",
    mobileName: "Ayush S.",
    role: "SWE @ Apple",
    text: "Future Product, in pace with changing internet Content.",
    mobileText: "Built for how content moves.",
  },
  {
    name: "Anuj Winson",
    mobileName: "Anuj W.",
    role: "SWE @ Amazon",
    text: "I can control what am i watching and save important links.",
    mobileText: "Control what I watch and save.",
  },
  {
    name: "Anklet",
    mobileName: "Anklet",
    role: "Data Scientist",
    text: "Now, I can say i am spending my internet bills for right reason.",
    mobileText: "Internet time finally feels worth it.",
  },
  {
    name: "Shobhit",
    mobileName: "Shobhit",
    role: "SWE @ Google",
    text: "Now, Product is ahead of time and made for people.",
    mobileText: "Ahead of its time.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative z-10 flex min-h-0 flex-col justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:min-h-[calc(100vh-3.5rem)] lg:px-10 lg:py-12">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        <p className="inline-flex rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-stone-100/82 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.68rem] md:text-[0.72rem] md:tracking-[0.28em]">
          Testimonials
        </p>
        <h2 className="mt-1 max-w-[16ch] text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:max-w-none sm:text-[2.15rem] md:text-[2.45rem] lg:text-[2.95rem] lg:tracking-[-0.06em]">
          <span className="sm:hidden">People feel the difference</span>
          <span className="hidden sm:inline lg:hidden">
            People using Concious feel the difference
          </span>
          <span className="hidden lg:inline">
            People using Concious
            <span className="block pt-2 text-[0.88em]">feel the difference</span>
          </span>
        </h2>
      </div>

      <div className="mt-8 sm:mt-11 md:mt-12">
        <MovingRow testimonials={testimonials} direction="left" />
      </div>

      <div className="hidden md:block">
        <div className="h-6 md:h-8" />
        <MovingRow testimonials={testimonials} direction="right" />
      </div>
    </section>
  );
}
