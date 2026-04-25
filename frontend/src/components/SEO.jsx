// MoveSmart — SEO Component (Dynamic Head Tags)
import { useEffect } from 'react';

const SITE_NAME = 'MoveSmart';
const BASE_URL = 'https://movesmart.app';
const DEFAULT_IMG = `${BASE_URL}/og-image.png`;

export default function SEO({ title, description, path = '/', keywords = '', type = 'website' }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Smart Urban Mobility Platform`;
  const fullDesc = description || 'MoveSmart is a next-generation urban mobility platform with real-time tracking, intelligent routing, and safety-first infrastructure for students, professionals, and late-night travelers.';
  const fullUrl = `${BASE_URL}${path}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
    const metas = {
      'description': fullDesc,
      'keywords': keywords || 'MoveSmart, urban mobility, real-time tracking, smart routing, safety, school bus tracking, women safety, traffic, commute, public transport',
      'author': 'MoveSmart Team',
      'robots': 'index, follow',
      // Open Graph
      'og:title': fullTitle,
      'og:description': fullDesc,
      'og:url': fullUrl,
      'og:type': type,
      'og:site_name': SITE_NAME,
      'og:image': DEFAULT_IMG,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:locale': 'en_IN',
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': fullDesc,
      'twitter:image': DEFAULT_IMG,
      // App-specific
      'application-name': SITE_NAME,
      'apple-mobile-web-app-title': SITE_NAME,
      'theme-color': '#1A73E8',
    };

    Object.entries(metas).forEach(([key, value]) => {
      const isOG = key.startsWith('og:') || key.startsWith('twitter:');
      const attr = isOG ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

  }, [fullTitle, fullDesc, fullUrl, keywords, type]);

  return null;
}
