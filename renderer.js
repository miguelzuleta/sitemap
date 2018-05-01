const fs = require('fs')
const $$ = require('./components/js/helpers/dom/controlElements.js')
const crawlSite = require('./components/js/crawler.js')
const { removeLastSlash } = require('./components/js/helpers/urls/alterURLs.js')()
const outputChart = require('./components/js/renderers/renderChart.js')
const { restartCrawl, urlError, abortCrawl } = require('./components/js/renderers/renderProgress.js')
const { removePhantomDirectory } = require('./components/js/phantomFile.js')
const { userDesktop } = require('./components/js/helpers/urls/validateURLs')
const { filePathFromDialog } = require('./components/js/helpers/userHelpers.js')
// const { treeDimensions } = require('./components/js/helpers/chartHelpers.js')()
const elem = require('./components/js/helpers/dom/querySelectors.js')
const rerenderDataFile = require('./components/js/renderers/rerenderDataFile.js')

elem('json-location-input').value = userDesktop()

let dragEvents = ['dragenter', 'dragleave']
dragEvents.forEach(listener => {
	elem('drag-area').addEventListener(listener, event => {
		$$('body').controlCSS({
			toggle: ['file-dragged']
		})
	}, false)
})

elem('drag-area').addEventListener('drop', event => {
	let filePath = event.dataTransfer.items[0].getAsFile().path
	let draggedJSONFile = JSON.parse(fs.readFileSync(filePath, 'utf8'))

	outputChart(draggedJSONFile)
	rerenderDataFile(draggedJSONFile, filePath)

}, false)

elem('app-start').addEventListener('click', event => {
	event.preventDefault()
	let enteredURL = removeLastSlash(elem('site-url').value)

	if (elem('toggle-spa').checked) {
		crawlSite(enteredURL, true)
	} else {
		crawlSite(enteredURL, false)
	}
})

elem('restart-button').addEventListener('click', event => {
	event.preventDefault()
	removePhantomDirectory()
	restartCrawl()
	urlError(false)
})

elem('json-location-button').addEventListener('click', event => {
	event.preventDefault()
	filePathFromDialog(elem('json-location-input'))
})

elem('crawl-cancel').addEventListener('click', event => {
	event.preventDefault()
	removePhantomDirectory()
	console.log(elem('crawl-cancel'))
	abortCrawl()
})

module.exports = {
	some() {
		return 'hello'
	}
}


// window.addEventListener('resize', event => {
// 	treeDimensions()
// })

// crawlSite('http://avigilon.com', true)
// crawlSite('http://www.carbon3d.com', true)
// crawlSite('gabriellew.ee', false)
// crawlSite('https://www.selectmedical.com/', false)
// crawlSite('https://draculatheme.com/', false)
// crawlSite('http://nickjacoy.com/', true)
// crawlSite('fiona-fung.com', true)
// crawlSite('https://miguelzuleta.github.io', false)
// crawlSite('alelacayo.herokuapp.com/', false)
// crawlSite('https://www.apple.com', false)
// crawlSite('metabiota.com', false)
// crawlSite('genesis.com', true)
// crawlSite('https://www.kindredhealthcare.com', false)
// crawlSite('https://www.hyundaiusa.com/', true)
