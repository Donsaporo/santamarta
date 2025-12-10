import { useLoading } from '../../contexts/LoadingContext';

export const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src="/Icono-988x1024.png"
            alt="Residencial Santa Marta"
            className="h-24 w-24 animate-scale-in"
          />
          <div className="absolute -inset-4 animate-spin-slow rounded-full border-2 border-t-forest-600 border-r-transparent border-b-transparent border-l-transparent" />
        </div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-full origin-left animate-[slideInRight_1.5s_ease-out] bg-gradient-to-r from-forest-600 to-primary-500" />
        </div>
      </div>
    </div>
  );
};
