// src/hooks/useSessionUuid.ts
import { useState, useEffect, useCallback } from "react";
import { generateUUID } from "@/utils/uuid";

const STORAGE_KEY = "session_uuid";

/**
 * Hook que garantiza que la URL tiene '?sesion=UUID' y que el UUID
 * está almacenado en sessionStorage. Si la URL se manipula, la sesión
 * se reinicia automáticamente.
 */
export const useSessionUuid = () => {
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);

  /*** 1️⃣ Función interna que crea/actualiza el UUID ***/
  const createOrUpdateUuid = useCallback(() => {
    const newUuid = generateUUID();
    sessionStorage.setItem(STORAGE_KEY, newUuid);
    setSessionUuid(newUuid);
    // Actualizamos la barra de direcciones sin recargar la página
    const url = new URL(window.location.href);
    url.searchParams.set("sesion", newUuid);
    window.history.replaceState({}, "", url.toString());
  }, []);

  /*** 2️⃣ Reset de sesión: elimina todo y vuelve a generar ***/
  const resetSession = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    createOrUpdateUuid();
  }, [createOrUpdateUuid]);

  /*** 3️⃣ Efecto: corre al montar el componente ***/
  useEffect(() => {
    // 3.1 – Intentamos leer del storage
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const url = new URL(window.location.href);
    const queryUuid = url.searchParams.get("sesion");

    // 3.2 – Caso 1: No hay nada → generamos uno nuevo
    if (!stored && !queryUuid) {
      createOrUpdateUuid();
      return;
    }

    // 3.3 – Caso 2: Hay UUID en storage pero NO en URL → lo añadimos a la URL
    if (stored && !queryUuid) {
      setSessionUuid(stored);
      url.searchParams.set("sesion", stored);
      window.history.replaceState({}, "", url.toString());
      return;
    }

    // 3.4 – Caso 3: Hay UUID en URL
    if (queryUuid) {
      // Si coincide con lo que está guardado → todo ok
      if (stored === queryUuid) {
        setSessionUuid(stored);
      } else {
        // Si NO coincide → posible manipulación → reset
        console.warn(
          "UUID de sesión en la URL no coincide con el almacenado. Reiniciando sesión..."
        );
        resetSession();
      }
      return;
    }
  }, [createOrUpdateUuid, resetSession]);

  return { sessionUuid, resetSession };
};