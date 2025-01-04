import { getMetaTag, getCanonicalUrl } from './dom.js';

export function getSEOData() {
  const title = document.querySelector('title')?.textContent || '';
  const description = getMetaTag('description');
  const keywords = getMetaTag('keywords');
  const robots = getMetaTag('robots');
  const author = getMetaTag('author');
  const publisher = getMetaTag('publisher');
  const lang = document.documentElement.lang || '';
  const canonical = getCanonicalUrl();

  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    keywords,
    url: window.location.href,
    canonical,
    robots,
    author,
    publisher,
    lang
  };
}