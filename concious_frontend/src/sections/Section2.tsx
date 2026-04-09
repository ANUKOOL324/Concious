import { useNavigate } from "react-router-dom";
import { Nbutton } from "../components/Nbutton";

export function Section2() {
  const navigate = useNavigate();
  return (
    <>
      <section
        id="features"
        className="relative min-h-screen p-6 md:p-10 bg-white"
      >
        <div className="relative min-h-screen rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
          <div
            className="absolute inset-0 z-0 bg-center bg-cover will-change-transform bg-fixed
            "
            style={{
              backgroundImage: "url('/jakk.png')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/30" />
          <div className="relative z-30 px-6 py-10 max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-medium text-white mb-20 text-center tracking-tighter">
              Features{" "}
              <span className="italic font-light text-5xl tracking-tighter">
                ( built for clarity )
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl transition hover:bg-white/15">
                <div className="text-4xl mb-4">🔗</div>

                <h3 className="text-2xl font-semibold mb-3">
                  Unified Content Vault
                </h3>

                <ul className="text-gray-300 leading-relaxed space-y-2 text-sm">
                  <li>• Save YouTube, Twitter, Spotify, articles & podcasts</li>
                  <li>
                    • One intentional space instead of scattered bookmarks
                  </li>
                  <li>
                    • Content stored for reflection, not endless scrolling
                  </li>
                  <li>• Better than Old Bookmark, Watch later option</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl transition hover:bg-white/15">
                <div className="text-4xl mb-4">🧠</div>

                <h3 className="text-2xl font-semibold mb-3">AI-Mode</h3>

                <ul className="text-gray-300 leading-relaxed space-y-2 text-sm">
                  <li>• Semantic Searching </li>
                  <li>• Ask questions related to your content</li>
                  <li>• Chat with your saved knowledge via Ashqnor</li>
                  <li>• Understand connections across your content</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl transition hover:bg-white/15">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-2xl font-semibold mb-3">
                  Intentional Mode (Beta)
                </h3>
                <ul className="text-gray-300 leading-relaxed space-y-2 text-sm">
                  <li>• Track how and what you consume online</li>
                  <li>• Balance short-form vs long-form content</li>
                  <li>• Screen-time quality over quantity</li>
                  <li>• Generate clarity & brain-health reports</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Nbutton
                onClose={() => navigate("/Why")}
                text="Why Concious?"
                css="bg-white/10 backdrop-blur-none border border-white/30 text-white px-10 py-4 text-lg rounded-full shadow-xl hover:bg-white/20 hover:border-white/50 transitionduration-300"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
