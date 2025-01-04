export function loadTools(url) {
  const toolCategories = [
    {
      name: '🎯 SEO',
      tools: [
        { name: '⚡ PageSpeed', url: `http://developers.google.com/speed/pagespeed/insights/?url=${url}` },
        { name: '📊 GTmetrix', url: `http://gtmetrix.com/?url=${url}` },
        { name: '🔍 Rich Results', url: `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}&user_agent=1` },
        { name: '👑 Majestic', url: `http://www.majesticseo.com/reports/site-explorer/summary/${new URL(url).hostname}` },
        { name: '📈 ahrefs', url: `https://app.ahrefs.com/site-explorer/overview/v2/exact/live?target=${url}` },
        { name: '📉 similarweb', url: `https://www.similarweb.com/en/website/${new URL(url).hostname}` },
        { name: '🔎 SEO Checker', url: `https://seocheki.net/site-check.php?u=${url}` },
        { name: '🎮 Search Console', url: `https://search.google.com/search-console/performance/search-analytics?resource_id=${url}&page=*/` }
      ]
    },
    {
      name: '🛠️ Technical',
      tools: [
        { name: '📱 Mobile-Friendly', url: `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}` },
        { name: '🔧 HTML Validator', url: `http://validator.w3.org/nu/?doc=${url}` },
        { name: '🎨 CSS Validator', url: `https://jigsaw.w3.org/css-validator/validator?uri=${url}` },
        { name: '📱 Responsinator', url: `https://www.responsinator.com/?url=${url}` },
        { name: '🖥️ Screen Test', url: `http://whatismyscreenresolution.net/multi-screen-test?site-url=${url}&w=414&h=736` }
      ]
    },
    {
      name: '🌐 Social',
      tools: [
        { name: '👥 Facebook Debug', url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}` },
        { name: '🐦 Twitter Card', url: 'https://cards-dev.twitter.com/validator' },
        { name: '📌 Pinterest', url: `https://developers.pinterest.com/tools/url-debugger/?link=${encodeURIComponent(url)}` },
        { name: '🔄 Tweet Search', url: `https://twitter.com/search?f=tweets&q=${encodeURIComponent(url)}` }
      ]
    },
    {
      name: '🔒 Security',
      tools: [
        { name: '🛡️ McAfee', url: `http://www.siteadvisor.com/sites/${new URL(url).hostname}` },
        { name: '🔐 Safe Browsing', url: `http://www.google.com/safebrowsing/diagnostic?site=${new URL(url).hostname}` }
      ]
    },
    {
      name: '🔍 Analysis',
      tools: [
        { name: '🔎 Site Search', url: `https://www.google.com/search?q=site:${encodeURIComponent(url)}&gws_rd=cr,ssl` },
        { name: '🔄 Similar Pages', url: `https://www.google.com/search?q=related:${encodeURIComponent(url)}&gws_rd=cr,ssl` },
        { name: '🔗 Backlinks', url: `https://www.google.com/search?q=link:${encodeURIComponent(url)}&gws_rd=cr,ssl` },
        { name: '🖼️ Images', url: `https://www.google.com/search?tbm=isch&q=site:${new URL(url).hostname}` },
        { name: '📋 WHOIS', url: `https://dnsquery.org/whois/${new URL(url).hostname}` },
        { name: '📊 Analytics', url: `https://www.quantcast.com/${new URL(url).hostname}` }
      ]
    }
  ];

  const toolsContent = document.getElementById('tools-content');
  toolsContent.innerHTML = '';

  const toolsContainer = document.createElement('div');
  toolsContainer.className = 'space-y-4';

  toolCategories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'mb-4';
    categoryElement.innerHTML = `<h3 class="text-lg font-semibold mb-2">${category.name}</h3>`;

    const toolsList = document.createElement('ul');
    toolsList.className = 'space-y-2';

    category.tools.forEach(tool => {
      const toolItem = document.createElement('li');
      toolItem.innerHTML = `
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" 
           class="flex items-center text-blue-600 hover:underline">
          <span class="mr-2">${tool.name}</span>
        </a>
      `;
      toolsList.appendChild(toolItem);
    });

    categoryElement.appendChild(toolsList);
    toolsContainer.appendChild(categoryElement);
  });

  toolsContent.appendChild(toolsContainer);

  const instructionText = document.createElement('p');
  instructionText.className = 'text-sm text-gray-600 mt-4';
  instructionText.textContent = 'Use CTRL + CLICK to open links in background.';
  toolsContent.insertBefore(instructionText, toolsContainer);
}