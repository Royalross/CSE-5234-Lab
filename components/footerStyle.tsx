// components/Footer.tsx
export default function footerStyle() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} CSE5234 Team 8. All rights reserved
        </p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="/about" className="hover:text-blue-600">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Contact
          </a>
          <a href="/privacy" className="hover:text-blue-600">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
