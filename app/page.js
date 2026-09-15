"use client";

import { useEffect, useRef, useState } from "react";

const STARTER = {
  role: "assistant",
  content: "alr 😭 why should i believe God exists?",
};

export default function Home() {
  const [messages, setMessages] = useState([STARTER]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conviction, setConviction] = useState(8);
  const [converted, setConverted] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading || converted) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages(m => [...m, { role: "assistant", content: data.reply }]);
      setConviction(data.conviction);
      if (data.converted) {
        setConverted(true);
        setRunning(false);
      }
    } catch (e) {
      setMessages(m => [...m, {
        role: "assistant",
        content: "yo 😭 my brain just lagged. try sending that again."
      }]);
    } finally {
      setLoading(false);
    }
  }

  function newGame() {
    setMessages([STARTER]);
    setInput("");
    setSeconds(0);
    setConviction(8);
    setConverted(false);
    setRunning(true);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span>✝</span> DISCIPLES</div>
        <button className="new" onClick={newGame}>New Debate</button>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">THE CHALLENGE</div>
          <h1>Convert the AI.</h1>
          <p>Make your case. Change its mind. Do it as fast as you can.</p>
        </div>
        <div className="stats">
          <div><small>TIME</small><strong>{fmt(seconds)}</strong></div>
          <div><small>CONVICTION</small><strong>{conviction}%</strong></div>
        </div>
      </section>

      <section className="game">
        <div className="card">
          <div className="chatHead">
            <div className="avatar">A</div>
            <div><b>AI Atheist</b><small>wants to believe, but isn't convinced</small></div>
            <div className="live"><i/> LIVE</div>
          </div>

          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`row ${m.role}`}>
                <div className="bubble">{m.content}</div>
              </div>
            ))}
            {loading && <div className="row assistant"><div className="bubble typing">•••</div></div>}
            {converted && (
              <div className="converted">
                <div className="cross">✝</div>
                <h2>CONVERTED</h2>
                <p>you convinced the AI.</p>
                <strong>{fmt(seconds)}</strong>
                <button onClick={newGame}>Try Again</button>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          <div className="composer">
            <input
              value={input}
              disabled={loading || converted}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={converted ? "Debate finished" : "make your argument..."}
            />
            <button onClick={send} disabled={loading || converted || !input.trim()}>↑</button>
          </div>
        </div>
      </section>

      <footer>DISCIPLES • Make your case. Earn the conversion.</footer>
    </main>
  );
}
