export function loadLinks(links) {
    const linksList = document.getElementById('link-list')
    linksList.innerHTML = ''  // Clear existing content

    const totalLinks = links.length
    const uniqueLinks = new Set(links.map(link => link.href)).size
    const linksWithoutTitle = links.filter(link => !link.title).length

    updateSummary('total-links', `Total Links: ${totalLinks}`)
    updateSummary('unique-links', `Unique Links: ${uniqueLinks}`)
    updateSummary('links-without-title', `Links without TITLE: ${linksWithoutTitle}`)

    links.forEach(link => {
        const linkElement = document.createElement('div')
        linkElement.className = 'bg-gray-100 p-4 rounded-lg mb-4 relative'

        const urlElement = createParagraph('URL', link.href)
        const textElement = createParagraph('Text', link.text || '<em>No link text</em>')
        const titleElement = link.title
            ? createParagraph('Title', link.title)
            : createParagraph('No TITLE', '', 'text-red-500')

        linkElement.appendChild(urlElement)
        linkElement.appendChild(textElement)
        linkElement.appendChild(titleElement)
        linksList.appendChild(linkElement)
    })
}

function updateSummary(id, text) {
    const element = document.getElementById(id)
    if (element) element.textContent = text
}

function createParagraph(label, content, className = '') {
    const p = document.createElement('p')
    p.className = `break-all ${className}`
    p.innerHTML = `<strong>${label}:</strong> ${content}`
    return p
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'analyzePage' }, response => {
        if (response && response.links) {
            loadLinks(response.links)
        } else {
            console.error('No links data received')
        }
    })
})
