import { TestimonialsSection } from "./testimonials/TestimonialsSection";

export function Section3() {
  return (
    <section
      id="testimonial"
      className="
        relative
        min-h-screen
        p-6
        md:p-10
        bg-white
      "
    >
      <div
        className="
          relative
          min-h-screen
          rounded-3xl
          overflow-hidden
          border
          border-gray-200
          shadow-xl
        "
      >
        <div
          className="
            absolute
            inset-0
            z-0
            bg-center
            bg-cover
            will-change-transform
            bg-fixed
            flex flex-col justify-center items-center
          "
          style={{
            backgroundImage: "url('/bakk.png')",
          }}
        />
        <TestimonialsSection />
      </div>
    </section>
  );
}
