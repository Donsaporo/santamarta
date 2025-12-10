import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SEO } from '../components/SEO';
import { useState } from 'react';

export const Testimonios = () => {
  const heroRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Dr. Alfredo Martiz',
      role: 'Médico',
      content: 'Queremos expresar nuestro profundo agradecimiento al equipo del Residencial Santa Marta, por su dedicación, cariño y respeto hacia los adultos mayores. Saber que nuestros familiares está en manos de profesionales, nos hace sentir tranquilos sabiendo que están en un lugar donde los cuidan con tanto amor.',
      rating: 5,
      initial: 'AM',
      color: 'bg-forest-600',
    },
    {
      name: 'María Elena Rodríguez',
      role: 'Familiar de Residente',
      content: 'Por medio de la presente deseo dejar mi agradecimiento y satisfacción por la alta calidad de los servicios que está ofreciendo Santa Marta a mi madre, quien tiene 95 años, que como sabéis, está en silla de ruedas. He podido apreciar que está conectada en el Hogar y todo se debe, entre otros motivos a: Una administradora muy profesional, cariñosa y dedicada al bienestar de los residentes, técnicas en el cuidado del adulto mayor que son profesionales en la ejecución de sus funciones, cuidados de aseo personal óptimo y diario, cuidados médicos excelentes, tiene contacto con áreas verdes, hay un patio donde puede disfrutar de la naturaleza, paseos a áreas cercanas y una comida buena y balanceada. El Hogar tiene muy buenas instalaciones y con aire acondicionado central, muchas ventajas que proyectan luz natural dentro de Hogar, lo que dan una sensación de estar en casa al entrar. En resumidas cuentas, mi madre ha tenido un cambio notorio y significativo, está contenta, bien cuidada y alimentada, que es lo más importante que uno como familiar busca en un residencial para el adulto mayor. Doy gracias a Dios el haberme puesto en mis manos el "brochure" de Santa Marta, excelente decisión que tomé al llevar a mi madre a vivir allá.',
      rating: 5,
      initial: 'MR',
      color: 'bg-primary-600',
    },
    {
      name: 'Laura Guillen',
      role: 'Familiar de Residente',
      content: 'Definitivamente, cuando afrontamos momentos tan difíciles como el tener que compartir el cuidado de alguien amado e importante para nuestras vidas con extraños, nos llenamos de inquietudes y ansiedades. Encontrar lugares donde esa persona forme parte de un cuidado integral es sumamente importante. Hace meses tuvimos que hacer frente a esa clase de decisiones. Con incertidumbres y nostalgias encontramos este hogar, ¡esta familia! Nos hicimos parte de ella y ellos de nosotros. Mi mamita contó con todos los cuidados, el cariño y las atenciones que merecía. El personal, además de cumplir con su hermosa labor, también brinda el cariño y el apego que todos necesitamos en tiempos así. Solo me queda decir: ¡gracias por todo!',
      rating: 5,
      initial: 'LG',
      color: 'bg-sage-600',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      <SEO
        title="Testimonios"
        description="Lea los testimonios de familias satisfechas con nuestros servicios. Más de 25 años cuidando adultos mayores en Panamá con dedicación, cariño y profesionalismo. Historias reales de nuestros residentes y sus familias."
        keywords="testimonios residencial panamá, opiniones cuidado adultos mayores, familias satisfechas, experiencias residencial santa marta, reseñas home care"
        path="/testimonios"
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
            <Quote className="w-16 h-16 mx-auto mb-6 text-primary-400" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Testimonios
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              Lo que dicen las familias que confían en nosotros.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={testimonialsRef.ref}
        className="py-20 bg-gradient-to-br from-warm-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
              Historias de Familias Satisfechas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada testimonio refleja nuestro compromiso con el cuidado y el bienestar de
              nuestros residentes.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div
              className={`opacity-0 ${
                testimonialsRef.isVisible ? 'animate-fade-in-up' : ''
              }`}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 min-h-[500px] flex flex-col">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`${testimonials[currentTestimonial].color} w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
                    {testimonials[currentTestimonial].initial}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-forest-900 text-2xl mb-1">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-base text-gray-600 mb-2">{testimonials[currentTestimonial].role}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 flex items-center">
                  <Quote className="absolute -top-4 -left-4 w-16 h-16 md:w-20 md:h-20 text-forest-100 opacity-50" />
                  <p className="text-gray-700 text-lg leading-relaxed relative z-10 pl-8 md:pl-12">
                    {testimonials[currentTestimonial].content}
                  </p>
                  <Quote className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 text-forest-100 opacity-50 rotate-180" />
                </div>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-800 transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Testimonio anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? 'w-8 bg-forest-700'
                            : 'w-2 bg-forest-300 hover:bg-forest-400'
                        }`}
                        aria-label={`Ir al testimonio ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-800 transition-all duration-300 hover:scale-110 shadow-md"
                    aria-label="Siguiente testimonio"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 mb-16 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-md w-full group">
              <img
                src="https://imgur.com/ceHY4v6.jpg"
                alt="Un hogar lleno de alegría"
                className="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Un hogar lleno de alegría</h3>
                <p className="text-sm text-white/90">
                  Fomentamos la felicidad y el compañerismo, creando un entorno donde se sientan valorados y en familia.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-br from-forest-800 to-forest-900 rounded-3xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              ¿Quiere compartir su experiencia?
            </h3>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Nos encantaría conocer su historia. Su testimonio puede ayudar a otras familias
              a tomar la mejor decisión para sus seres queridos. Contáctenos hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+50769777262"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Llamar Ahora
              </a>
              <a
                href="mailto:resi_santamarta@hotmail.com"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-forest-800 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl font-bold text-forest-700 mb-2">25+</div>
              <p className="text-gray-700">Años de experiencia</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-forest-700 mb-2">100%</div>
              <p className="text-gray-700">Familias satisfechas</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-forest-700 mb-2">24/7</div>
              <p className="text-gray-700">Atención continua</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};
