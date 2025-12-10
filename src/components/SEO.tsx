import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  path?: string;
}

export const SEO = ({
  title,
  description,
  keywords = "residencial adulto mayor panamá, home care panamá, casa hogar adultos mayores, cuidado tercera edad, Santa Marta",
  ogImage = "https://residencialsantamarta.com/Logo-1024x233.png",
  path = ""
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Residencial Santa Marta`;
    const url = `https://residencialsantamarta.com${path}`;

    document.title = fullTitle;

    const updateMetaTag = (selector: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${selector}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', ogImage, true);

    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:image', ogImage);

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = url;
    }
  }, [title, description, keywords, ogImage, path]);

  return null;
};
