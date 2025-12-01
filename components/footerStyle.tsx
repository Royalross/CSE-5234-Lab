export default function FooterStyle() {
  return (
    <footer className="
      bg-[#0B122C]/70 
      backdrop-blur-xl 
      border-t border-white/10
      text-gray-300 
      py-8 mt-20
    ">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left side text */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} NovaTech Marketplace — All Rights Reserved
        </p>

        {/* Links */}
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
          <a 
            href="/about" 
            className="hover:text-cyan-300 transition"
          >
            About
          </a>

          <a 
            href="/contact" 
            className="hover:text-cyan-300 transition"
          >
            Contact
          </a>

          <a 
            href="/privacy" 
            className="hover:text-cyan-300 transition"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
