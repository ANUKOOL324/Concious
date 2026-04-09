import { PricingSection } from "./Pricingsection";

export function Section4() {
  return (
    <section
      id="features"
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
          "
          style={{
            backgroundImage: "url('/yakk.png')",
          }}
        />
        <PricingSection/>
      </div>
    </section>
  );
}