export function loadHeaders(headers) {
    const headersList = document.getElementById('headers-list')
    headersList.innerHTML = ''  // Clear existing content

    const headerCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 }
    const headerStructure = createHeaderStructure(headers)

    // Create header structure
    const structureElement = document.createElement('div')
    structureElement.className = 'mb-6'
    renderHeaderStructure(headerStructure, structureElement, headerCounts)
    headersList.appendChild(structureElement)

    // Create header count summary
    const summaryElement = createHeaderSummary(headerCounts)
    headersList.appendChild(summaryElement)
}

function createHeaderStructure(headers) {
    const structure = []
    const stack = [{ level: 0, children: structure }]

    headers.forEach(header => {
        const level = parseInt(header.tag.slice(1))
        const node = { tag: header.tag, text: header.text, children: [] }

        while (stack[stack.length - 1].level >= level) {
            stack.pop()
        }

        stack[stack.length - 1].children.push(node)
        stack.push({ level, children: node.children })
    })

    return structure
}

function renderHeaderStructure(structure, parentElement, headerCounts, level = 0) {
    structure.forEach(header => {
        const headerElement = document.createElement('div')
        headerElement.className = `ml-${level * 4} mb-2`
        
        const tagSpan = document.createElement('span')
        tagSpan.className = 'font-semibold mr-2'
        tagSpan.textContent = `<${header.tag}>`
        
        const textSpan = document.createElement('span')
        textSpan.textContent = header.text

        headerElement.appendChild(tagSpan)
        headerElement.appendChild(textSpan)
        parentElement.appendChild(headerElement)

        headerCounts[header.tag.toLowerCase()]++

        if (header.children.length > 0) {
            renderHeaderStructure(header.children, parentElement, headerCounts, level + 1)
        }
    })
}

function createHeaderSummary(headerCounts) {
    const summaryElement = document.createElement('div')
    summaryElement.className = 'mt-6'

    const title = document.createElement('h3')
    title.className = 'text-lg font-semibold mb-2'
    title.textContent = 'Header Count Summary'
    summaryElement.appendChild(title)

    const table = document.createElement('table')
    table.className = 'w-full'

    const headerRow = table.insertRow()
    Object.keys(headerCounts).forEach(tag => {
        const th = document.createElement('th')
        th.textContent = tag.toUpperCase()
        th.className = 'px-2 py-1 border'
        headerRow.appendChild(th)
    })

    const countRow = table.insertRow()
    Object.values(headerCounts).forEach(count => {
        const td = countRow.insertCell()
        td.textContent = count
        td.className = 'px-2 py-1 border text-center'
        if (count === 0) td.classList.add('bg-red-100')
    })

    summaryElement.appendChild(table)
    return summaryElement
}
