import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const getSessionId = () => {
  const key = 'analytics_session_id';
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent;

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }

  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
};

const getBrowser = (): string => {
  const ua = navigator.userAgent;

  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';

  return 'Otro';
};

const getOS = (): string => {
  const ua = navigator.userAgent;

  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';

  return 'Otro';
};

export const usePageTracking = () => {
  const location = useLocation();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const trackPageView = async () => {
      const path = location.pathname;

      if (path.startsWith('/admin')) {
        return;
      }

      if (trackedPaths.current.has(path)) {
        return;
      }

      trackedPaths.current.add(path);

      try {
        await supabase.from('page_views').insert([{
          page_path: path,
          page_title: document.title,
          referrer: document.referrer || '',
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          session_id: getSessionId(),
        }]);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    const timer = setTimeout(trackPageView, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
