"use client";
import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const SPEEDS = [1, 1.5, 2];
const fmt = (s) => {
  s = Math.max(0, Math.round(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function AudioPlayer({ src, seed = 1, dur = 0, mine = false }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [total, setTotal] = useState(dur || 0);
  const [speed, setSpeed] = useState(0);

  const bars = Array.from({ length: 32 }, (_, i) => 22 + ((seed * 53 + i * 97 + i * i * 31) % 78));
  const ratio = total > 0 ? Math.min(time / total, 1) : 0;
  const on = mine ? "var(--mine-accent, #128c7e)" : "var(--accent)";
  const off = mine ? "color-mix(in srgb, var(--mine-ink, #1f2937) 25%, transparent)" : "var(--line)";

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      document.querySelectorAll("audio").forEach((x) => x !== a && x.pause());
      a.playbackRate = SPEEDS[speed];
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }

  function seek(e) {
    const a = audio.current;
    if (!a || !total) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    a.currentTime = x * total;
    setTime(a.currentTime);
  }

  function cycle() {
    const n = (speed + 1) % SPEEDS.length;
    setSpeed(n);
    if (audio.current) audio.current.playbackRate = SPEEDS[n];
  }

  return (
    <div className="flex w-60 max-w-full items-center gap-3 py-1">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setTime(0); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (isFinite(d) && d > 0) setTotal(d);
        }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar" : "Reproducir"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition active:scale-90"
        style={{ background: mine ? "var(--mine-accent, #128c7e)" : "var(--brand)", color: mine ? "#fff" : "var(--bg)" }}
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div onClick={seek} className="flex h-8 cursor-pointer items-center gap-[2px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full"
              style={{ height: h + "%", maxWidth: 4, background: (i + 0.5) / bars.length <= ratio ? on : off, transition: "background .15s" }}
            />
          ))}
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[10px] opacity-75">
          <span>{playing || time > 0 ? fmt(time) : fmt(total)}</span>
          <button onClick={cycle} className="rounded-full border border-current px-1.5 leading-4">
            {SPEEDS[speed]}x
          </button>
        </div>
      </div>
    </div>
  );
}