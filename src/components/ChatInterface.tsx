// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolsMenu } from "./ToolsMenu";
import { MessageDisplay } from "./MessageDisplay";
import { InputArea } from "./InputArea";
import cfnLogo from "@/assets/CFN.jpg";
import { useSessionUuid } from "@/hooks/useSessionUuid";
import { postToAI } from "@/api/ai";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

/* ------------------------------------------------------------------
   ChatInterface – ahora usa el UUID de sesión
   ------------------------------------------------------------------ */
export const ChatInterface: React.FC = () => {
  /* -------------------- SESSION -------------------- */
  const { sessionUuid, resetSession } = useSessionUuid();

  /* -------------------- ESTADO -------------------- */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bienvenido a CFN AI, soy hermano David bot ¿Cómo puedo acompañarte en tu caminar con Cristo hoy?",
      type: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------- REFS -------------------- */
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

  /* -------------------- SCROLL / FOCUS -------------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => inputRef.current?.focus(), []);

  /* -------------------- REINICIO DE SESIÓN --------------------
     Si la sesión se reinicia (p.ej. usuario cambió la query‑string), 
     limpiamos la conversación para que empiece de cero.
   -------------------------------------------------------------------- */
  useEffect(() => {
    // Cuando `sessionUuid` cambie a `null` (solo en caso de reset) borramos todo
    if (!sessionUuid) {
      setMessages([
        {
          id: "1",
          content:
            "Bienvenido a CFN AI, soy hermano David bot ¿Cómo puedo acompañarte en tu caminar con Cristo hoy?",
          type: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [sessionUuid]);

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
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiReply = await postToAI(userMsg.content, sessionUuid);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiReply,
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      console.error("Error al contactar la IA:", e);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        content:
          "❗ Hubo un error al obtener la respuesta. Por favor, intenta de nuevo.",
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
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

  /* -------------------- HERRAMIENTAS -------------------- */
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
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      {/* -------------------- BACKGROUNDS -------------------- */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] pointer-events-none"></div>

      {/* -------------------- HEADER -------------------- */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-3 py-1 bg-background/80 backdrop-blur-md z-10 h-14">
        <img src={cfnLogo} alt="CFN Zumpango Tizayuca" className="h-9 sm:h-11 w-auto" />
        <ToolsMenu onToolSelect={handleToolSelect} />
      </header>

      {/* -------------------- SCROLLABLE MESSAGES -------------------- */}
      <section className="flex-1 min-h-0 overflow-y-auto pt-14 pb-[calc(5rem_+_env(safe-area-inset-bottom))]">
        <ScrollArea className="h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none"></div>
          <div className="relative px-4 sm:px-8 py-6">
            <div className="max-w-5xl mx-auto pb-4 sm:pb-6">
              <MessageDisplay messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer
        className="fixed bottom-0 left-0 right-0 flex items-center bg-background/95 backdrop-blur-xl z-10 h-20 px-2"
        style={{
          paddingTop: "0.5rem",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)",
        }}
      >
        <div className="w-full">
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