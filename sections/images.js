export function loadImages(images) {
    const imageList = document.getElementById('image-list')
    const imageFilter = document.getElementById('image-filter')
    imageList.innerHTML = ''  // Clear existing content

    const stats = calculateImageStats(images)
    updateImageStats(stats)

    function renderImages(filter = 'all') {
        imageList.innerHTML = ''
        images.forEach(image => {
            if (shouldRenderImage(image, filter)) {
                const imageElement = createImageElement(image)
                imageList.appendChild(imageElement)
            }
        })
    }

    imageFilter.addEventListener('change', (e) => {
        renderImages(e.target.value)
    })

    renderImages()
}

function calculateImageStats(images) {
    return {
        total: images.length,
        withoutAlt: images.filter(img => !img.alt).length,
        withoutTitle: images.filter(img => !img.title).length,
        withoutSize: images.filter(img => !img.width || !img.height).length,
        loadingEager: images.filter(img => img.loading === 'eager').length,
        loadingLazy: images.filter(img => img.loading === 'lazy').length,
        nextGenFormat: images.filter(img => ['webp', 'avif'].includes(img.format)).length
    }
}

function updateImageStats(stats) {
    updateSummary('total-images', `Total Images: ${stats.total}`)
    updateSummary('images-without-alt', `Without ALT: ${stats.withoutAlt}`)
    updateSummary('images-without-title', `Without TITLE: ${stats.withoutTitle}`)
    updateSummary('images-without-size', `Without Size: ${stats.withoutSize}`)
    updateSummary('images-loading-eager', `Loading Eager: ${stats.loadingEager}`)
    updateSummary('images-loading-lazy', `Loading Lazy: ${stats.loadingLazy}`)
    updateSummary('images-next-gen', `Next-Gen Format: ${stats.nextGenFormat}`)
}

function updateSummary(id, text) {
    const element = document.getElementById(id)
    if (element) element.textContent = text
}

function createImageElement(image) {
    const imageElement = document.createElement('div')
    imageElement.className = 'bg-gray-100 p-4 rounded-lg mb-4 flex items-center space-x-4'

    const placeholderImg = createImage(image)
    const imgData = createImageData(image)

    imageElement.appendChild(placeholderImg)
    imageElement.appendChild(imgData)
    return imageElement
}

function createImage(image) {
    const img = document.createElement('img')
    img.src = image.src || '/placeholder.svg'
    img.alt = image.alt || 'Loading...'
    img.className = 'w-16 h-16 object-cover rounded-md'
    return img
}

function createImageData(image) {
    const div = document.createElement('div')
    div.className = 'flex-1'
    div.innerHTML = `
        <p class="text-muted-foreground break-all">SRC: ${image.src}</p>
        ${image.alt ? `<p>ALT: ${image.alt}</p>` : '<p class="text-red-500">No ALT</p>'}
        ${image.title ? `<p>TITLE: ${image.title}</p>` : '<p class="text-red-500">No TITLE</p>'}
        ${image.width && image.height ? `<p>Size: ${image.width}x${image.height}</p>` : '<p class="text-yellow-500">No Size</p>'}
        ${image.loading ? `<p>Loading: ${image.loading}</p>` : ''}
        <p>Format: ${image.format}</p>
    `
    return div
}

function shouldRenderImage(image, filter) {
    switch (filter) {
        case 'withoutAlt':
            return !image.alt
        case 'withoutTitle':
            return !image.title
        case 'withoutSize':
            return !image.width || !image.height
        case 'loadingEager':
            return image.loading === 'eager'
        case 'loadingLazy':
            return image.loading === 'lazy'
        case 'nextGenFormat':
            return isNextGenFormat(image.src)
        default:
            return true
    }
}

function isNextGenFormat(src) {
    const format = src.split('.').pop().toLowerCase();
    return ['webp', 'avif'].includes(format);
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'analyzePage' }, response => {
        if (response && response.images) {
            loadImages(response.images)
        } else {
            console.error('No images data received')
        }
    })
})
