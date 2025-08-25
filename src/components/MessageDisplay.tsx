// src/components/MessageDisplay.tsx
import React from "react";
import { Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

/* ---------- Helper para formatear la hora ---------- */
const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

/* ---------- Estilos para los tags del markdown ---------- */
const markdownComponents = {
  // Título de nivel 1 → h1 (puedes mapear a h2 si ya usas h1 en la UI)
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold text-foreground my-2" {...props} />
  ),
  // Título de nivel 2 → h2
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-semibold text-foreground my-2" {...props} />
  ),
  // Título de nivel 3 → h3
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-medium text-foreground my-2" {...props} />
  ),
  // Párrafo
  p: ({ node, ...props }: any) => (
    <p className="text-base leading-relaxed mb-3" {...props} />
  ),
  // Negrita
  strong: ({ node, ...props }: any) => (
    <strong className="font-semibold" {...props} />
  ),
  // Cita de bloque > ...
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2"
      {...props}
    />
  ),
  // Lista ordenada
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
  ),
  // Lista desordenada
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside space-y-1 my-2" {...props} />
  ),
  // Elemento de lista
  li: ({ node, ...props }: any) => (
    <li className="text-base text-foreground" {...props} />
  ),
  // Código en línea
  code: ({ node, inline, ...props }: any) =>
    inline ? (
      <code className="bg-gray-800 rounded px-1 py-0.5 text-sm">
        {props.children}
      </code>
    ) : (
      <pre className="bg-gray-900 rounded p-3 overflow-x-auto my-2">
        <code className="text-sm">{props.children}</code>
      </pre>
    ),
  // Enlaces
  a: ({ node, ...props }: any) => (
    <a
      className="text-primary underline hover:text-primary/80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="space-y-8">
      {messages.map((msg, idx) => (
        <div
          key={msg.id}
          className={`flex gap-6 animate-fade-in ${
            msg.type === "user" ? "justify-end" : "justify-start"
          }`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          {/* ---------- ICONO ---------- */}
          {msg.type === "ai" && (
            <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 mt-1 relative overflow-hidden group border border-accent/30">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Bot className="w-6 h-6 text-accent relative z-10" />
            </div>
          )}

          {/* ---------- BUBBLE ---------- */}
          <div
            className={`max-w-[70%] relative group ${
              msg.type === "user" ? "animate-slide-up" : "animate-fade-in"
            }`}
          >
            <div
              className={`rounded-3xl px-6 py-5 relative overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
                msg.type === "user"
                  ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-primary/50 shadow-xl shadow-primary/25"
                  : "glass-card text-foreground shadow-2xl border-white/20"
              }`}
            >
              {/* Opcional: overlay para usuario */}
              {msg.type === "user" && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent"></div>
              )}

              <div className="relative z-10">
                {/* ==== CONTENIDO ==== */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  // Si deseas permitir HTML dentro del markdown (poco frecuente):
                  // rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={markdownComponents}
                >
                  {msg.content}
                </ReactMarkdown>

                {/* ==== FOOTER (hora y etiqueta) ==== */}
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${
                      msg.type === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>

                  {msg.type === "ai" && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs text-accent font-medium">
                        CFN Assistant
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- ICONO USER ---------- */}
          {msg.type === "user" && (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-1 shadow-xl shadow-primary/30 relative overflow-hidden group border border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <User className="w-6 h-6 text-primary-foreground relative z-10" />
            </div>
          )}
        </div>
      ))}

      {/* ---------- SPINNER (cuando la IA está pensando) ---------- */}
      {isLoading && (
        <div className="flex gap-6 justify-start animate-fade-in">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 animate-pulse border border-accent/30">
            <Bot className="w-6 h-6 text-accent" />
          </div>
          <div className="glass-card rounded-3xl px-6 py-5 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-base text-muted-foreground font-medium">
                Consultando las Escrituras...
              </span>
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};