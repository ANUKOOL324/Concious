import { ProductFAQSection } from "./ProductFAQSection";

export function Section5() {
  return (
    <section id="faqs" className="bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-stone-200 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div
          className="absolute inset-0 bg-center bg-cover lg:bg-fixed"
          style={{
            backgroundImage: "url('/cakk.png')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,10,16,0.62)_0%,_rgba(11,10,16,0.78)_100%)]" />
        <ProductFAQSection />
      </div>
    </section>
  );
}
