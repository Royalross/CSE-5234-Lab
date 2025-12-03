import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-[#1a1f35] via-[#111827] to-[#1e1b4b] text-white">
      {/* HERO SECTION */}
      <section className="relative text-center py-28 px-6 overflow-hidden">
        {/* Futuristic Glow */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Title */}
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-xl">
            NovaTech Marketplace
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Next-generation laptops, peripherals, and accessories engineered for
            performance, precision, and modern digital lifestyles.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex items-center justify-center gap-6">
            {/* Primary CTA */}
            <Link
              href="/products"
              className="px-10 py-3 rounded-full text-white font-semibold 
              bg-gradient-to-r from-cyan-400 to-blue-500 
              shadow-[0_0_20px_rgba(56,189,248,0.45)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)]
              hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Explore Products
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/about"
              className="px-10 py-3 rounded-full font-semibold border border-cyan-300/40 
              bg-white/5 backdrop-blur-sm text-cyan-200 
              hover:bg-white/10 hover:border-cyan-200 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="rounded-2xl bg-white/5 border border-cyan-300/10 p-8 text-center shadow-lg
        hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition">
          <h3 className="text-2xl font-semibold text-cyan-300 mb-2">
            Premium Selection
          </h3>
          <p className="text-gray-300">
            Curated tech essentials crafted for exceptional quality and advanced performance.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-white/5 border border-purple-300/10 p-8 text-center shadow-lg
        hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition">
          <h3 className="text-2xl font-semibold text-purple-300 mb-2">
            Rapid Checkout
          </h3>
          <p className="text-gray-300">
            A seamless, secure shopping experience powered by next-gen optimization.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-white/5 border border-pink-300/10 p-8 text-center shadow-lg
        hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] transition">
          <h3 className="text-2xl font-semibold text-pink-300 mb-2">
            24/7 Support
          </h3>
          <p className="text-gray-300">
            Reliable, friendly assistance ready to help you anytime, anywhere.
          </p>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-3xl border border-blue-300/10 bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81]
        p-10 shadow-xl hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] transition">
          <h3 className="text-3xl font-bold text-cyan-300 mb-3">
            Ready to Upgrade Your Gear?
          </h3>
          <p className="text-gray-300 mb-8">
            Browse our latest arrivals and experience a futuristic shopping journey.
          </p>

          <Link
            href="/products"
            className="px-10 py-3 rounded-full
            bg-gradient-to-r from-purple-400 to-blue-500 
            text-white font-semibold
            shadow-[0_0_20px_rgba(139,92,246,0.4)]
            hover:shadow-[0_0_35px_rgba(139,92,246,0.7)]
            hover:scale-105 active:scale-95 transition-all"
          >
            Browse New Arrivals
          </Link>
        </div>
      </section>
    </main>
  );
}

