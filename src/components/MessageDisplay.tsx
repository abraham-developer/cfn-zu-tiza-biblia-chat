// src/components/MessageDisplay.tsx
import React from "react";
import { Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ---------- INTERFAZ DE UN MENSAJE ---------- */
export interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

/* ---------- Formateador de hora ---------- */
const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

/* ---------- Componentes Markdown con clases responsive ---------- */
const markdownComponents = {
  // Título 1
  h1: ({ node, ...props }: any) => (
    <h1
      className="text-2xl sm:text-3xl font-bold text-foreground my-2 break-words"
      {...props}
    />
  ),
  // Título 2
  h2: ({ node, ...props }: any) => (
    <h2
      className="text-xl sm:text-2xl font-semibold text-foreground my-2 break-words"
      {...props}
    />
  ),
  // Título 3
  h3: ({ node, ...props }: any) => (
    <h3
      className="text-lg sm:text-xl font-medium text-foreground my-2 break-words"
      {...props}
    />
  ),
  // Párrafo
  p: ({ node, ...props }: any) => (
    <p className="text-sm sm:text-base leading-relaxed mb-3 break-words" {...props} />
  ),
  // Negrita
  strong: ({ node, ...props }: any) => (
    <strong className="font-semibold break-words" {...props} />
  ),
  // Cita bloque
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2 break-words"
      {...props}
    />
  ),
  // Listas
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-2 break-words" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside space-y-1 my-2 break-words" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="text-sm sm:text-base text-foreground break-words" {...props} />
  ),
  // Código
  code: ({ node, inline, ...props }: any) =>
    inline ? (
      <code className="bg-gray-800 rounded px-1 py-0.5 text-sm sm:text-base break-words">
        {props.children}
      </code>
    ) : (
      <pre className="bg-gray-900 rounded p-3 overflow-x-auto my-2">
        <code className="text-sm sm:text-base break-words">{props.children}</code>
      </pre>
    ),
  // Enlaces
  a: ({ node, ...props }: any) => (
    <a
      className="text-primary underline hover:text-primary/80 break-words"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

export const MessageDisplay: React.FC<{
  messages: Message[];
  isLoading: boolean;
}> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-8 sm:space-y-10">
      {messages.map((msg, idx) => (
        <div
          key={msg.id}
          className={`flex gap-4 sm:gap-6 animate-fade-in ${
            msg.type === "user" ? "justify-end" : "justify-start"
          }`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          {/* ---------- ICONO AI ---------- */}
          {msg.type === "ai" && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 mt-1 relative overflow-hidden group border border-accent/30">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-accent relative z-10" />
            </div>
          )}

          {/* ---------- BUBBLE ---------- */}
          <div
            className={`max-w-[90%] sm:max-w-[70%] relative group ${
              msg.type === "user" ? "animate-slide-up" : "animate-fade-in"
            }`}
          >
            <div
              className={`
                rounded-3xl px-4 py-3 sm:px-6 sm:py-4
                relative overflow-hidden backdrop-blur-xl border transition-all duration-300
                ${
                  msg.type === "user"
                    ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-primary/50 shadow-xl shadow-primary/25"
                    : "glass-card text-foreground shadow-2xl border-white/20"
                }
                break-words overflow-wrap-anywhere
              `}
            >
              {/* overlay solo para mensajes del usuario */}
              {msg.type === "user" && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent"></div>
              )}

              <div className="relative z-10">
                {/* ==== CONTENIDO MARKDOWN ==== */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  // Si necesitas HTML dentro del markdown, descomenta:
                  // rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={markdownComponents}
                >
                  {msg.content}
                </ReactMarkdown>

                {/* ==== FOOTER (hora + etiqueta) ==== */}
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`
                      text-xs sm:text-sm ${
                        msg.type === "user"
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {formatTime(msg.timestamp)}
                  </span>

                  {msg.type === "ai" && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-accent font-medium">
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-1 shadow-xl shadow-primary/30 relative overflow-hidden group border border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground relative z-10" />
            </div>
          )}
        </div>
      ))}

      {/* ---------- SPINNER (cuando la IA está pensando) ---------- */}
      {isLoading && (
        <div className="flex gap-4 sm:gap-6 justify-start animate-fade-in">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl glass-card flex items-center justify-center flex-shrink-0 animate-pulse border border-accent/30">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="glass-card rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-accent" />
              <span className="text-sm sm:text-base text-muted-foreground font-medium">
                Consultando las Escrituras...
              </span>
              {/* puntos animados */}
              <div className="flex gap-1 sm:gap-2">
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};