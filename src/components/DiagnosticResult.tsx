import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Flame } from "lucide-react";
import type { SelectedPain } from "@/components/PainMap";

interface DiagnosticResultProps {
  selectedPains: SelectedPain[];
}

const painSolutions: Record<string, { solution: string; product: string }> = {
  cobranza: {
    solution: "Automatización inteligente de cobranza con seguimiento en tiempo real y estrategias por segmento.",
    product: "SysdeCobranza",
  },
  originacion: {
    solution: "Originación digital con motor de decisión, scoring automático y aprobación en minutos.",
    product: "SysdeOrigination",
  },
  riesgos: {
    solution: "Modelos de scoring crediticio, análisis de comportamiento y detección de fraude con IA.",
    product: "Sysde Risk Engine",
  },
  cumplimiento: {
    solution: "Módulos de cumplimiento normativo con reportes automáticos a reguladores.",
    product: "SysdePLD",
  },
  cartera: {
    solution: "Visibilidad completa del portafolio con dashboards, segmentación y alertas tempranas.",
    product: "Sysde Analytics",
  },
  desembolso: {
    solution: "Desembolso automatizado multicanal y conciliación inteligente de pagos.",
    product: "SysdePagos",
  },
  clientes: {
    solution: "Plataforma omnicanal con app móvil, autoservicio 24/7 y onboarding digital.",
    product: "SysdeMóvil",
  },
  soporte: {
    solution: "CRM integrado con historial completo, seguimiento de gestiones y trazabilidad total.",
    product: "SysdeCRM",
  },
  otro: {
    solution: "Nuestro equipo analizará tu caso específico y diseñará una solución a medida.",
    product: "Solución Personalizada",
  },
};

const painLabels: Record<string, string> = {
  cobranza: "Cobranza Ineficiente",
  originacion: "Originación Lenta",
  riesgos: "Evaluación de Riesgo",
  cumplimiento: "Cumplimiento Normativo",
  cartera: "Gestión de Cartera",
  desembolso: "Desembolso y Pagos",
  clientes: "Experiencia del Cliente",
  soporte: "Atención y Seguimiento",
  otro: "Otro",
};

const subOptionLabels: Record<string, string> = {
  cartera_morosidad: "Control de morosidad",
  cartera_segmentacion: "Segmentación de portafolio",
  cartera_provision: "Cálculo de provisiones",
  cartera_reportes: "Reportes en tiempo real",
  cartera_reestructura: "Reestructuración de créditos",
  cartera_castigos: "Castigos y write-offs",
};

const impactLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Bajo", color: "text-pain-low" },
  2: { label: "Medio", color: "text-pain-medium" },
  3: { label: "Alto", color: "text-pain-high" },
};

const DiagnosticResult = ({ selectedPains }: DiagnosticResultProps) => {
  if (selectedPains.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      {selectedPains.map((pain, index) => {
        const solution = painSolutions[pain.id];
        if (!solution) return null;
        const impact = impactLabels[pain.impact] || impactLabels[2];

        return (
          <motion.div
            key={pain.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">
                    {painLabels[pain.id] || pain.id}
                  </span>
                  <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-xs font-medium text-primary">{solution.product}</span>
                  <span className={`ml-auto flex items-center gap-1 text-xs font-medium ${impact.color}`}>
                    <Flame className="w-3 h-3" />
                    {impact.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{solution.solution}</p>

                {/* Show sub-options if any */}
                {pain.subOptions && pain.subOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pain.subOptions.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {subOptionLabels[sub] || sub}
                      </span>
                    ))}
                  </div>
                )}

                {/* Show custom text for "otro" */}
                {pain.id === "otro" && pain.customText && (
                  <div className="mt-2 p-2 rounded-lg bg-muted text-xs text-muted-foreground italic">
                    "{pain.customText}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DiagnosticResult;
