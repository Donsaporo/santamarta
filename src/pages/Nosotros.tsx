import { Award, Users, Heart, Shield, Building, Check, Stethoscope, Flame } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SEO } from '../components/SEO';

export const Nosotros = () => {
  const heroRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  const teamRef = useScrollAnimation();
  const facilitiesRef = useScrollAnimation();

  const stats = [
    { number: '1999', label: 'Año de fundación' },
    { number: '25+', label: 'Años de experiencia' },
    { number: '100%', label: 'Certificado por MIDES' },
    { number: '24/7', label: 'Atención continua' },
  ];

  const team = [
    { icon: Users, title: 'Médicos especializados', description: 'Profesionales en geriatría y medicina general certificados' },
    { icon: Heart, title: 'Enfermeras capacitadas', description: 'Atención personalizada y cuidados permanentes profesionales' },
    { icon: Shield, title: 'Cuidadores certificados', description: 'Personal entrenado en cuidado del adulto mayor' },
    { icon: Users, title: 'Personal Técnico capacitado', description: 'Equipo especializado en terapias y rehabilitación' },
  ];

  const facilities = [
    'Áreas sociales amplias y confortables',
    'Dormitorios equipados con aire acondicionado',
    'Sistemas de seguridad 24/7',
    'Áreas verdes y espacios al aire libre',
    'Comedores con ambiente familiar',
    'Salas de terapia y rehabilitación',
    'Planta de agua',
    'Lavandería',
    'Conexión a internet y televisión por cable',
  ];

  return (
    <>
      <SEO
        title="¿Quiénes Somos?"
        description="Residencial Santa Marta fundada en 1999. Más de 25 años de experiencia cuidando adultos mayores en Panamá. Certificados por MIDES, MINSA, Bomberos y SINAPROC. Equipo profesional, instalaciones modernas y seguras con atención 24/7."
        keywords="residencial santa marta panamá, historia residencial, certificado MIDES MINSA SINAPROC Bomberos, equipo profesional geriatría, instalaciones adulto mayor, experiencia cuidado ancianos, certificaciones Panamá"
        path="/nosotros"
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
            <Award className="w-16 h-16 mx-auto mb-6 text-primary-400" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              ¿Quiénes Somos?
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              Más de 25 años de experiencia brindando atención integral y de calidad a la tercera edad.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const delays = ['animation-delay-0', 'animation-delay-200', 'animation-delay-400', 'animation-delay-600'];
              return (
                <div
                  key={index}
                  className={`opacity-0 ${
                    heroRef.isVisible ? 'animate-scale-in' : ''
                  } ${delays[index] || 'animation-delay-0'} text-center`}
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={missionRef.ref}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className={`opacity-0 ${
                missionRef.isVisible ? 'animate-fade-in-up' : ''
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-forest-50 px-4 py-2 rounded-full mb-6">
                <Building className="w-5 h-5 text-forest-600" />
                <span className="text-sm font-semibold text-forest-800">Nuestra Historia</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-6">
                Una mano amiga para las familias panameñas
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Santa Marta fue fundada en 1999 por empresarios panameños con la visión de
                  ofrecer atención integral y de calidad a la tercera edad. Con más de 25 años
                  de experiencia, nos hemos consolidado como un referente en el cuidado del
                  adulto mayor en Panamá.
                </p>

                <p className="text-lg">
                  Contamos con las certificaciones del Ministerio de Desarrollo Social (MIDES),
                  Ministerio de Salud (MINSA), Benemérito Cuerpo de Bomberos y SINAPROC,
                  lo que avala nuestro compromiso con los más altos estándares de calidad,
                  seguridad y atención sanitaria en el servicio.
                </p>

                <p className="text-lg">
                  Nuestro servicio se centra en preservar la calidad de vida de nuestros
                  residentes en un ambiente de paz, amor y armonía, respetando la diversidad
                  cultural y religiosa de cada persona.
                </p>

                <p className="text-lg font-semibold text-forest-800">
                  Nos presentamos como una mano amiga para las familias que necesitan apoyo
                  en el cuidado de sus seres queridos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={teamRef.ref}
        className="py-20 bg-gradient-to-br from-forest-50 to-warm-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Nuestro Equipo Profesional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Personal altamente calificado dedicado al bienestar de nuestros residentes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => {
              const Icon = member.icon;
              const delays = ['animation-delay-0', 'animation-delay-200', 'animation-delay-400', 'animation-delay-600'];
              return (
                <div
                  key={index}
                  className={`opacity-0 ${
                    teamRef.isVisible ? 'animate-fade-in-up' : ''
                  } ${delays[index] || 'animation-delay-0'} bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-forest-100 rounded-full mb-4">
                      <Icon className="w-10 h-10 text-forest-700" />
                    </div>
                    <h3 className="text-xl font-bold text-forest-900 mb-3">
                      {member.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={facilitiesRef.ref}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`opacity-0 ${
                facilitiesRef.isVisible ? 'animate-slide-in-left' : ''
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-forest-50 px-4 py-2 rounded-full mb-6">
                <Building className="w-5 h-5 text-forest-600" />
                <span className="text-sm font-semibold text-forest-800">Nuestras Instalaciones</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-6">
                Espacios diseñados para el bienestar
              </h2>

              <p className="text-lg text-gray-700 mb-8">
                Contamos con instalaciones modernas y seguras, especialmente diseñadas para
                brindar comodidad, seguridad y bienestar a nuestros residentes. Cada espacio está pensado para su tranquilidad.
              </p>

              <div className="space-y-3">
                {facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-1 bg-forest-100 rounded-full group-hover:bg-forest-200 transition-colors">
                        <Check className="w-4 h-4 text-forest-700" />
                      </div>
                    </div>
                    <p className="text-gray-700">{facility}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`opacity-0 ${
                facilitiesRef.isVisible ? 'animate-slide-in-right' : ''
              } flex justify-center`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group max-w-md w-full">
                <img
                  src="https://imgur.com/Wzs8vbV.jpg"
                  alt="Espacios cómodos y seguros"
                  className="w-full h-[320px] md:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-forest-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Espacios cómodos y seguros</h3>
                  <p className="text-sm text-white/90">Instalaciones diseñadas para el bienestar, con ambientes acogedores y adaptados a sus necesidades.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-forest-800 to-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Nuestras Certificaciones
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              Estamos orgullosos de contar con la Certificación del Ministerio de Desarrollo Social (MIDES),
              Ministerio de Salud (MINSA), Benemérito Cuerpo de Bomberos y Sistema Nacional de Protección Civil (SINAPROC),
              lo que garantiza que cumplimos con todos los estándares de calidad, seguridad, protección civil y atención
              sanitaria requeridos para el cuidado integral del adulto mayor en Panamá.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white rounded-xl mb-4">
                  <Award className="w-12 h-12 text-forest-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">MIDES</h3>
                <p className="text-sm text-gray-200">Ministerio de Desarrollo Social</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white rounded-xl mb-4">
                  <Stethoscope className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">MINSA</h3>
                <p className="text-sm text-gray-200">Ministerio de Salud</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white rounded-xl mb-4">
                  <Flame className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bomberos</h3>
                <p className="text-sm text-gray-200">Benemérito Cuerpo de Bomberos</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white rounded-xl mb-4">
                  <Shield className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">SINAPROC</h3>
                <p className="text-sm text-gray-200">Sistema Nacional de Protección Civil</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};
