import { useEffect, useRef, useState } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/chat";

export function useChatSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socketRef.current.onclose = () => {
      console.log("🔴 WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    socketRef.current.send(message);
    setMessages((prev) => [...prev, `You: ${message}`]);
  };

  return { messages, sendMessage, connected };
}
