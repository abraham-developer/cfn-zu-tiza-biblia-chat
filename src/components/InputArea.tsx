// src/components/InputArea.tsx
import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputAreaProps {
  /** Texto actual del textarea */
  value: string;
  /** Actualiza el texto */
  onChange: (value: string) => void;
  /** Acción al pulsar “Enviar” */
  onSend: () => void;
  /** Captura de teclas (ej.: Shift+Enter) */
  onKeyPress: (e: React.KeyboardEvent) => void;
  /** Estado de carga del bot */
  isLoading: boolean;
  /** Ref del textarea (útil para focus externo) */
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

/* ----------------------------------------------------------------- */
export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
  inputRef,
}) => {
  const MAX_CHARS = 200;                     // ← límite de **caracteres** (incluye espacios)
  const [charCount, setCharCount] = useState(0);

  /* ---------- Contar TODOS los caracteres (incluye espacios) ---------- */
  const countChars = (text: string) => text.length;

  /* -----------------------------------------------------------------
     Cada vez que cambie el contenido:
       • actualizamos el contador
       • si supera 200, recortamos al primer carácter 200
     ----------------------------------------------------------------- */
  useEffect(() => {
    const current = countChars(value);
    setCharCount(current);

    if (current > MAX_CHARS) {
      const limited = value.slice(0, MAX_CHARS);   // recorta sin perder nada
      if (limited !== value) onChange(limited);
    }
  }, [value]);

  /* -----------------------------------------------------------------
     “Enter” → enviar (Shift+Enter sigue insertando salto de línea)
   ----------------------------------------------------------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();               // evita salto de línea
      if (value.trim() && charCount <= MAX_CHARS) onSend();
    }
    onKeyPress(e);
  };

  return (
    <div className="relative">
      {/* ------------------- CONTENEDOR ------------------- */}
      <div className="rounded-3xl p-6 shadow-2xl border border-white/20 bg-gray-800 relative overflow-hidden">
        {/* Gradiente superpuesto – opcional */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 pointer-events-none"></div>

        <div className="relative z-10">
          {/* ---------------- INPUT + BOTÓN ---------------- */}
          <div className="flex gap-4 items-end mb-4">
            {/* ---------------------- TEXTAREA ---------------------- */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta .."
                rows={1}
                maxLength={MAX_CHARS}               // protección extra del navegador
                className={`
                  block w-full resize-none pr-16 py-5 sm:py-6 
                  text-base sm:text-lg text-center 
                  rounded-2xl border-0 bg-white/5 backdrop-blur-sm 
                  placeholder:italic placeholder:text-gray-400/80 
                  text-foreground focus:ring-2 focus:ring-accent/50 
                  transition-all duration-300 font-medium
                `}
                disabled={isLoading}
              />
            </div>

            {/* ---------------------- BOTÓN ENVIAR ---------------------- */}
            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading || charCount > MAX_CHARS}
              className={`
                rounded-2xl px-8 py-5 
                bg-gradient-to-r from-primary via-primary/90 to-primary/80 
                hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 
                border border-primary/50 shadow-xl shadow-primary/30 
                transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 
                hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 
                group relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Send className="w-5 h-5 relative z-10" />
            </Button>
          </div>

          {/* ------------------- CONTADOR DE CARACTERES ------------------- */}
          <div className="flex justify-end mb-2 text-sm">
            <span
              className={`
                ${charCount > MAX_CHARS ? "text-red-400" : "text-green-400"}
              `}
            >
              {charCount} / {MAX_CHARS} caracteres
            </span>
          </div>

          {/* ------------------- INFO INFERIOR ------------------- */}
          <div className="flex items-center justify-between text-xs">
            
            
          </div>
        </div>
      </div>
    </div>
  );
};