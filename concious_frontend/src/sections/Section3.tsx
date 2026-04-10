import { TestimonialsSection } from "./testimonials/TestimonialsSection";

export function Section3() {
  return (
    <section id="testimonial" className="bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-stone-200 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div
          className="absolute inset-0 bg-center bg-cover lg:bg-fixed"
          style={{
            backgroundImage: "url('/bakk.png')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(10,10,14,0.58)_0%,_rgba(10,10,14,0.72)_100%)]" />
        <TestimonialsSection />
      </div>
    </section>
  );
}
