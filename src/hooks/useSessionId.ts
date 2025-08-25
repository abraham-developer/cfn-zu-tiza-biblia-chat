// src/hooks/useSessionId.ts
import { useState, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/session";

/**
 * Hook que garantiza que siempre haya un `sessionId` válido.
 * En el primer montaje:
 *   • Busca `sessionId` en la URL.
 *   • Si no está, lo crea y lo escribe en la barra de direcciones.
 */
export const useSessionId = (): string => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const id = getOrCreateSessionId();   // <-- usa el nombre exacto del parámetro
    setSessionId(id);
  }, []);

  return sessionId;
};