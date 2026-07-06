import { TestimonialsSection } from "./testimonials/TestimonialsSection";

export function Section3() {
  return (
    <section id="testimonial" className="bg-white px-3 py-3 sm:px-5 sm:py-4 md:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-stone-200 shadow-[0_16px_40px_rgba(15,23,42,0.1)] md:rounded-[1.85rem] lg:rounded-[2rem] sm:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
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
