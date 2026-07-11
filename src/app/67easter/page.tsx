"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

const GLITCH_TEXTS = ["67", "ŠEST SEDAM", "😂😂😂", "ШЕСТ СЕДАМ", "6️⃣7️⃣", "HAOS", "💀💀💀"];

const INTENSITY_LABELS = [
  { min: 0, text: "klikni ako smeš 🫵", color: "text-white/70" },
  { min: 1, text: "još jače! 🔥", color: "text-orange-300" },
  { min: 5, text: "NE PRESTAJ! ⚡", color: "text-yellow-300" },
  { min: 10, text: "POLUDEO SI! 🤪", color: "text-red-300" },
  { min: 15, text: "ŠEST SEDAM SEDAM SEDAM!!! 💀", color: "text-red-400" },
  { min: 25, text: "HAOS TOTALNI! 🔥🔥🔥", color: "text-purple-300" },
  { min: 40, text: "CRKNUO TI TELEFON! 📱💀", color: "text-pink-300" },
  { min: 60, text: "VIŠE NEMA POVRATKA 🌀", color: "text-cyan-300" },
];

export default function SixtySevenPage() {
  const [intensity, setIntensity] = useState(1);
  const [glitchText, setGlitchText] = useState("67");
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number; speed: number }[]>([]);
  const [bgHue, setBgHue] = useState(260);

  const currentLabel = useMemo(
    () => [...INTENSITY_LABELS].reverse().find((l) => intensity >= l.min) ?? INTENSITY_LABELS[0],
    [intensity]
  );

  const addFloater = useCallback(() => {
    setFloatingTexts((prev) => [
      ...prev.slice(-30),
      {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: 1.5 + Math.random() * 3,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        delay: Math.random() * 2,
        speed: 1 + Math.random() * 2,
      },
    ]);
  }, []);

  const handleClick = useCallback(() => {
    setIntensity((i) => Math.min(i + 0.5, 80));
    addFloater();
    for (let i = 0; i < 5; i++) {
      setTimeout(addFloater, i * 50);
    }
  }, [addFloater]);

  useEffect(() => {
    const el = document.getElementById("shake-root");
    if (!el) return;

    let frame: number;
    const shake = () => {
      const factor = intensity;
      const x = (Math.random() - 0.5) * factor * 15;
      const y = (Math.random() - 0.5) * factor * 15;
      const r = (Math.random() - 0.5) * factor * 4;
      const s = 1 + (Math.random() - 0.5) * factor * 0.01;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
      frame = requestAnimationFrame(shake);
    };
    shake();
    return () => cancelAnimationFrame(frame);
  }, [intensity]);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitchText(GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)]);
    }, 180);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBgHue((Math.random() * 360) | 0);
    }, 800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(addFloater, 3000 / Math.max(1, intensity / 3));
    return () => clearInterval(t);
  }, [intensity, addFloater]);

  return (
    <div
      id="shake-root"
      className="min-h-screen overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor: `hsl(${bgHue}, 80%, 8%)` }}
      onClick={handleClick}
    >
      <style>{`
        @keyframes glitch {
          0% { text-shadow: -4px 0 hsl(0,100%,50%), 4px 0 hsl(240,100%,50%); clip-path: inset(40% 0 60% 0); }
          20% { text-shadow: 4px 0 hsl(120,100%,50%), -4px 0 hsl(300,100%,50%); clip-path: inset(20% 0 40% 0); }
          40% { text-shadow: -6px 0 hsl(60,100%,50%), 6px 0 hsl(180,100%,50%); clip-path: inset(60% 0 20% 0); }
          60% { text-shadow: 6px 0 hsl(300,100%,50%), -6px 0 hsl(60,100%,50%); clip-path: inset(10% 0 70% 0); }
          80% { text-shadow: -4px 0 hsl(180,100%,50%), 4px 0 hsl(0,100%,50%); clip-path: inset(70% 0 10% 0); }
          100% { text-shadow: -4px 0 hsl(0,100%,50%), 4px 0 hsl(240,100%,50%); clip-path: inset(40% 0 60% 0); }
        }
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-20vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-bg {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        }}
      />

      {/* Random flash overlay */}
      {intensity > 5 && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ animation: "pulse-bg 0.15s infinite" }}
        />
      )}

      {/* Floating 67s */}
      {floatingTexts.map((f) => (
        <div
          key={f.id}
          className="fixed pointer-events-none z-20 font-black"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: `${f.size}rem`,
            color: f.color,
            animation: `float ${4 / f.speed}s infinite`,
            animationDelay: `${f.delay}s`,
            opacity: 0,
            textShadow: "0 0 20px currentColor",
          }}
        >
          {Math.random() > 0.3 ? "67" : "😂"}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center">
        <h1
          style={{
            animation: "glitch 0.3s infinite",
            fontSize: `clamp(6rem, ${20 + intensity * 0.3}vw, 25rem)`,
          }}
          className="font-black leading-none text-white select-none"
        >
          {glitchText}
        </h1>

        <p className={`text-xl sm:text-2xl mt-8 font-bold transition-all duration-300 ${currentLabel.color}`}>
          {currentLabel.text}
        </p>

        <p className="text-sm text-white/30 mt-4">klikni negde za haos</p>

        {intensity > 10 && (
          <div className="mt-8 flex gap-2 text-3xl animate-bounce">
            <span>🔥</span>
            <span>⚡</span>
            <span>💀</span>
            <span>🌀</span>
          </div>
        )}
      </div>

      {/* Vintage TV static effect at high intensity */}
      {intensity > 20 && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            opacity: Math.min(0.5, intensity / 80),
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
