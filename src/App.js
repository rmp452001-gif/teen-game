import { useState, useEffect } from "react";

const hitSound = new Audio("https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg");
const startSound = new Audio("https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg");

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [best, setBest] = useState(Number(localStorage.getItem("bestScore") || 0));
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (timeLeft === 0) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  const start = () => {
    startSound.currentTime = 0;
    startSound.play();
    setScore(0);
    setTimeLeft(30);
    setActive(true);
    move();
  };

  const move = () => {
    setPos({ x: Math.random() * 80, y: Math.random() * 80 });
  };

  const hit = () => {
    hitSound.currentTime = 0;
    hitSound.play();
    setShake(true);
    setTimeout(() => setShake(false), 120);

    const newScore = score + 1;
    setScore(newScore);
    move();

    if (newScore > best) {
      setBest(newScore);
      localStorage.setItem("bestScore", newScore);
    }
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={{ ...styles.card, animation: shake ? "shake 0.12s" : "none" }}>
        <div style={styles.title}>⚡ 反 應 力 爆 表 ⚡</div>
        <div style={styles.subtitle}>點爆我！點到手殘為止 🔥</div>

        <div style={styles.info}>
          <span>🔥 分數 {score}</span>
          <span>⏱ {timeLeft}s</span>
        </div>

        <div style={styles.progressWrap}>
          <div style={{ ...styles.progress, width: `${(timeLeft / 30) * 100}%` }} />
        </div>

        <div style={styles.gameArea}>
          {active && (
            <button
              onClick={hit}
              style={{ ...styles.bolt, left: `${pos.x}%`, top: `${pos.y}%` }}
              aria-label="bolt"
            >
              💥⚡
            </button>
          )}
        </div>

        {!active ? (
          <button style={styles.startBtn} onClick={start}>🚀 開 爆</button>
        ) : (
          <div style={styles.hint}>狂點！！！不要想 🤯</div>
        )}

        {!active && timeLeft === 0 && (
          <div style={styles.result}>
            <div>🎉 本局：{score}</div>
            <div>🏆 最高：{best}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
@keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes glow { 0%{filter: drop-shadow(0 0 0 #f0f);} 50%{filter: drop-shadow(0 0 12px #f0f);} 100%{filter: drop-shadow(0 0 0 #f0f);} }
@keyframes shake { 0%{transform: translate(0,0);} 50%{transform: translate(2px,-2px);} 100%{transform: translate(0,0);} }
`;

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#f472b6,#22d3ee)", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, -apple-system" },
  card: { width: 360, background: "rgba(0,0,0,.65)", borderRadius: 22, padding: 18, color: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,.5)", backdropFilter: "blur(6px)", border: "2px solid rgba(255,0,255,.35)" },
  title: { textAlign: "center", fontSize: 22, letterSpacing: 2, textShadow: "0 0 12px #f0f" },
  subtitle: { textAlign: "center", opacity: .85, marginBottom: 10 },
  info: { display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 6 },
  progressWrap: { height: 8, background: "#111", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 0 6px rgba(255,255,255,.2)" },
  progress: { height: "100%", background: "linear-gradient(90deg,#22d3ee,#f472b6)", transition: "width .3s" },
  gameArea: { position: "relative", height: 220, marginTop: 10, background: "radial-gradient(circle at 50% 30%, #111 0%, #000 70%)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.15)" },
  bolt: { position: "absolute", fontSize: 34, padding: 6, background: "transparent", border: "none", cursor: "pointer", animation: "pop .2s ease-out, glow .8s ease-in-out" },
  startBtn: { width: "100%", marginTop: 10, padding: 10, background: "linear-gradient(90deg,#a855f7,#ec4899)", color: "#fff", border: "none", borderRadius: 12, fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 0 18px rgba(236,72,153,.6)" },
  hint: { textAlign: "center", opacity: .9, marginTop: 6 },
  result: { display: "flex", justifyContent: "space-between", marginTop: 8, fontWeight: 900 }
};

export default App;