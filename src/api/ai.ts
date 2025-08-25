// src/api/ai.ts
/**
 * Envía el mensaje del usuario al webhook.
 *
 * @param mensaje   Texto escrito por el usuario.
 * @param sessionId UUID de sesión (puede ser null si todavía no existe).
 *
 * @returns Texto plano que devuelve la IA.
 */
export const postToAI = async (
  mensaje: string,
  sessionId: string | null
): Promise<string> => {
  const url =
    "https://aan8nwebhook.abrahamdev.net/webhook/f09672cd-eb0f-4c69-8113-4f4bc7d4ea96";

  // Construimos el payload con el campo extra "SesionId"
  const payload: Record<string, unknown> = {
    Mensaje: mensaje,
  };
  if (sessionId) {
    // El nombre del campo lo puedes cambiar según lo que espere tu webhook.
    payload.SesionId = sessionId;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Header opcional (útil si en el futuro necesitas validar en el backend)
      ...(sessionId ? { "X-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`API error ${resp.status}: ${txt}`);
  }

  // Se asume que el webhook devuelve texto plano.
  return await resp.text();
};