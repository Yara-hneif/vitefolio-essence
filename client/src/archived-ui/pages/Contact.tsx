export default function Contact() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#fff8e7] via-[#fdeff2] to-[#ffffff] flex items-center justify-center px-6 text-gray-800">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">📬 Contact Me</h1>
        <p className="text-lg opacity-90 mb-6">Have a question or want to work together? Let's talk!</p>

        <form className="space-y-4 text-left">
          <input type="text" placeholder="Your Name" className="w-full p-2 rounded bg-white text-black" />
          <input type="email" placeholder="Your Email" className="w-full p-2 rounded bg-white text-black" />
          <textarea placeholder="Your Message" className="w-full p-2 rounded bg-white text-black h-32"></textarea>
          <button className="px-6 py-2 bg-white text-pink-600 font-semibold rounded shadow hover:bg-gray-200 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
