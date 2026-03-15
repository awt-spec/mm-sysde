import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { company, product, availability } = await req.json();

    const slotsHtml = (availability || [])
      .map(
        (slot: { date: string; time: string }, i: number) => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px;">
          <span style="background: #c42255; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">${i + 1}</span>
          <div>
            <div style="font-weight: 600; color: #1e293b; font-size: 15px;">${slot.date}</div>
            <div style="color: #64748b; font-size: 14px;">Hora: ${slot.time}</div>
          </div>
        </div>`
      )
      .join("");

    const subject = `📅 ${company || "Prospecto"} — Disponibilidad para demo de ${product || "producto"}`;
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #c42255; margin-bottom: 4px;">📅 Disponibilidad para Demo</h1>
        <p style="color: #64748b; font-size: 15px; margin-top: 0;">Empresa: <strong>${company || "No especificada"}</strong> · Producto: <strong>${product || "No especificado"}</strong></p>
        
        <div style="margin: 24px 0;">
          <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 12px;">Opciones de agenda:</h2>
          ${slotsHtml}
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Generado automáticamente por Sysde</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sysde <onboarding@resend.dev>",
        to: ["awcuentas@gmail.com"],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      throw new Error(`Resend API error: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
