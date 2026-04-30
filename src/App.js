import { useState, useEffect } from "react";

// 🔊 點擊音效（網路音效）
const hitSound = new Audio(
  "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
);

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [best, setBest] = useState(
    Number(localStorage.getItem("bestScore") || 0)
  );

  // ⏱ 倒數計時
  useEffect(() => {
    if (!active) return;
    if (timeLeft === 0) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  // 🎮 開始遊戲
  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setActive(true);
    move();
  };

  // ⚡ 閃電亂跑
  const move = () => {
    setPos({
      x: Math.random() * 80,
      y: Math.random() * 80,
    });
  };

  // ✅ 點到
  const hit = () => {
    hitSound.currentTime = 0;
    hitSound.play();

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
      {/* 🔹 動畫 CSS */}
      <style>
        {`
        @keyframes pop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        `}
      </style>

      <div style={styles.card}>
        <h2>⚡ 青春反應力 ⚡</h2>
        <p>30 秒內狂點閃電</p>

        <div style={styles.info}>
          <span>分數：{score}</span>
          <span>時間：{timeLeft}s</span>
        </div>

        <div style={styles.gameArea}>
          {active && (
            <button
              onClick={hit}
              style={{
                ...styles.bolt,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              ⚡
            </button>
          )}
        </div>

        {!active ? (
          <button style={styles.startBtn} onClick={start}>
            開始遊戲
          </button>
        ) : (
          <p>快點擊！👀</p>
        )}

        {!active && timeLeft === 0 && (
          <>
            <h3>🎉 本局得分：{score}</h3>
            <p>🏆 最高分紀錄：{best}</p>
          </>
        )}
      </div>
    </div>
  );
}

// 🎨 樣式
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9a8d4, #c084fc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  card: {
    width: 340,
    background: "white",
    borderRadius: 18,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    fontWeight: "bold",
  },
  gameArea: {
    position: "relative",
    height: 220,
    background: "#f3f4f6",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  bolt: {
    position: "absolute",
    fontSize: 38,
    background: "none",
    border: "none",
    cursor: "pointer",
    animation: "pop 0.3s ease-out",
  },
  startBtn: {
    padding: "8px 16px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#a855f7",
    color: "white",
    cursor: "pointer",
  },
};

export default App;