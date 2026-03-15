import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Clock,
  FileWarning,
  Users,
  ShieldAlert,
  Calculator,
  Banknote,
  HeadphonesIcon,
  CheckCircle2,
  ChevronDown,
  MessageSquarePlus,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface SubOption {
  id: string;
  label: string;
}

interface PainPoint {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  subOptions?: SubOption[];
}

const painPoints: PainPoint[] = [
  {
    id: "cobranza",
    title: "Cobranza Ineficiente",
    description: "Alta morosidad, seguimiento manual y baja recuperación.",
    icon: TrendingDown,
  },
  {
    id: "originacion",
    title: "Originación Lenta",
    description: "Solicitudes lentas, demasiados documentos, aprobación tardía.",
    icon: Clock,
  },
  {
    id: "riesgos",
    title: "Evaluación de Riesgo",
    description: "Scoring manual, sin modelos predictivos ni detección de fraude.",
    icon: ShieldAlert,
  },
  {
    id: "cumplimiento",
    title: "Cumplimiento Normativo",
    description: "Regulaciones cambiantes, reportes manuales a reguladores.",
    icon: FileWarning,
  },
  {
    id: "cartera",
    title: "Gestión de Cartera",
    description: "Selecciona el área específica que te afecta.",
    icon: Calculator,
    subOptions: [
      { id: "cartera_morosidad", label: "Control de morosidad y atrasos" },
      { id: "cartera_segmentacion", label: "Segmentación de portafolio" },
      { id: "cartera_provision", label: "Cálculo de provisiones" },
      { id: "cartera_reportes", label: "Reportes de cartera en tiempo real" },
      { id: "cartera_reestructura", label: "Reestructuración de créditos" },
      { id: "cartera_castigos", label: "Gestión de castigos y write-offs" },
    ],
  },
  {
    id: "desembolso",
    title: "Desembolso y Pagos",
    description: "Desembolsos lentos y conciliación de pagos manual.",
    icon: Banknote,
  },
  {
    id: "clientes",
    title: "Experiencia del Cliente",
    description: "Canales limitados, sin autoservicio ni onboarding digital.",
    icon: Users,
  },
  {
    id: "soporte",
    title: "Atención y Seguimiento",
    description: "Sin CRM integrado, historial disperso, mala trazabilidad.",
    icon: HeadphonesIcon,
  },
];

const impactLevels = [
  { value: 1, label: "Bajo", bg: "bg-pain-low", bar: "bg-pain-low" },
  { value: 2, label: "Medio", bg: "bg-pain-medium", bar: "bg-pain-medium" },
  { value: 3, label: "Alto", bg: "bg-pain-high", bar: "bg-pain-high" },
];

export interface SelectedPain {
  id: string;
  impact: number;
  subOptions?: string[];
  customText?: string;
}

interface PainMapProps {
  onPainSelect: (pains: SelectedPain[]) => void;
  selectedPains: SelectedPain[];
}

const ImpactBar = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div
    className="flex items-center gap-1 mt-3"
    onClick={(e) => e.stopPropagation()}
    onPointerDown={(e) => e.stopPropagation()}
  >
    {impactLevels.map((level) => (
      <button
        key={level.value}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(level.value);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className={`
          flex-1 py-1.5 rounded-md text-[10px] font-semibold text-center transition-all duration-200 select-none border-0 outline-none
          ${
            value === level.value
              ? `${level.bar} text-primary-foreground shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-105`
              : "bg-primary-foreground/15 text-primary-foreground/50 hover:bg-primary-foreground/25"
          }
        `}
      >
        {level.label}
      </button>
    ))}
  </div>
);

const PainMap = ({ onPainSelect, selectedPains }: PainMapProps) => {
  const [expandedPain, setExpandedPain] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");

  const isSelected = (painId: string) =>
    selectedPains.some((p) => p.id === painId);
  const getSelected = (painId: string) =>
    selectedPains.find((p) => p.id === painId);

  const togglePain = (painId: string) => {
    if (isSelected(painId)) {
      onPainSelect(selectedPains.filter((p) => p.id !== painId));
      if (expandedPain === painId) setExpandedPain(null);
    } else {
      onPainSelect([...selectedPains, { id: painId, impact: 2 }]);
      const point = painPoints.find((p) => p.id === painId);
      if (point?.subOptions) setExpandedPain(painId);
    }
  };

  const setImpact = (painId: string, impact: number) => {
    onPainSelect(
      selectedPains.map((p) => (p.id === painId ? { ...p, impact } : p))
    );
  };

  const toggleSubOption = (painId: string, subId: string) => {
    onPainSelect(
      selectedPains.map((p) => {
        if (p.id !== painId) return p;
        const current = p.subOptions || [];
        const updated = current.includes(subId)
          ? current.filter((s) => s !== subId)
          : [...current, subId];
        return { ...p, subOptions: updated };
      })
    );
  };

  const toggleOther = () => {
    if (isSelected("otro")) {
      onPainSelect(selectedPains.filter((p) => p.id !== "otro"));
      setOtherText("");
    } else {
      onPainSelect([
        ...selectedPains,
        { id: "otro", impact: 2, customText: "" },
      ]);
    }
  };

  const updateOtherText = (text: string) => {
    setOtherText(text);
    onPainSelect(
      selectedPains.map((p) =>
        p.id === "otro" ? { ...p, customText: text } : p
      )
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Grid of cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {painPoints.map((pain, index) => {
          const selected = isSelected(pain.id);
          const selData = getSelected(pain.id);
          const Icon = pain.icon;
          const hasSubs = !!pain.subOptions;
          const isExpanded = expandedPain === pain.id && selected;

          return (
            <motion.div
              key={pain.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              onClick={() => {
                if (hasSubs && selected) {
                  setExpandedPain(isExpanded ? null : pain.id);
                } else {
                  togglePain(pain.id);
                }
              }}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-4 md:p-5 transition-all duration-300 text-left
                hover:scale-[1.03] active:scale-[0.98]
                ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-glow border-primary"
                    : "bg-card border-border hover:border-primary/30"
                }
              `}
            >
              {/* Check badge */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10 border-2 border-background"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon */}
              <div
                className={`w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3 ${
                  selected ? "bg-primary-foreground/20" : "bg-muted"
                }`}
              >
                <Icon
                  className={`w-5 h-5 md:w-7 md:h-7 ${
                    selected ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>

              {/* Title */}
              <h3
                className={`font-semibold text-sm md:text-base mb-1 ${
                  selected ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {pain.title}
              </h3>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed ${
                  selected
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {pain.description}
              </p>

              {/* Expand hint for cartera */}
              {hasSubs && selected && (
                <div className="flex items-center gap-1 mt-2 text-primary-foreground/60 text-[10px]">
                  <span>Ver opciones</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}

              {/* Impact bar */}
              {selected && (
                <ImpactBar
                  value={selData?.impact || 2}
                  onChange={(v) => setImpact(pain.id, v)}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Sub-options panel for Gestión de Cartera */}
      <AnimatePresence>
        {expandedPain === "cartera" && isSelected("cartera") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                ¿Qué área de gestión de cartera te afecta más?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {painPoints
                  .find((p) => p.id === "cartera")
                  ?.subOptions?.map((sub) => {
                    const subSelected = getSelected("cartera")?.subOptions?.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => toggleSubOption("cartera", sub.id)}
                        className={`
                          w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2
                          ${
                            subSelected
                              ? "bg-primary text-primary-foreground font-medium"
                              : "bg-card text-muted-foreground hover:bg-muted border border-border"
                          }
                        `}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            subSelected
                              ? "bg-primary-foreground border-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {subSelected && (
                            <CheckCircle2 className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        {sub.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Otro" card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: painPoints.length * 0.05 }}
        onClick={toggleOther}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-4 md:p-5 transition-all duration-300
          hover:scale-[1.01] active:scale-[0.99]
          ${
            isSelected("otro")
              ? "bg-primary text-primary-foreground shadow-glow border-primary"
              : "bg-card border-border hover:border-primary/30"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isSelected("otro")
                ? "bg-primary-foreground/20"
                : "bg-muted"
            }`}
          >
            <MessageSquarePlus
              className={`w-5 h-5 ${
                isSelected("otro")
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-semibold text-sm ${
                isSelected("otro") ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              Otro dolor
            </h3>
            <p
              className={`text-xs ${
                isSelected("otro")
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              Descríbenos tu desafío específico
            </p>
          </div>
        </div>

        {isSelected("otro") && (
          <ImpactBar
            value={getSelected("otro")?.impact || 2}
            onChange={(v) => setImpact("otro", v)}
          />
        )}
      </motion.div>

      {/* Textarea for "Otro" */}
      <AnimatePresence>
        {isSelected("otro") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Textarea
              value={otherText}
              onChange={(e) => updateOtherText(e.target.value)}
              placeholder="Describe tu dolor o desafío aquí..."
              className="text-sm resize-none min-h-[80px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact legend */}
      <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
        <span className="font-medium">Impacto:</span>
        {impactLevels.map((l) => (
          <span key={l.value} className="flex items-center gap-1.5">
            <span className={`w-6 h-2 rounded-full ${l.bar}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PainMap;
