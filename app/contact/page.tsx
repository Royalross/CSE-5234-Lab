"use client";

import contactForm from "@/app/contact/contactForm";

export default function ContactPage() {
  const { form, errors, submitted, handleChange, handleSubmit } = contactForm();

  const faqs = [
    {
      q: "What is your typical response time?",
      a: "We reply within 1 business day (Monday–Friday, 9am–6pm ET).",
    },
    {
      q: "Do you offer phone support?",
      a: "Yes—phone support is available for Pro and Enterprise plans during business hours.",
    },
    {
      q: "Where can I find my invoices?",
      a: "Invoices are available in your account's Billing section. Contact us if you need an updated receipt.",
    },
    {
      q: "How do I report a security issue?",
      a: "Please email security@team8.com with details. We appreciate responsible disclosures.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-6 py-14">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 drop-shadow-sm">
            Contact Us
          </h1>
          <p className="mt-5 text-lg text-gray-700 max-w-2xl leading-relaxed">
            We're here to help. Browse quick answers below or send us a
            message—our team typically responds within one business day.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Info */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold text-indigo-700 mb-3">Support</h3>
            <p className="mt-2 text-gray-600">
              Our team is available Monday–Friday, 9am–6pm Eastern Time.
            </p>
            <div className="mt-4 space-y-3 text-gray-700">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <a
                  href="mailto:support@team8.com"
                  className="hover:underline break-all"
                >
                  support@team8.com
                </a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Phone
                </p>
                <a href="tel:+11234567890" className="hover:underline">
                  +1 (123) 456-7890
                </a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Address
                </p>
                <p>
                  123 Market Street, Suite 456
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold text-indigo-700 mb-3">
              Hours & Status
            </h3>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>• Standard response: within 1 business day</li>
              <li>
                • Urgent outages:{" "}
                <a className="text-blue-600 hover:underline" href="#">
                  status.team8.com
                </a>
              </li>
              <li>
                • Knowledge base:{" "}
                <a className="text-blue-600 hover:underline" href="#">
                  help.team8.com
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* FAQ + Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* FAQ */}
          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold text-indigo-700 mb-3">
              Frequently Asked Questions
            </h3>
            <div className="mt-4 divide-y">
              {faqs.map((item, idx) => (
                <details key={idx} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>{item.q}</span>
                    <span className="ml-4 text-gray-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold text-indigo-700 mb-3">
              Send us a message
            </h3>
            {submitted ? (
              <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200">
                Thanks! Your message has been sent. We'll get back to you soon.
              </div>
            ) : null}

            <form
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  required
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  value={form.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? "border-red-500" : "border-gray-300"}`}
                  value={form.subject}
                  onChange={handleChange}
                  aria-invalid={!!errors.subject}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                  required
                >
                  <option value="" disabled>
                    Choose a topic…
                  </option>
                  <option>Billing</option>
                  <option>Technical Support</option>
                  <option>Sales</option>
                  <option>General Question</option>
                </select>
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us what's going on and how we can help…"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? "border-red-500" : "border-gray-300"}`}
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  required
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    required
                  />
                  I agree to the processing of my information per the Privacy
                  Policy.
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
