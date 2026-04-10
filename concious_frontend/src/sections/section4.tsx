import { PricingSection } from "./Pricingsection";

export function Section4() {
  return (
    <section id="pricing" className="bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-stone-200 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div
          className="absolute inset-0 bg-center bg-cover lg:bg-fixed"
          style={{
            backgroundImage: "url('/yakk.png')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(12,10,18,0.58)_0%,_rgba(12,10,18,0.74)_100%)]" />
        <PricingSection />
      </div>
    </section>
  );
}
