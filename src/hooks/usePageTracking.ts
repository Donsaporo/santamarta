import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';

const GEO_CACHE_KEY = 'analytics_geo_data';
const SESSION_KEY = 'analytics_session_id';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('SamsungBrowser')) return 'Samsung';
  if (ua.includes('Firefox')) return 'Firefox';
  if ((navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } }).brave) return 'Brave';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Otro';
};

const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Otro';
};

const getCleanReferrer = (): string => {
  const ref = document.referrer;
  if (!ref) return '';
  try {
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return '';
    return url.hostname;
  } catch {
    return '';
  }
};

interface GeoData {
  country: string;
  city: string;
}

const getGeoData = async (): Promise<GeoData> => {
  const cached = sessionStorage.getItem(GEO_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch { /* ignore */ }
  }

  try {
    const res = await fetch('http://ip-api.com/json/?fields=country,city');
    if (res.ok) {
      const json = await res.json();
      const data: GeoData = {
        country: json.country || '',
        city: json.city || '',
      };
      sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch { /* silent fail */ }

  return { country: '', city: '' };
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      const path = location.pathname;
      if (path.startsWith('/admin')) return;

      const geo = await getGeoData();

      try {
        await api.analytics.track({
          page_path: path,
          page_title: document.title,
          referrer: getCleanReferrer(),
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          country: geo.country,
          city: geo.city,
          session_id: getSessionId(),
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    const timer = setTimeout(trackPageView, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);
};
