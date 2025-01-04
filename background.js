// Background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSummaryData' || request.action === 'analyzePage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: request.action === 'getSummaryData' ? getSummaryData : analyzePage
        },
        (results) => {
          sendResponse(results[0].result);
        }
      );
    });
    return true;
  }
});

function getSummaryData() {
  const title = document.querySelector('title')?.textContent || '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const author = document.querySelector('meta[name="author"]')?.getAttribute('content') || '';
  const publisher = document.querySelector('meta[name="publisher"]')?.getAttribute('content') || '';
  const lang = document.documentElement.lang || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

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

function analyzePage() {
  const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
    tag: h.tagName,
    text: h.innerText.trim()
  }));

  const images = Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src || img.getAttribute('data-src') || '',
    alt: img.alt || '',
    title: img.getAttribute('title') || '',
    width: img.width || null,
    height: img.height || null,
    loading: img.loading || 'auto',
    format: img.src.split('.').pop().toLowerCase()
  }));

  const links = Array.from(document.querySelectorAll('a')).map(a => ({
    href: a.href,
    text: a.innerText.trim() || 'No Text',
    title: a.title || '',
    rel: a.rel
  }));

  const social = Array.from(document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')).map(meta => ({
    property: meta.getAttribute('property') || meta.getAttribute('name'),
    content: meta.content
  }));

  return {
    headers,
    images,
    links,
    social,
    url: window.location.href
  };
}