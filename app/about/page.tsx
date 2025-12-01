"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#0a0f2c] via-[#0f163e] to-[#131a45] text-white">
      
      {/* Title Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-xl">
          About NovaTech
        </h1>

        <p className="text-gray-300 mt-4 text-sm max-w-xl mx-auto leading-relaxed">
          We are a next-generation online tech retailer dedicated to empowering 
          students and professionals with reliable, high-performance products.
        </p>

        <div className="mt-6 w-fit mx-auto px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-xs shadow-md backdrop-blur">
          🚀 Tech Meets Innovation
        </div>
      </section>

      {/* Mission / Vision / Strategy */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
        {/* Mission */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Our Mission</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Deliver high-quality tech products with a frictionless shopping
            experience tailored for every customer.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition">
          <h2 className="text-xl font-bold text-purple-300 mb-2">Our Vision</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Become the most trusted online destination for tech essentials,
            empowering the next generation of innovators.
          </p>
        </div>

        {/* Strategy */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 transition">
          <h2 className="text-xl font-bold text-pink-300 mb-2">Our Strategy</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            We combine modern web technologies, customer insights, and data-driven
            decisions to continuously evolve and improve.
          </p>
        </div>
      </section>

      {/* Executive Team */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-md">
          Meet Our Leadership Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Member 1 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur hover:shadow-cyan-400/30 hover:-translate-y-1 transition-all">
            <Image
              src="/craig.jpg"
              alt="Craig Chen"
              width={200}
              height={200}
              className="rounded-full mx-auto border border-white/20 shadow-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-center">Craig Chen</h3>
            <p className="text-sm text-gray-300 text-center">Back-End Engineer</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Specialized in API design & scalable systems.
            </p>
          </div>

          {/* Member 2 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur hover:shadow-cyan-400/30 hover:-translate-y-1 transition-all">
            <Image
              src="/leo.jpg"
              alt="Leo Chen"
              width={200}
              height={200}
              className="rounded-full mx-auto border border-white/20 shadow-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-center">Leo Chen</h3>
            <p className="text-sm text-gray-300 text-center">Back-End Developer</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Focused on robust data pipelines & system performance.
            </p>
          </div>

          {/* Member 3 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur hover:shadow-purple-400/30 hover:-translate-y-1 transition-all">
            <Image
              src="/lughan.jpg"
              alt="Lughan Ross"
              width={200}
              height={200}
              className="rounded-full mx-auto border border-white/20 shadow-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-center">Lughan Ross</h3>
            <p className="text-sm text-gray-300 text-center">UI/UX Designer</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Designs intuitive experiences with modern aesthetics.
            </p>
          </div>

          {/* Member 4 */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur hover:shadow-pink-400/30 hover:-translate-y-1 transition-all">
            <Image
              src="/regis.jpg"
              alt="Regis Chen"
              width={200}
              height={200}
              className="rounded-full mx-auto border border-white/20 shadow-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-center">Regis Chen</h3>
            <p className="text-sm text-gray-300 text-center">QA Engineer</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Ensures reliability through rigorous testing & validation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
