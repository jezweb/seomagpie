export function initializeTabs() {
  const tabs = document.querySelectorAll('[role="tab"]')
  const tabContents = document.querySelectorAll('[role="tabpanel"]')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      updateTabs(tabs, tab)
      updateTabContents(tabContents, tab)
    })
  })
}

function updateTabs(tabs, activeTab) {
  tabs.forEach(tab => {
    tab.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600')
    tab.classList.add('hover:text-blue-600')
    tab.setAttribute('aria-selected', 'false')
  })

  activeTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600')
  activeTab.classList.remove('hover:text-blue-600')
  activeTab.setAttribute('aria-selected', 'true')
}

function updateTabContents(tabContents, activeTab) {
  tabContents.forEach(content => content.classList.add('hidden'))

  const activeContentId = activeTab.id.replace('-tab', '-content')
  const activeContent = document.getElementById(activeContentId)
  if (activeContent) activeContent.classList.remove('hidden')
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs()
})