import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Save, Type } from 'lucide-react';
import { useSiteContentAdmin } from '../../hooks/useSiteContent';

const SECTIONS = [
  { key: 'hero', label: 'Hero / Portada', description: 'Titulo principal, lema y botones del banner' },
  { key: 'values', label: 'Valores', description: 'Nombres de los 6 valores y texto descriptivo' },
  { key: 'about', label: 'Sobre Nosotros', description: 'Titulo, parrafos descriptivos y badge de experiencia' },
  { key: 'cta', label: 'Llamada a la Accion', description: 'Seccion final con titulo, descripcion y boton' },
];

export const AdminSiteContent = () => {
  const { loading, saving, updateItem, saveSection, getBySection } = useSiteContentAdmin();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (sectionKey: string) => {
    const ok = await saveSection(sectionKey);
    if (ok) {
      setSavedSection(sectionKey);
      setTimeout(() => setSavedSection(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contenido del Sitio</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edita los textos de la pagina principal sin tocar el codigo
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isOpen = openSections[section.key] || false;
          const items = getBySection(section.key);
          const isSaved = savedSection === section.key;

          return (
            <div
              key={section.key}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {items.length} campos
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    {items.map((item) => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {item.label}
                        </label>
                        {item.field_type === 'textarea' ? (
                          <textarea
                            value={item.value}
                            onChange={(e) => updateItem(item.key, e.target.value)}
                            rows={3}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors text-sm resize-vertical"
                          />
                        ) : (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => updateItem(item.key, e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-3">
                    {isSaved && (
                      <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                        <Check className="w-4 h-4" />
                        Guardado
                      </span>
                    )}
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Guardar {section.label}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-forest-50 border border-forest-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Type className="w-5 h-5 text-forest-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-forest-800">
            <p className="font-medium mb-1">Sobre esta seccion</p>
            <p className="text-forest-700">
              Los cambios que hagas aqui se reflejaran inmediatamente en la pagina principal
              del sitio. El diseno, colores y estructura de la pagina no se modifican,
              solo los textos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
