"use client";

import { useState, useRef, useEffect } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function ChatBox() {
  const { messages, sendMessage, connected } = useChatSocket();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-[#0f0f0f] border border-[#222] rounded-xl shadow-xl flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            XSPACE AI Chatbot
          </h2>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              connected
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm">
              Ask anything about XSPACE Technologies…
            </p>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.startsWith("You:");

            return (
              <div
                key={i}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-[#1a1a1a] text-gray-200 rounded-bl-none"
                  }`}
                >
                  {isUser ? msg.replace("You: ", "") : msg}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#222] px-4 py-3 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about XSPACE Technologies..."
            className="flex-1 bg-[#111] text-white text-sm px-4 py-2 rounded-lg outline-none border border-[#333] focus:border-blue-600"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
