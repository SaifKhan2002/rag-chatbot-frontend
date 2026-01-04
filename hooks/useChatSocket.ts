import { useEffect, useRef, useState } from "react";

export function useChatSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat");

    socketRef.current.onopen = () => {
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socketRef.current.onclose = () => {
      setConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socketRef.current && connected) {
      socketRef.current.send(message);
      setMessages((prev) => [...prev, `You: ${message}`]);
    }
  };

  return { messages, sendMessage, connected };
}
