// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import { Shield, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolsMenu } from "./ToolsMenu";
import { MessageDisplay } from "./MessageDisplay";
import { InputArea } from "./InputArea";
import cfnLogo from "@/assets/CFN.jpg";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

/* ------------------------------------------------------------------
   Helper: envía el mensaje al webhook y devuelve **texto plano**.
   ------------------------------------------------------------------ */
const postToAI = async (mensaje: string): Promise<string> => {
  const url =
    "https://aan8nwebhook.abrahamdev.net/webhook/f09672cd-eb0f-4c69-8113-4f4bc7d4ea96";
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Mensaje: mensaje }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`API error ${resp.status}: ${txt}`);
  }
  return await resp.text();
};

export const ChatInterface: React.FC = () => {
  /* -------------------- ESTADO -------------------- */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bienvenido. ¿Cómo puedo acompañarte en tu caminar con Cristo hoy?",
      type: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------- REFS -------------------- */
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false); // flag síncrono

  /* -------------------- SCROLL / FOCUS -------------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => inputRef.current?.focus(), []);

  /* -------------------- ENVÍO DE MENSAJE -------------------- */
  const handleSendMessage = async () => {
    if (sendingRef.current || isLoading) return;
    if (!inputValue.trim()) return;

    sendingRef.current = true;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: "user",
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiReply = await postToAI(userMsg.content);
      if (!sendingRef.current) return; // safety en caso de doble mount
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiReply,
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((p) => [...p, aiMsg]);
    } catch (e: any) {
      console.error("Error al contactar la IA:", e);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        content:
          "❗ Hubo un error al obtener la respuesta. Por favor, intenta de nuevo.",
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((p) => [...p, errMsg]);
    } finally {
      setIsLoading(false);
      sendingRef.current = false;
      inputRef.current?.focus();
    }
  };

  /* -------------------- ENTER → ENVIAR -------------------- */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* -------------------- MAPEO HERRAMIENTA → TEXTO -------------------- */
  const handleToolSelect = (toolId: string) => {
    const toolMessages: Record<string, string> = {
      "verse-search": "Quiero buscar versículos bíblicos específicos",
      "bible-study": "Me gustaría hacer un estudio bíblico profundo",
      devotional: "Necesito una reflexión devocional",
      community: "Me interesa conectar con la comunidad",
      "create-images": "Quiero crear una imagen basada en la Biblia",
    };
    const txt = toolMessages[toolId];
    if (txt) {
      setInputValue(txt);
      inputRef.current?.focus();
    } else {
      console.warn(`Tool id "${toolId}" no tiene mensaje asociado`);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-background">
      {/* ==== BACKGROUNDS (fixed, no afectan al flow) ==== */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] pointer-events-none"></div>

      {/* ==== HEADER (siempre visible) ==== */}
      <header className="flex-none glass border-b border-white/10 backdrop-blur-3xl">
        <div className="flex items-center justify-between px-8 py-6">
          {/* LOGO + TÍTULO */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative glass-card rounded-2xl p-3 border border-accent/30">
                <img src={cfnLogo} alt="CFN Zumpango Tizayuca" className="h-12 w-auto" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-white/60 font-medium flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" /> IA Biblica <Star className="w-3 h-3 animate-pulse" />
              </p>
            </div>
          </div>

          {/* MENU DE HERRAMIENTAS */}
          <ToolsMenu onToolSelect={handleToolSelect} />
        </div>
      </header>

      {/* ==== AREA DE MENSAJES (scrollable) ==== */}
      <section className="flex-1 overflow-y-auto relative">
        {/* (el ScrollArea de shadcn ya envuelve scroll, pero aquí usamos overflow‑y‑auto directamente) */}
        <ScrollArea className="h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"></div>

          <div className="relative px-8 py-12">
            <div className="max-w-5xl mx-auto">
              <MessageDisplay messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </section>

      {/* ==== INPUT (siempre visible) ==== */}
      <footer className="flex-none p-8 bg-background/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto">
          <InputArea
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </div>
      </footer>
    </div>
  );
};