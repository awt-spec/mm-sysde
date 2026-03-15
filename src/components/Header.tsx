import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F3</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary/30" />
          </div>
          <span className="text-2xl font-bold text-foreground italic">Blueleasing</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#diagnostico" className="text-muted-foreground hover:text-foreground transition-colors">
            Diagnóstico
          </a>
          <a href="https://sysde.com/productos" className="text-muted-foreground hover:text-foreground transition-colors">
            Productos
          </a>
          <a href="https://sysde.com/servicios" className="text-muted-foreground hover:text-foreground transition-colors">
            Servicios
          </a>
          <a href="https://sysde.com/contactenos" className="text-muted-foreground hover:text-foreground transition-colors">
            Contacto
          </a>
        </nav>

        {/* CTA */}
        <a
          href="#diagnostico"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Iniciar Diagnóstico
        </a>
      </div>
    </motion.header>
  );
};

export default Header;
