export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative px-6 py-15 bg-black/10 text-white"
    >
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter">
          Simple pricing for <span className="text-purple-400">Concious</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Start free. Upgrade when Ashqnor becomes essential to your thinking.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col">
          <h3 className="text-2xl font-semibold mb-2">Free</h3>
          <p className="text-gray-400 mb-6">
            For organizing links and basic discovery
          </p>

          <div className="text-4xl font-bold mb-8">
            ₹0
            <span className="text-lg font-normal text-gray-400"> / month</span>
          </div>

          <ul className="space-y-4 text-gray-300 flex-1">
            <li>✔ Save YouTube, Twitter, Spotify links</li>
            <li>✔ Manual folders & tags</li>
            <li>✔ Basic keyword search</li>
            <li className="text-gray-500">✖ Ashqnor AI chatbot</li>
            <li className="text-gray-500">✖ Semantic search</li>
            <li className="text-gray-500">✖ Smart recommendations</li>
          </ul>

          <button className="mt-10 w-full rounded-xl bg-white/10 hover:bg-white/20 transition py-3">
            Get Started
          </button>
        </div>

        <div className="relative rounded-3xl border border-purple-500/40 bg-linear-to-b from-purple-500/20 to-white/5 backdrop-blur-xl p-8 flex flex-col shadow-2xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-sm px-4 py-1 rounded-full">
            Most Popular
          </div>

          <h3 className="text-2xl font-semibold mb-2">Premium</h3>
          <p className="text-gray-300 mb-6">For thinkers powered by AI</p>

          <div className="text-4xl font-bold mb-8">
            ₹399
            <span className="text-lg font-normal text-gray-300"> / month</span>
          </div>

          <ul className="space-y-4 text-gray-200 flex-1">
            <li>✔ Everything in Free</li>
            <li>✔ Ashqnor AI chatbot</li>
            <li>✔ Semantic search (meaning-based)</li>
            <li>✔ AI-powered recommendations</li>
            <li>✔ Unlimited saved content</li>
            <li>✔ Faster indexing</li>
          </ul>

          <button className="mt-10 w-full rounded-xl bg-purple-600 hover:bg-purple-700 transition py-3 font-semibold">
            Upgrade to Premium
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col">
          <h3 className="text-2xl font-semibold mb-2">Custom</h3>
          <p className="text-gray-400 mb-6">Built for teams & organizations</p>

          <div className="text-4xl font-bold mb-8">Custom</div>

          <ul className="space-y-4 text-gray-300 flex-1">
            <li>✔ Everything in Premium</li>
            <li>✔ Team & multi-user access</li>
            <li>✔ Custom AI workflows</li>
            <li>✔ Dedicated support</li>
            <li>✔ SLA & priority features</li>
            <li>✔ Usage-based pricing</li>
          </ul>

          <button className="mt-10 w-full rounded-xl bg-white/10 hover:bg-white/20 transition py-3">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}
