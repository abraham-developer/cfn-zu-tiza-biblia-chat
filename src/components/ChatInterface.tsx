// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import { Crown, Shield, Star } from "lucide-react";
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
  // El endpoint devuelve texto plano, no JSON
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

  // **Flag síncrono** para saber si ya estamos enviando una petición
  const sendingRef = useRef(false);

  /* -------------------- SCROLL / FOCUS -------------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* -------------------- ENVÍO DE MENSAJE -------------------- */
  const handleSendMessage = async () => {
    // --------------------------------------------------------------
    // 1️⃣  No permitir una segunda petición mientras la anterior
    //     está en curso (flag *síncrono* y guardia de estado).
    // --------------------------------------------------------------
    if (sendingRef.current || isLoading) return;          // <-- GUARDIA
    if (!inputValue.trim()) return;

    // Marca que comenzamos a enviar (antes de cualquier setState)
    sendingRef.current = true;

    // --------------------------------------------------------------
    // 2️⃣  Mensaje del usuario (se muestra una única vez)
    // --------------------------------------------------------------
    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // --------------------------------------------------------------
    // 3️⃣  Limpiamos el textarea y activamos spinner
    // --------------------------------------------------------------
    setInputValue("");
    setIsLoading(true);

    try {
      // --------------------------------------------------------------
      // 4️⃣  Llamada real al webhook
      // --------------------------------------------------------------
      const aiReply = await postToAI(userMsg.content);

      // --------------------------------------------------------------
      // 5️⃣  Si, por alguna razón, otra petición se lanzó (por
      //     ejemplo, doble mount en StrictMode), descartamos esta
      //     respuesta porque `sendingRef` ya habrá cambiado.
      // --------------------------------------------------------------
      if (!sendingRef.current) return; // no deberia pasar, pero más seguro

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiReply,
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Error al contactar la IA:", error);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        content:
          "❗ Hubo un error al obtener la respuesta. Por favor, intenta de nuevo.",
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      // --------------------------------------------------------------
      // 6️⃣  Reset de flags y enfoque del textarea
      // --------------------------------------------------------------
      setIsLoading(false);
      sendingRef.current = false;   // <-- liberamos el flag
      inputRef.current?.focus();
    }
  };

  /* -------------------- ENTER → ENVIAR -------------------- */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); // solo se ejecutará una vez por la guardia anterior
    }
  };

  /* -------------------- MAPEO HERRAMIENTA → TEXTO -------------------- */
  const handleToolSelect = (toolId: string) => {
    const toolMessages: Record<string, string> = {
      "verse-search": "Quiero buscar versículos bíblicos específicos",
      "bible-study": "Me gustaría hacer un estudio bíblico profundo",
      devotional: "Necesito una reflexión devocional",
      community: "Me interesa conectar con la comunidad",
      // NUEVA HERRAMIENTA
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
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* ---------- BACKGROUND ---------- */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"></div>

      {/* ---------- HEADER ---------- */}
      <div className="relative z-10">
        <div className="glass border-b border-white/10 backdrop-blur-3xl">
          <div className="flex items-center justify-between px-8 py-6">
            {/* LOGO + TITLE */}
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

            {/* BOTÓN DE HERRAMIENTAS */}
            <ToolsMenu onToolSelect={handleToolSelect} />
          </div>
        </div>
      </div>

      {/* ---------- MENSAJES ---------- */}
      <ScrollArea className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"></div>
        <div className="relative px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <MessageDisplay messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* ---------- INPUT ---------- */}
      <div className="relative z-10 p-8">
        <div className="max-w-5xl mx-auto">
          <InputArea
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            inputRef={inputRef} // ✅ ref del textarea
          />
        </div>
      </div>
    </div>
  );
};