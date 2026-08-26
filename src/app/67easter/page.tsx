"use client";

import { useEffect, useState, useCallback } from "react";

const GLITCH_TEXTS = ["67", "ŠEST SEDAM", "ШЕСТ СЕДАМ", "67", "67", "67"];

const GRID_CELLS = Array.from({ length: 144 });

export default function SixtySevenPage() {
  const [intensity, setIntensity] = useState(1);
  const [glitchText, setGlitchText] = useState("67");
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number; speed: number }[]>([]);
  const [bgHue, setBgHue] = useState(260);

  const addFloater = useCallback(() => {
    setFloatingTexts((prev) => [
      ...prev.slice(-40),
      {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: 1.5 + Math.random() * 4,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        delay: Math.random() * 2,
        speed: 1 + Math.random() * 2,
      },
    ]);
  }, []);

  const handleClick = useCallback(() => {
    setIntensity((i) => Math.min(i + 0.6, 90));
    for (let i = 0; i < 8; i++) {
      setTimeout(addFloater, i * 30);
    }
  }, [addFloater]);

  useEffect(() => {
    const el = document.getElementById("shake-root");
    if (!el) return;

    let frame: number;
    const shake = () => {
      const factor = intensity;
      const x = (Math.random() - 0.5) * factor * 18;
      const y = (Math.random() - 0.5) * factor * 18;
      const r = (Math.random() - 0.5) * factor * 5;
      const s = 1 + (Math.random() - 0.5) * factor * 0.012;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
      frame = requestAnimationFrame(shake);
    };
    shake();
    return () => cancelAnimationFrame(frame);
  }, [intensity]);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitchText(GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)]);
    }, Math.max(60, 200 - intensity * 2));
    return () => clearInterval(t);
  }, [intensity]);

  useEffect(() => {
    const t = setInterval(() => {
      setBgHue((Math.random() * 360) | 0);
    }, Math.max(70, 800 - intensity * 9));
    return () => clearInterval(t);
  }, [intensity]);

  useEffect(() => {
    const t = setInterval(addFloater, 3000 / Math.max(1, intensity / 2.5));
    return () => clearInterval(t);
  }, [intensity, addFloater]);

  const glitchDuration = Math.max(0.05, 0.3 - intensity * 0.003);

  return (
    <div
      id="shake-root"
      className="min-h-screen overflow-hidden select-none cursor-pointer"
      style={{ backgroundColor: `hsl(${bgHue}, 85%, 7%)` }}
      onClick={handleClick}
    >
      <style>{`
        @keyframes glitch {
          0% { text-shadow: -5px 0 hsl(0,100%,55%), 5px 0 hsl(190,100%,55%); clip-path: inset(40% 0 60% 0); }
          20% { text-shadow: 5px 0 hsl(130,100%,55%), -5px 0 hsl(300,100%,55%); clip-path: inset(20% 0 40% 0); }
          40% { text-shadow: -7px 0 hsl(60,100%,55%), 7px 0 hsl(180,100%,55%); clip-path: inset(60% 0 20% 0); }
          60% { text-shadow: 7px 0 hsl(300,100%,55%), -7px 0 hsl(60,100%,55%); clip-path: inset(10% 0 70% 0); }
          80% { text-shadow: -5px 0 hsl(180,100%,55%), 5px 0 hsl(0,100%,55%); clip-path: inset(70% 0 10% 0); }
          100% { text-shadow: -5px 0 hsl(0,100%,55%), 5px 0 hsl(190,100%,55%); clip-path: inset(40% 0 60% 0); }
        }
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-20vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-bg {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* 67 wall — emerges as the chaos grows */}
      {intensity > 12 && (
        <div
          className="fixed inset-0 pointer-events-none z-0 grid place-items-center"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            opacity: Math.min(0.4, (intensity - 12) / 90),
            color: "rgba(255,255,255,0.22)",
            fontSize: "clamp(1rem, 2.5vw, 2.2rem)",
            textShadow: "0 0 12px rgba(255,255,255,0.25)",
            fontWeight: 900,
          }}
        >
          {GRID_CELLS.map((_, i) => (
            <span key={i} className="text-center leading-none">67</span>
          ))}
        </div>
      )}

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)`,
        }}
      />

      {/* Flash overlay */}
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
          67
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center">
        <h1
          style={{
            animation: `glitch ${glitchDuration}s infinite`,
            fontSize: `clamp(6rem, ${22 + intensity * 0.35}vw, 26rem)`,
          }}
          className="font-black leading-none text-white select-none"
        >
          {glitchText}
        </h1>

        <p className="text-sm text-white/25 mt-8 tracking-[0.3em] uppercase">
          klikni
        </p>
      </div>

      {/* TV static at high intensity */}
      {intensity > 20 && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            opacity: Math.min(0.5, intensity / 90),
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
