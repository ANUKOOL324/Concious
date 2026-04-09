import { ProductFAQSection } from "./ProductFAQSection";

export function Section5() {
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
            left-[7vh] right-[10vh] h-[142vh] 
            
          "
          style={{
            backgroundImage: "url('/cakk.png')",
          }}
        />
        <ProductFAQSection />
      </div>
    </section>
  );
}
