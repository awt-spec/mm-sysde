import { motion } from "framer-motion";
import { ArrowDown, Zap, Shield, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        
        {/* Animated circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] border border-primary-foreground/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] border border-primary-foreground/10 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 mb-8"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Diagnóstico Rápido para tu Institución</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            ¿Dónde le{" "}
            <span className="relative">
              duele
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-2 left-0 h-1 bg-primary-foreground/50 rounded-full"
              />
            </span>{" "}
            a tu financiera?
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Identifica los puntos críticos de tu institución financiera en 60 segundos. 
            Haz clic en el mapa de dolor y descubre cómo podemos ayudarte.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <Shield className="w-6 h-6" />
              <span className="text-sm">+20 años de experiencia</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">+200 proyectos exitosos</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <Zap className="w-6 h-6" />
              <span className="text-sm">26 países en LATAM</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.a
            href="#diagnostico"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
          >
            <span className="text-sm">Comenzar diagnóstico</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
