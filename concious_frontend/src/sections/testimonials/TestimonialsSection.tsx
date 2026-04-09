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
    <section className="py-10 bg-black overflow-hidden ">
      <div className=" relative flex flex-col gap-2 justify-center items-center z-10">
        <h2 className="text-3xl md:text-6xl font-medium  text-white mt-5 tracking-tighter text-center">
          Testimonials
        </h2>
        <p className="text-base sm:text-lg pl-3  mt-2 text-white mb-20 text-center">
          Intentional content.Clearer thinking.
        </p>
      </div>
      {/* <div className="w-100 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-white shadow-lg flex justify-center items-center"> the is the right end of the of world</div> */}
      <MovingRow testimonials={testimonials} direction="left" />
      <div className="h-10" />
      <MovingRow testimonials={testimonials} direction="right" />
    </section>
  );
}
