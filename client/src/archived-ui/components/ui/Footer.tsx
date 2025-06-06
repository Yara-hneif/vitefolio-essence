// components/Footer.jsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm py-6 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* نص الحقوق */}
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} MyPortfolio. All rights reserved.
        </p>

        {/* روابط خارجية */}
        <div className="flex gap-4">
          <a
            href="https://github.com/Yara-hneif"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yara-hneif/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
