import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContentItem {
  key: string;
  value: string;
  section: string;
  label: string;
  field_type: 'input' | 'textarea';
}

let cachedContent: Record<string, string> | null = null;

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, string>>(cachedContent || {});
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent) return;

    const fetchContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value');

        if (data) {
          const map: Record<string, string> = {};
          data.forEach((item: { key: string; value: string }) => {
            map[item.key] = item.value;
          });
          cachedContent = map;
          setContent(map);
        }
      } catch (error) {
        console.error('Error fetching site content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getText = (key: string, defaultValue: string): string => {
    return content[key] || defaultValue;
  };

  return { getText, loading };
};

export const useSiteContentAdmin = () => {
  const [items, setItems] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await supabase
        .from('site_content')
        .select('key, value, section, label, field_type')
        .order('section');

      setItems((data as SiteContentItem[]) || []);
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (key: string, value: string) => {
    setItems(prev => prev.map(item =>
      item.key === key ? { ...item, value } : item
    ));
  };

  const saveSection = async (section: string): Promise<boolean> => {
    setSaving(true);
    try {
      const sectionItems = items.filter(item => item.section === section);
      for (const item of sectionItems) {
        const { error } = await supabase
          .from('site_content')
          .update({ value: item.value, updated_at: new Date().toISOString() })
          .eq('key', item.key);

        if (error) throw error;
      }
      cachedContent = null;
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getBySection = (section: string) =>
    items.filter(item => item.section === section);

  return { items, loading, saving, updateItem, saveSection, getBySection };
};
