// src/components/InputArea.tsx
import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

/* --------------------------------------------------------------
   INPUT AREA – contador arriba del textarea (no cubre el botón)
   -------------------------------------------------------------- */
export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
  inputRef,
}) => {
  const MAX_CHARS = 200;
  const [charCount, setCharCount] = useState(0);

  const countChars = (t: string) => t.length;
  useEffect(() => {
    const c = countChars(value);
    setCharCount(c);
    if (c > MAX_CHARS) {
      const lim = value.slice(0, MAX_CHARS);
      if (lim !== value) onChange(lim);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && charCount <= MAX_CHARS) onSend();
    }
    onKeyPress(e);
  };

  return (
    <div className="relative">
      {/* ---------- CONTENEDOR PRINCIPAL (compacto) ---------- */}
      <div className="rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/20 bg-gray-800 relative overflow-hidden">
        {/* Gradiente opcional */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 pointer-events-none"></div>

        {/* ------------------------------------------------------------------
            WRAP: contiene textarea + contador (absolute) + botón
            ------------------------------------------------------------------ */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* ==================== TEXTAREA + CONTADOR ==================== */}
          <div className="relative flex-1">
            {/* ----- CONTADOR (arriba‑derecha del textarea) ----- */}
            <div className="absolute top-0 right-0 text-xs sm:text-sm">
              <span
                className={charCount > MAX_CHARS ? "text-red-400" : "text-green-400"}
              >
                {charCount} / {MAX_CHARS}
              </span>
            </div>

            {/* ----- TEXTAREA ----- */}
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta ..."
              rows={1}
              maxLength={MAX_CHARS}
              className={`
                block w-full resize-none pr-14 py-2 sm:py-3
                text-sm sm:text-base text-center
                rounded-lg border-0 bg-white/5 backdrop-blur-sm
                placeholder:italic placeholder:text-gray-400/80
                text-foreground focus:ring-2 focus:ring-accent/50
                transition-all duration-300 font-medium
              `}
              disabled={isLoading}
              style={{ paddingRight: "4rem" }} // espacio para que el contador no tape texto
            />
          </div>

          {/* ==================== BOTÓN ENVIAR ==================== */}
          <Button
            onClick={onSend}
            disabled={!value.trim() || isLoading || charCount > MAX_CHARS}
            className={`
              rounded-lg px-4 py-2 sm:px-5 sm:py-3
              bg-gradient-to-r from-primary via-primary/90 to-primary/80
              hover:from-primary/90 hover:via-primary/80 hover:to-primary/70
              border border-primary/50 shadow-xl shadow-primary/30
              transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40
              hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
              group relative overflow-hidden
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Send className="w-4 h-4 relative z-10" />
          </Button>
        </div>
      </div>
    </div>
  );
};