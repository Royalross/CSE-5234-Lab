import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full backdrop-blur-md bg-white/5 border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
            NovaTech
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6 text-sm">

          <Link
            href="/"
            className="text-gray-200 hover:text-cyan-300 transition duration-200"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-gray-200 hover:text-cyan-300 transition duration-200"
          >
            Products
          </Link>

          <Link
            href="/about"
            className="text-gray-200 hover:text-cyan-300 transition duration-200"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-gray-200 hover:text-cyan-300 transition duration-200"
          >
            Contact
          </Link>

          <Link
            href="/purchase/viewOrder"
            className="text-gray-200 hover:text-purple-300 transition duration-200"
          >
            Cart
          </Link>

          <Link
            href="/profile"
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20 text-gray-100 hover:from-cyan-500/40 hover:to-purple-500/40 transition shadow-md"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
