import BackgroundWrapper from "./wrapper";

export default function WhyConsciousHero() {
  return (
    <BackgroundWrapper
      backgroundImage="/hero.jpeg"
      className="
        rounded-3xl
        py-10
        px-6
        mb-10
      "
    >
      <div className="text-center max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-bold tracking-tighter mb-2 text-white">
          Why Concious exists
        </h1>

        <p className="text-xl md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
          The internet doesn&apos;t exhaust us because we use it —
          <br />
          it exhausts us because we consume it{" "}
          <span className="text-purple-400 font-semibold">unconsciously</span>.
        </p>
      </div>
    </BackgroundWrapper>
  );
}
