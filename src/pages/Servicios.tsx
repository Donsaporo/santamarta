import { Clock, Calendar, Coffee, Heart, Check, Stethoscope } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';

export const Servicios = () => {
  const heroRef = useScrollAnimation();
  const servicesRef = useScrollAnimation();
  const galleryRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();

  const services = [
    {
      icon: Clock,
      title: 'Estadía Permanente',
      description: 'Estadía por tiempo ilimitado',
      color: 'from-forest-600 to-forest-700',
      features: [
        'Supervisión continua las 24 horas los 365 días del año',
        'Aseo personal',
        'Monitoreo de signos vitales',
        'Administración y suministro de medicinas e insumos',
        'Comida con dietas balanceadas',
        'Servicio de internet por cable',
        'Lavandería',
        'Servicio de ambulancia',
        'Terapias cognitivas y físicas',
        'Entretenimiento grupal',
      ],
    },
    {
      icon: Calendar,
      title: 'Estadía Temporal',
      description: 'Estadía por tiempo limitado (ideal para familiares que deben salir del país o se encuentran en momentos donde requieren apoyo momentáneo)',
      color: 'from-primary-500 to-primary-600',
      features: [
        'Supervisión continua las 24 horas',
        'Aseo personal',
        'Monitoreo de signos vitales',
        'Administración y suministros de medicinas e insumos',
        'Comida con dietas balanceadas y atendiendo a la condición de la persona',
        'Servicio de internet y televisión por cable',
        'Lavandería',
        'Servicio de ambulancia',
        'Entretenimiento grupal',
      ],
    },
    {
      icon: Coffee,
      title: 'Pasadía (Club)',
      description: 'Desarrollado para personas que quieren pasar un rato agradable con su grupo contemporáneo o familiares que no quieren que sus seres queridos no se aburran en casa, al mismo tiempo que pasen con personas de su grupo de edad en un ambiente seguro cumpliendo con las directrices médicas',
      color: 'from-sage-500 to-sage-600',
      features: [
        'Supervisión por personal idóneo',
        'Terapias cognitivas',
        'Terapias físicas',
        'Administración y suministro de medicinas e insumos',
        'Comidas con dietas balanceadas y atendiendo a la condición de la persona',
        'Servicio de internet y televisión por cable',
        'Servicio de ambulancia',
        'Entretenimiento grupal',
      ],
    },
    {
      icon: Stethoscope,
      title: 'Cuidados Post Operatorios',
      description: 'Estadía por tiempo limitado orientado para personas que requieren atención especial después de una cirugía o tratamiento',
      color: 'from-forest-500 to-primary-600',
      features: [
        'Supervisión continua las 24 horas',
        'Aseo personal',
        'Monitoreo de signos vitales',
        'Administración y suministro de medicinas e insumos',
        'Comida con dietas balanceadas y atendiendo a la condición de la persona',
        'Servicio de internet y televisión por cable',
        'Lavandería',
        'Servicio de ambulancia',
        'Terapia física',
      ],
    },
  ];


  return (
    <>
      <SEO
        title="Nuestros Servicios"
        description="Servicios flexibles de cuidado para adultos mayores: estadía permanente, temporal, pasadía (club) y cuidados post operatorios. Atención 24/7 con personal especializado, alimentación balanceada y actividades terapéuticas."
        keywords="estadía permanente adultos mayores, estadía temporal panamá, pasadía club ancianos, cuidados post operatorios, atención 24/7 adulto mayor, servicios geriatría"
        path="/servicios"
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
            <Heart className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              Ofrecemos opciones flexibles de atención adaptadas a las necesidades de cada familia.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={servicesRef.ref}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const delays = ['animation-delay-0', 'animation-delay-200'];
              return (
                <div
                  key={index}
                  className={`opacity-0 ${
servicesRef.isVisible ? 'animate-fade-in-up' : ''
                  } ${delays[index % 2]} group h-full`}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                    <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                      <Icon className="w-10 h-10 mb-3" />
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-xs text-white/90 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="p-6 flex-1">
                      <h4 className="font-semibold text-forest-900 mb-3 text-base">
                        Servicios incluidos:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="p-0.5 bg-forest-100 rounded-full">
                                <Check className="w-3 h-3 text-forest-700" />
                              </div>
                            </div>
                            <span className="text-xs leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={galleryRef.ref}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`opacity-0 ${
galleryRef.isVisible ? 'animate-fade-in-up' : ''
            } text-center mb-12`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
              Nuestras Instalaciones
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Espacios diseñados con cariño para el bienestar y comodidad de nuestros residentes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={`opacity-0 ${
  galleryRef.isVisible ? 'animate-fade-in-up' : ''
              } animation-delay-0`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64">
                <img
                  src="/image1.jpg"
                  alt="Habitaciones cómodas y equipadas"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg font-bold mb-1">Habitaciones Equipadas</h3>
                  <p className="text-sm text-white/90">Espacios cómodos y acogedores</p>
                </div>
              </div>
            </div>

            <div
              className={`opacity-0 ${
  galleryRef.isVisible ? 'animate-fade-in-up' : ''
              } animation-delay-200`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64">
                <img
                  src="/image2.jpg"
                  alt="Jardines y áreas verdes"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg font-bold mb-1">Jardines y Áreas Verdes</h3>
                  <p className="text-sm text-white/90">Naturaleza y tranquilidad</p>
                </div>
              </div>
            </div>

            <div
              className={`opacity-0 ${
  galleryRef.isVisible ? 'animate-fade-in-up' : ''
              } animation-delay-400`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64">
                <img
                  src="/image3.jpg"
                  alt="Instalaciones seguras y profesionales"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-lg font-bold mb-1">Instalaciones Seguras</h3>
                  <p className="text-sm text-white/90">Señalización y protección profesional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={featuresRef.ref}
        className="py-20 bg-gradient-to-br from-warm-50 to-forest-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`opacity-0 ${
featuresRef.isVisible ? 'animate-fade-in-up' : ''
            } bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto text-center`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-forest-900 mb-4">
              ¿No está seguro cuál servicio necesita?
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Nuestro equipo está listo para ayudarle a encontrar la mejor opción para su
              ser querido. Contáctenos y con gusto le brindaremos toda la información que necesite sobre nuestros servicios.
            </p>
            <Button to="/contacto" variant="primary" size="lg">
              Contactar Ahora
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};
