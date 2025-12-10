import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SEO } from '../components/SEO';

export const Contacto = () => {
  const heroRef = useScrollAnimation();
  const infoRef = useScrollAnimation();

  return (
    <>
      <SEO
        title="Contáctenos"
        description="Contáctenos para más información sobre nuestros servicios. Teléfonos: +507 6977-7262, +507 394-7705. Dirección: Ave. Angel Rubio y Calle 3ra, Nuevo Reparto el Carmen, Panamá. Email: resi_santamarta@hotmail.com"
        keywords="contacto residencial panamá, teléfono home care, dirección residencial santa marta, ubicación cuidado adultos mayores, información servicios geriatría"
        path="/contacto"
      />
      <div className="min-h-screen pt-20">
      <section
        ref={heroRef.ref}
        className="relative py-20 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptLTQgNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bS00IDR2MmgtMnYtMmgyem0wLTR2MmgtMnYtMmgyem0tNCA0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`opacity-0 text-center ${
              heroRef.isVisible ? 'animate-fade-in-up' : ''
            }`}
          >
            <Mail className="w-16 h-16 mx-auto mb-6 text-primary-400" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Contáctenos
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              Estamos aquí para responder todas sus preguntas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={infoRef.ref}
            className={`opacity-0 ${
              infoRef.isVisible ? 'animate-fade-in-up' : ''
            }`}
          >
              <div>
                <h2 className="text-3xl font-bold text-forest-900 mb-6">
                  Información de Contacto
                </h2>
                <p className="text-gray-700 mb-8">
                  Puede visitarnos, llamarnos o escribirnos. Estamos disponibles para atenderle en cualquier momento.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-forest-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-forest-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-2">Dirección</h3>
                      <a
                        href="https://www.google.com/maps/place/Ave.+Angel+Rubio+y+Calle+3ra,+Nuevo+Reparto+el+Carmen,+Ciudad+Panam%C3%A1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-forest-700 transition-colors"
                      >
                        Ave. Angel Rubio y Calle 3ra, Nuevo Reparto el Carmen, atrás del Parque
                        Benito Juárez, Ciudad Panamá, Panamá
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-forest-100 rounded-xl">
                      <Phone className="w-6 h-6 text-forest-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-2">Teléfonos</h3>
                      <div className="space-y-1">
                        <a
                          href="tel:+50769777262"
                          className="block text-gray-700 hover:text-forest-700 transition-colors"
                        >
                          +507 6977-7262
                        </a>
                        <a
                          href="tel:+5073947705"
                          className="block text-gray-700 hover:text-forest-700 transition-colors"
                        >
                          +507 394-7705
                        </a>
                        <a
                          href="tel:+5073947611"
                          className="block text-gray-700 hover:text-forest-700 transition-colors"
                        >
                          +507 394-7611
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-forest-100 rounded-xl">
                      <Mail className="w-6 h-6 text-forest-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-2">Email</h3>
                      <a
                        href="mailto:resi_santamarta@hotmail.com"
                        className="text-gray-700 hover:text-forest-700 transition-colors"
                      >
                        resi_santamarta@hotmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-forest-800 to-forest-900 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="font-semibold mb-4">Síguenos en Redes Sociales</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.facebook.com/santamartapanama"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
                      aria-label="Facebook"
                    >
                      <Facebook size={24} />
                    </a>
                    <a
                      href="https://www.instagram.com/santamartapanama"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <Instagram size={24} />
                    </a>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="w-full h-96 bg-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6241449999997!2d-79.53371!3d9.01167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDIuMCJOIDc5wrAzMicwMS40Ilc!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Residencial Santa Marta"
          />
        </div>
      </section>
      </div>
    </>
  );
};
