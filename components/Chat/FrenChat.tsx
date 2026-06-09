'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { useFren } from "@/hooks/useFren";
import "./FrenChat.css";

export default function FrenChat() {
  // Extract functions and states from the hook
  const { messages, sendMessage, loading } = useFren();
  const [input, setInput] = useState("");
  const [isLocked, setIsLocked] = useState(false)
  const [isTakingLong, setIsTakingLong] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load locked state from localStorage on mount
  useEffect(() => {
    const savedLockedState = localStorage.getItem('frenChatLocked');
    if (savedLockedState === 'true') {
      setIsLocked(true);
    }
  }, []);

  // Save locked state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('frenChatLocked', isLocked.toString());
  }, [isLocked]);

  // Automatic scroll to the end of messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show "taking long" message after 8 seconds of loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setIsTakingLong(true), 8500);
      return () => clearTimeout(timer);
    }
    setIsTakingLong(false);
  }, [loading]);

  const formatBold = useCallback((text: string) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;

    sendMessage(text); // Comes from the useFren hook
    setInput("");
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "46px";
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const hasVeredicto = messages.some(msg =>
      msg.role === 'assistant' && msg.content.includes("[VEREDICTO_FINAL]")
    );
    if (hasVeredicto) setIsLocked(true);
  }, [messages]);

  return (
    <div className="chat-page-shell" style={{
      minHeight: "100dvh",
      width: "100%",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2444 50%, #0a1628 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "16px"
    }}>
      <div className="chat-wrapper">
        <header className="chat-header">
          <div className="logo-circle">🤝</div>
          <div className="header-text">
            <h1>El Fren de Pa'lante</h1>
            <p>Orientación vocacional · Activo</p>
          </div>
        </header>

        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              {msg.role === "assistant" && <div className="avatar">🤠</div>}
              <div className={`bubble ${msg.role}`} dangerouslySetInnerHTML={{ __html: formatBold(msg.content.replaceAll("[VEREDICTO_FINAL]", "").trim()) }} />
            </div>
          ))}
          {loading && (
            <div className="typing-indicator">
              <div className="avatar">🤠</div>
              <div className="dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              {isTakingLong && <div className="taking-long">El Fren está pensando...</div>}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area-wrapper">
          <div className="input-area">
            <textarea
              ref={inputRef}
              className="input-box"
              placeholder={isLocked ? "El proceso ha concluído" : "Chatea con El Fren..."}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "46px";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading || isLocked}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={loading || !input.trim() || isLocked}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
          <p className="disclaimer-text"><strong>El Fren</strong> es una IA y puede cometer errores.</p>
        </div>
      </div>
    </div>
  );
}
