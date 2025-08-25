// src/lib/session.ts
/**
 * Genera un UUID v4 usando la API nativa del navegador.
 * En Node >14.17 también existe `crypto.randomUUID()`.
 */
export const generateUuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback usando crypto del web‑api (más seguro que Math.random)
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  // Version 4 UUID (RFC4122)
  arr[6] = (arr[6] & 0x0f) | 0x40;
  arr[8] = (arr[8] & 0x3f) | 0x80;
  const hex = Array.from(arr, (b) => b.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
};

/**
 * Lee `sessionId` del query‑string. Si no existe, genera uno nuevo,
 * actualiza la URL (sin recargar) y lo devuelve.
 *
 * @returns el UUID que representa la sesión actual
 */
export const getOrCreateSessionId = (): string => {
  // Primero intentamos extraerlo de la URL:
  const url = new URL(window.location.href);
  const existing = url.searchParams.get("sessionId");
  if (existing) return existing;

  // No había → creamos uno nuevo:
  const newId = generateUuid();

  // Añadimos el parámetro a la URL sin recargar la página.
  // Usamos `replaceState` para que no se genere una nueva entrada en el historial.
  url.searchParams.set("sessionId", newId);
  window.history.replaceState({}, "", url.toString());

  return newId;
};