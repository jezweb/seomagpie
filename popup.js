import { initializeTabs } from './sections/tabs.js'
import { loadSummary } from './sections/summary.js'
import { loadHeaders } from './sections/headers.js'
import { loadImages } from './sections/images.js'
import { loadLinks } from './sections/links.js'
import { loadSocial } from './sections/social.js'
import { loadTools } from './sections/tools.js'

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs()
  chrome.runtime.sendMessage({ action: 'getSummaryData' }, loadSummary)
  chrome.runtime.sendMessage({ action: 'analyzePage' }, response => {
    if (response) {
      loadHeaders(response.headers)
      loadImages(response.images)
      loadLinks(response.links)
      loadSocial(response.social)
      loadTools(response.url)
    } else {
      console.error('No data received')
    }
  })
})
