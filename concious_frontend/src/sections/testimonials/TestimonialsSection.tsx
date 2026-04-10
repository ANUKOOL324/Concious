import { MovingRow } from "./MovingRow";

const testimonials = [
  {
    name: "Jorge Armstrong",
    role: "Developer @Adobe",
    text: "Now, I feel free from Brain Rot.",
  },
  {
    name: "Ana Bell",
    role: "Creator,Youtube",
    text: "Saving content and rediscovering it is magical.",
  },
  {
    name: "Krishna Ram Tripathi",
    role: "SWE @Microsoft",
    text: "Semantic search actually works.",
  },
  {
    name: "Priyanshu Mishra",
    role: "SWE @ Meta",
    text: "Better and control watching.",
  },
  {
    name: "Ayush Shukla",
    role: "SWE @ Apple",
    text: "Future Product,in pace with changing internet Content.",
  },
  {
    name: "Anuj Winson",
    role: "SWE @ Amazon",
    text: "I can control what am i watching and save important links.",
  },
  {
    name: "Anklet",
    role: "Data Scientist",
    text: "Now, I can say i am spending my internet bills for right reason.",
  },
  {
    name: "Shobhit",
    role: "@SWE Google",
    text: "Now, Product is ahead of time and made for people.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col justify-center overflow-hidden px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        <p className="inline-flex rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-stone-100/82 backdrop-blur-md">
          Testimonials
        </p>
        <h2 className="mt-1 max-w-[16ch] text-4xl font-semibold leading-[0.98] tracking-[-0.07em] text-white sm:text-5xl lg:max-w-[16ch] lg:text-[3.45rem]">
          People using Concious
          <span className="block pt-2 text-[0.88em]">feel the difference</span>
        </h2>
        <p className="mt-2 max-w-[46rem] text-sm leading-7 text-stone-200/88 sm:text-base">
          Intentional content. Clearer thinking. A calmer relationship with the
          internet, reflected back by the people using it.
        </p>
      </div>
      {/* <div className="w-100 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-white shadow-lg flex justify-center items-center"> the is the right end of the of world</div> */}
      <div className="mt-8">
        <MovingRow testimonials={testimonials} direction="left" />
      </div>
      <div className="h-8" />
      <MovingRow testimonials={testimonials} direction="right" />
    </section>
  );
}
