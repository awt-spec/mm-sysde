import { motion } from "framer-motion";
import { Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Blu</span>
              </div>
              <span className="text-2xl font-bold italic">Blueleasing</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md">
              Más de 20 años creando sistemas para microfinanzas y soluciones tecnológicas 
              innovadoras para organizaciones del sector financiero global.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/company/sysde/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@SYSDEmicrofinanzas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@sysde.com"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="https://sysde.com/productos/sysde-saf/" className="hover:text-background transition-colors">SysdeSAF</a></li>
              <li><a href="https://sysde.com/productos/sysde-banca/" className="hover:text-background transition-colors">SysdeBanca</a></li>
              <li><a href="https://sysde.com/productos/sysde-cobranza/" className="hover:text-background transition-colors">SysdeCobranza</a></li>
              <li><a href="https://sysde.com/productos/sysde-movil/" className="hover:text-background transition-colors">SysdeMóvil</a></li>
              <li><a href="https://sysde.com/productos/sysde-pld/" className="hover:text-background transition-colors">SysdePLD</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="https://sysde.com/acerca-de-nosotros/" className="hover:text-background transition-colors">Acerca de</a></li>
              <li><a href="https://sysde.com/servicios/" className="hover:text-background transition-colors">Servicios</a></li>
              <li><a href="https://sysde.com/alianzas/" className="hover:text-background transition-colors">Alianzas</a></li>
              <li><a href="https://sysde.com/blog/" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="https://sysde.com/contactenos/" className="hover:text-background transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Blueleasing. Todos los derechos reservados.
          </p>
          <p className="text-sm text-background/50">
            Tecnología para Crecer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
