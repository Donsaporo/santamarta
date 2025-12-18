import { Heart, Shield, Users, MessageCircle, HeartHandshake, Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SEO } from '../components/SEO';

export const Home = () => {
  const heroRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const introRef = useScrollAnimation();

  const values = [
    { icon: Heart, title: 'Dignidad', color: 'text-forest-600' },
    { icon: MessageCircle, title: 'Comunicación', color: 'text-forest-600' },
    { icon: HeartHandshake, title: 'Amor', color: 'text-forest-600' },
    { icon: Users, title: 'Empatía', color: 'text-forest-600' },
    { icon: Shield, title: 'Seguridad', color: 'text-forest-600' },
    { icon: HomeIcon, title: 'Protección', color: 'text-forest-600' },
  ];


  return (
    <>
      <SEO
        title="Home Care para Adultos Mayores en Panamá"
        description="Casa Hogar dedicada al cuidado integral del adulto mayor en Panamá. Más de 25 años de experiencia brindando atención de calidad con servicios de estadía permanente, temporal, pasadía y cuidados post operatorios. Certificados por MIDES."
        keywords="residencial adulto mayor panamá, home care panamá, casa hogar adultos mayores, cuidado tercera edad, Santa Marta, residencial certificado MIDES, atención geriátrica panamá"
        path="/"
      />
      <div className="min-h-screen">
      <section
        ref={heroRef.ref}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptLTQgNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bS00IDR2MmgtMnYtMmgyem0wLTR2MmgtMnYtMmgyem0tNCA0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`opacity-0 ${
              heroRef.isVisible ? 'animate-fade-in-up' : ''
            }`}
          >
            <img
              src="/Logo-1024x233.png"
              alt="Residencial Santa Marta"
              className="h-16 sm:h-20 md:h-24 mx-auto mb-8 brightness-0 invert drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-50 to-white bg-clip-text text-transparent drop-shadow-lg">
                CASA HOGAR RESIDENCIAL
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent drop-shadow-lg">
                SANTA MARTA
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-4 font-light">
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-md">
                Vida, Salud y Familia.
              </span>
            </p>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto drop-shadow-md">
              Dedicados al cuidado del adulto mayor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/servicios" variant="secondary" size="lg">
                Conocer Servicios
              </Button>
              <Button to="/contacto" variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-forest-800">
                Contactar Ahora
              </Button>
            </div>
          </div>
        </div>

      </section>

      <section
        ref={valuesRef.ref}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En Santa Marta brindamos a nuestros residentes un servicio completo y permanente,
              con un equipo calificado que garantiza su bienestar y calidad de vida.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const delays = ['animation-delay-0', 'animation-delay-200', 'animation-delay-400', 'animation-delay-600', 'animation-delay-800', 'animation-delay-1000'];
              return (
                <div
                  key={index}
                  className={`opacity-0 ${
                    valuesRef.isVisible ? 'animate-scale-in' : ''
                  } ${delays[index] || 'animation-delay-0'} bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-4 bg-forest-50 rounded-full group-hover:bg-forest-100 transition-colors">
                      <Icon className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{value.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={introRef.ref}
        className="py-20 bg-gradient-to-br from-forest-50 to-warm-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`opacity-0 ${
                introRef.isVisible ? 'animate-slide-in-left' : ''
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-900 mb-6">
                Más de 25 años cuidando a nuestros adultos mayores
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Santa Marta, fundada en 1999 por empresarios panameños, ofrece atención
                  integral y de calidad a la tercera edad, con más de 25 años de experiencia
                  y certificación del MIDES.
                </p>
                <p className="text-lg">
                  Nuestro servicio se centra en preservar la calidad de vida en un ambiente de
                  paz, amor y armonía, respetando la diversidad cultural y religiosa.
                </p>
                <p className="text-lg">
                  Contamos con un equipo especializado de médicos, enfermeras y cuidadores,
                  además de instalaciones seguras con áreas sociales, dormitorios equipados y
                  sistemas de seguridad.
                </p>
              </div>
              <div className="mt-8">
                <Button to="/nosotros" variant="primary" size="lg">
                  Conocer Más
                </Button>
              </div>
            </div>

            <div
              className={`opacity-0 ${
                introRef.isVisible ? 'animate-slide-in-right' : ''
              } relative`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/image1.jpg"
                  alt="Habitaciones cómodas y equipadas del Residencial Santa Marta"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <p className="text-4xl font-bold text-forest-700 mb-2">25+</p>
                <p className="text-gray-700 font-medium">Años de experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-forest-800 to-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            ¿Necesita más información?
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Estamos aquí para ayudarle. Contáctenos y con gusto le brindaremos toda la
            información que necesite para su ser querido.
          </p>
          <Button to="/contacto" variant="secondary" size="lg">
            Contactar Ahora
          </Button>
        </div>
      </section>
      </div>
    </>
  );
};
