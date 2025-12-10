import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/Icono-988x1024.png"
                alt="Residencial Santa Marta"
                className="h-12 w-12 brightness-0 invert"
              />
              <div>
                <h3 className="font-bold text-lg">Residencial Santa Marta</h3>
                <p className="text-sm text-gray-300">Home Care</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Santa Marta es un residencial para adultos mayores donde le ofrecemos a todos
              nuestros residentes cuidados integrales durante su estancia para cubrir y desarrollar
              las necesidades básicas de su vida diaria.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contáctenos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <a
                  href="https://www.google.com/maps/place/Ave.+Angel+Rubio+y+Calle+3ra,+Nuevo+Reparto+el+Carmen,+Ciudad+Panam%C3%A1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ave. Angel Rubio y Calle 3ra, Nuevo Reparto el Carmen, atrás del Parque Benito
                  Juárez, Ciudad Panamá, Panamá
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="flex-shrink-0 text-primary-400" />
                <a
                  href="mailto:resi_santamarta@hotmail.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  resi_santamarta@hotmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-primary-400" />
                <div className="text-gray-300">
                  <a href="tel:+50769777262" className="block hover:text-white transition-colors">
                    +507 6977-7262
                  </a>
                  <a href="tel:+5073947705" className="block hover:text-white transition-colors">
                    +507 394-7705
                  </a>
                  <a href="tel:+5073947611" className="block hover:text-white transition-colors">
                    +507 394-7611
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
            <p className="text-sm text-gray-300 mb-4">
              También puede buscarnos en nuestras redes sociales
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/santamartapanama"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-forest-800 rounded-full hover:bg-primary-600 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/santamartapanama"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-forest-800 rounded-full hover:bg-primary-600 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Residencial Santa Marta. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
              <Link to="/nosotros" className="hover:text-white transition-colors">
                Nosotros
              </Link>
              <Link to="/servicios" className="hover:text-white transition-colors">
                Servicios
              </Link>
              <Link to="/contacto" className="hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
