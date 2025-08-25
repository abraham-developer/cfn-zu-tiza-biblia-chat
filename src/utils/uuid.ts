// src/utils/uuid.ts
export const generateUUID = (): string => {
  // crypto.randomUUID está en la mayoría de browsers modernos (HTTPS obligatorio)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback RFC‑4122 v4 (usando crypto.getRandomValues)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Version 4 & variante RFC‑4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex: string[] = Array.from(bytes).map(b => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
};