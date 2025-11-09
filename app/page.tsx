import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-indigo-50 via-white to-blue-100">
      <section className="relative text-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 drop-shadow-sm">
            Welcome to Our Store
          </h1>
          <p className="mt-5 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover a curated collection of modern products and services built
            for simplicity, quality, and design.
          </p>
          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              href="/products"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
            >
              View Products
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-full border border-indigo-300 text-indigo-700 bg-white/60 backdrop-blur-sm hover:bg-indigo-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-100 shadow-md hover:shadow-lg transition p-8 text-center hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
            Great Selection
          </h3>
          <p className="text-gray-600">
            Explore carefully selected items that match your needs and reflect
            quality craftsmanship.
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-100 shadow-md hover:shadow-lg transition p-8 text-center hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
            Fast Checkout
          </h3>
          <p className="text-gray-600">
            Enjoy a smooth, secure, and simple checkout process built for
            efficiency and trust.
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-100 shadow-md hover:shadow-lg transition p-8 text-center hover:-translate-y-1">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
            Customer Support
          </h3>
          <p className="text-gray-600">
            Our dedicated team is always ready to assist you with quick,
            reliable help anytime you need it.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-100 via-white to-blue-100 p-10 shadow-sm hover:shadow-md transition">
          <h3 className="text-3xl font-bold text-indigo-700 mb-3">
            Start Shopping Today
          </h3>
          <p className="text-gray-600 mb-8">
            Browse our latest arrivals and experience a seamless online shopping
            experience.
          </p>
          <Link
            href="/products"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
