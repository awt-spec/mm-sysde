import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Send, CheckCircle, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import sysdeLogo from "@/assets/logo_sysde.png";
import clientLogo from "@/assets/logo_client.png";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

interface Slot {
  date: Date;
  time: string;
}

const Index = () => {
  const [step, setStep] = useState<"dates" | "times" | "confirm" | "thanks">("dates");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const sentRef = useRef(false);

  // Date selection
  const toggleDate = (date: Date | undefined) => {
    if (!date) return;
    const exists = selectedDates.find((d) => d.toDateString() === date.toDateString());
    if (exists) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else if (selectedDates.length < 3) {
      setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  const goToTimes = () => {
    setSlots(selectedDates.map((d) => ({ date: d, time: "" })));
    setCurrentDateIndex(0);
    setStep("times");
  };

  const selectTime = (time: string) => {
    const updated = [...slots];
    updated[currentDateIndex] = { ...updated[currentDateIndex], time };
    setSlots(updated);

    // Auto-advance to next date or confirm
    setTimeout(() => {
      if (currentDateIndex < slots.length - 1) {
        setCurrentDateIndex(currentDateIndex + 1);
      } else if (updated.every((s) => s.time)) {
        setStep("confirm");
      }
    }, 300);
  };

  const removeSlot = (index: number) => {
    const newSlots = slots.filter((_, i) => i !== index);
    const newDates = selectedDates.filter((_, i) => i !== index);
    if (newSlots.length < 2) {
      setSelectedDates(newDates);
      setStep("dates");
      return;
    }
    setSlots(newSlots);
    setSelectedDates(newDates);
  };

  const handleSubmit = async () => {
    if (sentRef.current) return;
    sentRef.current = true;
    setSending(true);

    const availability = slots.map((s) => ({
      date: format(s.date, "EEEE d 'de' MMMM yyyy", { locale: es }),
      time: s.time,
    }));

    try {
      const { error } = await supabase.functions.invoke("send-diagnostic", {
        body: { company: "Cliente", product: "Filemaster", availability },
      });
      if (error) throw error;
      setStep("thanks");
    } catch (err) {
      console.error("Failed to send:", err);
      toast.error("No se pudo enviar. Intenta de nuevo.");
      sentRef.current = false;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full px-6 py-4 flex items-center border-b border-border">
        <img src={sysdeLogo} alt="Sysde" className="h-8" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">

            {/* STEP 1: Pick dates */}
            {step === "dates" && (
              <motion.div
                key="dates"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5"
                >
                  <CalendarDays className="w-8 h-8 text-primary" />
                </motion.div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
                  ¿Agendamos una sesión? 🤝
                </h1>
                <div className="flex items-center justify-center gap-5 mb-2">
                  <div className="w-36 h-24 rounded-xl bg-[#b41d2f] flex items-center justify-center p-4">
                    <img src={sysdeLogo} alt="Sysde" className="h-16 object-contain brightness-0 invert" />
                  </div>
                  <span className="text-muted-foreground text-3xl font-bold">+</span>
                  <div className="w-36 h-24 rounded-xl bg-[#b41d2f] flex items-center justify-center p-4">
                    <img src={clientLogo} alt="Cliente" className="h-16 object-contain brightness-0 invert" />
                  </div>
                </div>


                <p className="text-sm text-muted-foreground text-center mb-6">
                  Elige <strong>2 o 3 fechas</strong> que te funcionen
                </p>

                {/* Selected dates badges */}
                {selectedDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {selectedDates.map((d, i) => (
                      <motion.span
                        key={d.toISOString()}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                      >
                        {format(d, "EEE d MMM", { locale: es })}
                        <button
                          onClick={() => toggleDate(d)}
                          className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Calendar */}
                <div className="bg-card border border-border rounded-2xl p-2 mb-6 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={toggleDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{ picked: selectedDates }}
                    modifiersClassNames={{
                      picked: "bg-primary text-primary-foreground hover:bg-primary/90",
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </div>

                <Button
                  size="lg"
                  onClick={goToTimes}
                  disabled={selectedDates.length < 2}
                  className="px-8 py-5 text-base font-semibold rounded-xl shadow-glow"
                >
                  Elegir horarios
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Button>

                {selectedDates.length < 2 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Selecciona al menos 2 fechas en el calendario
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 2: Pick times */}
            {step === "times" && (
              <motion.div
                key="times"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Progress dots */}
                <div className="flex gap-2 mb-6">
                  {slots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentDateIndex(i)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all",
                        i === currentDateIndex
                          ? "bg-primary scale-125"
                          : slots[i].time
                          ? "bg-primary/40"
                          : "bg-border"
                      )}
                    />
                  ))}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 text-center">
                  ¿A qué hora el{" "}
                  <span className="text-primary">
                    {format(slots[currentDateIndex].date, "EEEE d", { locale: es })}
                  </span>
                  ?
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fecha {currentDateIndex + 1} de {slots.length}
                </p>

                {/* Time grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full max-w-sm mb-8">
                  {TIME_SLOTS.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectTime(t)}
                      className={cn(
                        "py-3 px-2 rounded-xl text-sm font-medium transition-all border-2",
                        slots[currentDateIndex].time === t
                          ? "border-primary bg-primary text-primary-foreground shadow-glow"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentDateIndex > 0) setCurrentDateIndex(currentDateIndex - 1);
                      else setStep("dates");
                    }}
                    className="rounded-xl"
                  >
                    ← Atrás
                  </Button>
                  {slots.every((s) => s.time) && (
                    <Button
                      onClick={() => setStep("confirm")}
                      className="rounded-xl shadow-glow"
                    >
                      Continuar
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirm */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 text-center">
                  Confirma tu disponibilidad
                </h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Estas son tus opciones para la sesión
                </p>

                <div className="w-full space-y-3 mb-8">
                  {slots.map((slot, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/20 bg-primary/5"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground capitalize">
                          {format(slot.date, "EEEE d 'de' MMMM", { locale: es })}
                        </p>
                        <p className="text-sm text-muted-foreground">{slot.time} hrs</p>
                      </div>
                      <button
                        onClick={() => removeSlot(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setStep("times")}
                    className="rounded-xl flex-1 sm:flex-none"
                  >
                    ← Editar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={sending}
                    className="px-8 py-5 text-base font-semibold rounded-xl shadow-glow flex-1 sm:flex-none"
                  >
                    {sending ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Confirmar
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Thanks */}
            {step === "thanks" && (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8"
                >
                  <CheckCircle className="w-10 h-10 text-primary" />
                </motion.div>

                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  ¡Listo! 🎉
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-lg mb-2 leading-relaxed">
                  Recibimos tu disponibilidad. Te confirmaremos la fecha y hora de la sesión muy pronto.
                </p>
                <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                  Revisa tu correo para la confirmación. ¡Nos vemos! 🚀
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full px-6 py-3 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sysde
        </p>
      </footer>
    </div>
  );
};

export default Index;
