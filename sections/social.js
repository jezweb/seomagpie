export function loadSocial(socialData) {
    const socialList = document.getElementById('social-list')
    socialList.innerHTML = ''  // Clear existing content

    const sections = {
        'Open Graph': socialData.filter(meta => meta.property.startsWith('og:')),
        'Twitter': socialData.filter(meta => meta.property.startsWith('twitter:')),
        'Other': socialData.filter(meta => !meta.property.startsWith('og:') && !meta.property.startsWith('twitter:'))
    }

    Object.entries(sections).forEach(([sectionName, metaData]) => {
        if (metaData.length > 0) {
            const sectionElement = createSection(sectionName, metaData)
            socialList.appendChild(sectionElement)
        }
    })
}

function createSection(name, metaData) {
    const section = document.createElement('div')
    section.className = 'mb-6'
    
    const title = document.createElement('h3')
    title.className = 'text-lg font-semibold mb-2'
    title.textContent = name
    section.appendChild(title)

    const table = document.createElement('table')
    table.className = 'w-full'

    metaData.forEach(meta => {
        const row = table.insertRow()
        const propertyCell = row.insertCell(0)
        const contentCell = row.insertCell(1)

        propertyCell.className = 'font-medium pr-4 align-top'
        propertyCell.textContent = meta.property

        contentCell.className = 'align-top'
        if (meta.property.includes('image') && meta.content.startsWith('http')) {
            const img = document.createElement('img')
            img.src = meta.content
            img.className = 'max-h-20 mb-2'
            contentCell.appendChild(img)
        }
        contentCell.appendChild(document.createTextNode(meta.content))
    })

    section.appendChild(table)
    return section
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'analyzePage' }, response => {
        if (response && response.social) {
            loadSocial(response.social)
        } else {
            console.error('No social metadata received')
        }
    })
})
