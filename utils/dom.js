// DOM utility functions
export function getMetaTag(name) {
  return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';
}

export function getCanonicalUrl() {
  return document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
}

export function getAllMetaTags() {
  return Array.from(document.getElementsByTagName('meta')).map(tag => ({
    name: tag.getAttribute('name') || tag.getAttribute('property'),
    content: tag.getAttribute('content')
  })).filter(tag => tag.name && tag.content);
}