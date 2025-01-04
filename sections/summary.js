export function loadSummary(summaryData) {
  if (!summaryData) return;

  const elements = [
    { id: 'page-title', label: 'Title', text: summaryData.title, fallback: 'No title available' },
    { id: 'title-length', label: 'Title Length', text: `${summaryData.titleLength || 0} characters` },
    { id: 'page-description', label: 'Description', text: summaryData.description, fallback: 'No description available' },
    { id: 'description-length', label: 'Description Length', text: `${summaryData.descriptionLength || 0} characters` },
    { id: 'page-keywords', label: 'Keywords', text: summaryData.keywords, fallback: 'Keywords are missing!' },
    { id: 'page-url', label: 'URL', text: summaryData.url, fallback: 'No URL found' },
    { id: 'page-canonical', label: 'Canonical URL', text: summaryData.canonical, fallback: 'No canonical URL found' },
    { id: 'page-robots', label: 'Robots', text: summaryData.robots, fallback: 'No robots tag found' },
    { id: 'page-author', label: 'Author', text: summaryData.author, fallback: 'Author is missing.' },
    { id: 'page-publisher', label: 'Publisher', text: summaryData.publisher, fallback: 'Publisher is missing.' },
    { id: 'page-lang', label: 'Language', text: summaryData.lang, fallback: 'Language not specified' }
  ];

  elements.forEach(({ id, text, fallback }) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text || fallback;
    }
  });

  // Add meta tags summary
  const metaTagsSummary = createMetaTagsSummary(summaryData.metaTags || []);
  const metaTagsContainer = document.getElementById('meta-tags-summary');
  if (metaTagsContainer) {
    metaTagsContainer.innerHTML = '';
    metaTagsContainer.appendChild(metaTagsSummary);
  }

  // Add page speed summary
  const pageSpeedSummary = createPageSpeedSummary(summaryData.pageSpeed || {});
  const pageSpeedContainer = document.getElementById('page-speed-summary');
  if (pageSpeedContainer) {
    pageSpeedContainer.innerHTML = '';
    pageSpeedContainer.appendChild(pageSpeedSummary);
  }
}

function createMetaTagsSummary(metaTags) {
  const metaTagsSummary = document.createElement('div');
  metaTagsSummary.className = 'mt-4';
  
  const title = document.createElement('h3');
  title.className = 'text-lg font-semibold mb-2';
  title.textContent = 'Meta Tags';
  
  const desc = document.createElement('div');
  desc.className = 'space-y-1';
  
  if (metaTags && metaTags.length > 0) {
    const list = document.createElement('ul');
    list.className = 'list-disc pl-5 space-y-1';
    metaTags.forEach(tag => {
      if (tag && tag.name && tag.content) {
        const item = document.createElement('li');
        item.className = 'text-sm';
        item.textContent = `${tag.name}: ${tag.content}`;
        list.appendChild(item);
      }
    });
    desc.appendChild(list);
  } else {
    const noTags = document.createElement('p');
    noTags.className = 'text-gray-500 text-sm';
    noTags.textContent = 'No meta tags found.';
    desc.appendChild(noTags);
  }
  
  metaTagsSummary.appendChild(title);
  metaTagsSummary.appendChild(desc);
  
  return metaTagsSummary;
}

function createPageSpeedSummary(pageSpeed) {
  const pageSpeedSummary = document.createElement('div');
  pageSpeedSummary.className = 'mt-4';
  
  const title = document.createElement('h3');
  title.className = 'text-lg font-semibold mb-2';
  title.textContent = 'Page Speed';
  
  const table = document.createElement('table');
  table.className = 'w-full text-sm';
  
  if (pageSpeed && Object.keys(pageSpeed).length > 0) {
    Object.entries(pageSpeed).forEach(([key, value]) => {
      const row = table.insertRow();
      const keyCell = row.insertCell(0);
      const valueCell = row.insertCell(1);
      
      keyCell.className = 'font-medium pr-4';
      keyCell.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      valueCell.className = 'text-right';
      valueCell.textContent = `${value} ms`;
    });
  } else {
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 2;
    cell.className = 'text-center text-gray-500';
    cell.textContent = 'No page speed data available';
  }
  
  pageSpeedSummary.appendChild(title);
  pageSpeedSummary.appendChild(table);
  
  return pageSpeedSummary;
}