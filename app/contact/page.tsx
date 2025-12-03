"use client";

import contactForm from "@/app/contact/contactForm";

export default function ContactPage() {
  const { form, errors, submitted, handleChange, handleSubmit } = contactForm();

  const faqs = [
    {
      q: "How fast do you respond?",
      a: "Our team usually replies within 1 business day (Mon–Fri, 9am–6pm ET).",
    },
    {
      q: "Do you offer phone support?",
      a: "Yes. Phone support is available for verified customers during business hours.",
    },
    {
      q: "Where can I find order or billing info?",
      a: "All invoices and order details are available in your account dashboard.",
    },
    {
      q: "How do I report a technical issue?",
      a: "Please email support@novatech.com. We appreciate responsible reporting.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f2c] via-[#0f163e] to-[#131a45] text-white px-6 py-16">

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-xl">
          Contact NovaTech
        </h1>
        <p className="mt-4 text-gray-300 max-w-xl mx-auto text-sm leading-relaxed">
          Need help with an order or product? Our support team is here to assist you.
          Browse answers below or send us a message.
        </p>
        <div className="mt-6 w-fit mx-auto px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-xs backdrop-blur">
          🛠️ Support • Service • Assistance
        </div>
      </section>

      {/* Layout Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column — Support Info */}
        <aside className="space-y-8">

          {/* Support Card */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur hover:shadow-cyan-400/20 transition">
            <h3 className="text-2xl font-bold text-cyan-300 mb-3">Support</h3>
            <p className="text-gray-300 text-sm">
              Available Monday–Friday  
              <br />9am–6pm ET
            </p>

            <div className="mt-5 space-y-4 text-gray-300">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Email
                </p>
                <a
                  href="mailto:support@novatech.com"
                  className="hover:text-cyan-300 transition"
                >
                  support@novatech.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Phone
                </p>
                <a
                  href="tel:+11234567890"
                  className="hover:text-cyan-300 transition"
                >
                  +1 (800) 555-0199
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Address
                </p>
                <p className="leading-relaxed">
                  500 NovaTech Plaza  
                  <br />Columbus, OH 43210
                </p>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur hover:shadow-purple-400/20 transition">
            <h3 className="text-2xl font-bold text-purple-300 mb-3">
              Hours & Status
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Typical response: <span className="text-cyan-300">1 business day</span></li>
              <li>
                • System uptime:{" "}
                <a href="#" className="text-purple-300 hover:underline">
                  status.novatech.com
                </a>
              </li>
              <li>
                • Help center:{" "}
                <a href="#" className="text-purple-300 hover:underline">
                  help.novatech.com
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-10">

          {/* FAQ */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur hover:shadow-blue-400/20 transition">
            <h3 className="text-2xl font-bold text-cyan-300 mb-3">
              Frequently Asked Questions
            </h3>

            <div className="mt-4 divide-y divide-white/10">
              {faqs.map((item, idx) => (
                <details key={idx} className="group py-4 cursor-pointer">
                  <summary className="flex justify-between items-center text-gray-200 text-sm">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-45 transition">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-400 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur hover:shadow-blue-400/20 transition">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Send us a message
            </h3>

            {submitted && (
              <div className="mb-4 bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg">
                Thanks! Your message has been sent.
              </div>
            )}

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name */}
              <div>
                <label className="text-sm">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-lg bg-white/5 border px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400 ${
                    errors.name ? "border-red-500" : "border-white/20"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-lg bg-white/5 border px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400 ${
                    errors.email ? "border-red-500" : "border-white/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-lg bg-white/5 border px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400 ${
                    errors.subject ? "border-red-500" : "border-white/20"
                  }`}
                >
                  <option value="" disabled>
                    Choose a topic…
                  </option>
                  <option>Billing</option>
                  <option>Technical Support</option>
                  <option>Sales</option>
                  <option>General Question</option>
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="text-sm">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help…"
                  className={`mt-1 w-full rounded-lg bg-white/5 border px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400 ${
                    errors.message ? "border-red-500" : "border-white/20"
                  }`}
                />
              </div>

              {/* Agreement + Submit */}
              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <label className="text-xs text-gray-300 flex items-center gap-2">
                  <input type="checkbox" required className="h-4 w-4" />
                  I agree to the Privacy Policy.
                </label>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
