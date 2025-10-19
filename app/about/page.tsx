"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center p-8 bg-background text-foreground">
      {/* Mission & Vision */}
      <section className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-4xl font-bold mb-6 text-primary">About Us</h1>

        <h2 className="text-2xl font-semibold mt-8 text-secondary-foreground">
          Our Mission
        </h2>
        <p className="mt-2 text-muted-foreground">
          To deliver high-quality and affordable online products with an
          excellent customer experience.
        </p>

        <h2 className="text-2xl font-semibold mt-8 text-secondary-foreground">
          Our Vision
        </h2>
        <p className="mt-2 text-muted-foreground">
          To become the most trusted online shopping platform for college
          students and young professionals.
        </p>

        <h2 className="text-2xl font-semibold mt-8 text-secondary-foreground">
          Our Strategy
        </h2>
        <p className="mt-2 text-muted-foreground">
          We leverage modern web technologies and data-driven decisions to
          continuously improve user satisfaction.
        </p>
      </section>

      {/* Meet Our Executives */}
      <section className="max-w-5xl w-full text-center">
        <h2 className="text-3xl font-bold mb-10 text-primary">
          Meet Our Executives
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Member 1 */}
          <div className="bg-card shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
            <Image
              src="/craig.jpg"
              alt="Craig Chen"
              width={180}
              height={180}
              className="rounded-full mx-auto object-cover"
              style={{ aspectRatio: "1 / 1" }}
            />
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Craig Chen
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Role:</strong> Back-End Developer
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Education:</strong> Computer Science, OSU
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Passion:</strong> Creating interactive web experiences
            </p>
          </div>

          {/* Member 2 */}
          <div className="bg-card shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
            <Image
              src="/member2.jpg"
              alt="Leo Chen"
              width={180}
              height={180}
              className="rounded-full mx-auto object-cover"
              style={{ aspectRatio: "1 / 1" }}
            />
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Leo Chen
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Role:</strong> Back-End Developer
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Education:</strong> Computer Science, OSU
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Passion:</strong> Building scalable systems and APIs
            </p>
          </div>

          {/* Member 3 */}
          <div className="bg-card shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
            <Image
              src=""
              alt="Lughan Ross"
              width={180}
              height={180}
              className="rounded-full mx-auto object-cover"
              style={{ aspectRatio: "1 / 1" }}
            />
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Lughan Ross
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Role:</strong> UI/UX Designer
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Education:</strong> Computer Science, OSU
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Passion:</strong> Designing clean and user-friendly
              interfaces
            </p>
          </div>

          {/* Member 4 */}
          <div className="bg-card shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
            <Image
              src="/regis.jpg"
              alt="Regis Chen"
              width={180}
              height={180}
              className="rounded-full mx-auto object-cover"
              style={{ aspectRatio: "1 / 1" }}
            />
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Regis Chen
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Role:</strong> QA Engineer
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Education:</strong> Computer Science, OSU
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Passion:</strong> Ensuring code reliability and
              performance
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
