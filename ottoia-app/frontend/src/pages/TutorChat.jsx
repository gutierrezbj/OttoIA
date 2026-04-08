import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { toast } from "sonner";
import { ArrowLeft, Send, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const TutorChat = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [childId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading && !initialLoading) {
      inputRef.current?.focus();
    }
  }, [loading, initialLoading]);

  const fetchData = async () => {
    try {
      const [childRes, historyRes] = await Promise.all([
        axios.get(`${API}/children/${childId}`, { withCredentials: true }),
        axios.get(`${API}/chat/${childId}/history?limit=20`, { withCredentials: true })
      ]);

      setChild(childRes.data);

      if (historyRes.data.length > 0) {
        setMessages(historyRes.data);
      } else {
        setMessages([{
          message_id: "welcome",
          role: "assistant",
          content: `¡Hola! Soy tu tutor y estoy aquí para ayudarte. Puedes preguntarme cualquier duda sobre tus tareas o lo que quieras aprender. ¿En qué puedo ayudarte hoy?`
        }]);
      }

      setInitialLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setInitialLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      message_id: `temp_${Date.now()}`,
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat/${childId}`, {
        message: userMessage.content,
        context: "homework"
      }, { withCredentials: true });

      setMessages(prev => [...prev, {
        message_id: `assistant_${Date.now()}`,
        role: "assistant",
        content: response.data.message
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { text: "Explícame las fracciones", icon: "📐" },
    { text: "Ayúdame con un problema", icon: "🧮" },
    { text: "¿Qué son los verbos?", icon: "📖" }
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] child-theme flex flex-col">
      <header className="bg-white border-b-4 border-black p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button
            data-testid="back-btn"
            variant="ghost"
            onClick={() => navigate(`/child/${childId}`)}
            className="text-[#2B2D42]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4CC9F0] border-3 border-black rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Tu Tutor
            </span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.message_id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 bg-[#4CC9F0] border-3 border-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-10 h-10 bg-[#4CC9F0] border-3 border-black rounded-full flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="chat-bubble-assistant">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#8D99AE] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#8D99AE] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                  <span className="w-2 h-2 bg-[#8D99AE] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-[#8D99AE] mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Ideas para empezar:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  data-testid={`quick-prompt-${index}`}
                  onClick={() => {
                    setInput(prompt.text);
                  }}
                  className="px-4 py-2 bg-white border-3 border-black rounded-full text-sm font-medium hover:bg-[#4CC9F0] transition-colors"
                >
                  {prompt.icon} {prompt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t-4 border-black p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            ref={inputRef}
            autoFocus
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            className="flex-1 border-3 border-black rounded-full px-6 h-12 text-lg"
            disabled={loading}
          />
          <Button
            data-testid="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-clay h-12 px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;
