"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const schoolLogos = [
  "/schools/school1.png",
  "/schools/school2.png",
  "/schools/school3.png",
  "/schools/school4.png",
  "/schools/school5.png",
  "/schools/school6.png",
  "/schools/school7.png",
  "/schools/school8.png",
  "/schools/school9.png",
];

export default function Hero() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let scroll = 0;
    const speed = 1;

    const tick = () => {
      scroll += speed;
      if (scroll >= ticker.scrollWidth / 2) scroll = 0;
      ticker.style.transform = `translateX(-${scroll}px)`;
      requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-blue-700 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">National School Portal</h1>
        <p className="text-xl mb-8">Explore schools, resources & connections all in one place.</p>
        <a href="#schools" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full">
          Explore Schools
        </a>
      </section>
      <section id="schools" className="py-12 bg-gray-100 overflow-hidden">
        <h2 className="text-3xl text-center font-bold mb-6">Our Schools</h2>
        <div className="flex gap-8 whitespace-nowrap" ref={tickerRef}>
          {schoolLogos.concat(schoolLogos).map((src, i) => (
            <Image key={i} src={src} width={120} height={80} alt={`Logo ${i + 1}`} />
          ))}
        </div>
      </section>
      <section className="py-20 grid md:grid-cols-3 gap-12 px-8 bg-white text-center">
        <div>
          <Image src="/icons/learning.png" alt="Programs" width={64} height={64} />
          <h3 className="font-bold text-xl mt-4">Programs</h3>
          <p>Find info on school programs and activities.</p>
        </div>
        <div>
          <Image src="/icons/student.png" alt="Resources" width={64} height={64} />
          <h3 className="font-bold text-xl mt-4">Student Resources</h3>
          <p>Study tools, schedules & guidance.</p>
        </div>
        <div>
          <Image src="/icons/connection.png" alt="Connect" width={64} height={64} />
          <h3 className="font-bold text-xl mt-4">Connect Schools</h3>
          <p>Interact with students & teachers nationwide.</p>
        </div>
      </section>
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">In Action</h2>
        <div className="grid md:grid-cols-3 gap-6 px-8">
          <Image src="/images/classroom1.jpg" width={400} height={300} alt="Classroom 1" />
          <Image src="/images/classroom2.jpg" width={400} height={300} alt="Classroom 2" />
          <Image src="/images/classroom3.jpg" width={400} height={300} alt="Classroom 3" />
        </div>
      </section>
      <footer className="bg-blue-900 text-white text-center py-12">
        <p>&copy; 2026 National School Portal</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}