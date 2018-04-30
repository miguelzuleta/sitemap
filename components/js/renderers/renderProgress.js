const $$ = require('../helpers/dom/controlElements.js')

let crawlErrElem = '.crawl-input .crawl-error'
let splash = 'splash'
let progress = 'progress'
let success = 'success'
let error = 'error'
let fileDragged = 'file-dragged'
let wideSVG = 'wide-svg'
let abort = 'abort'

module.exports = {
	numOfPagesCrawled(page) {
		$$('.crawl-status .crawl-progress').renderHTML({
			text: `Pages Crawled: ${page}`
		})
	},

	crawlComplete() {
		$$('body').controlCSS({
			remove: [progress, splash],
			add: [success]
		})
	},

	crawlInProgress() {
		$$('body').controlCSS({
			toggle: [splash, progress],
			remove: [error]
		})

		$$('.chart-tree').resetElement()
	},

	restartCrawl() {
		console.log('sdfds')
		$$('body').controlCSS({
			remove: [progress, success, fileDragged, wideSVG, abort],
			add: [splash]
		})

		$$(
			'.map-tree-list',
			'.map-home',
			'.asset-list'
		).resetElement()
	},

	abortCrawl() {
		$$('body').controlCSS({
			add: [abort]
		})

		setTimeout(() => {
			restartCrawl()
		}, 555)
	},

	urlError(boolean) {
		if (boolean) {
			$$('body').controlCSS({ add: [error] })

			$$(crawlErrElem).renderHTML({
				text: 'You entered an invalid URL!'
			})
		} else {
			$$('body').controlCSS({ remove: [error] })

			$$(crawlErrElem).resetElement()
		}
	},

	securityError(response) {
		$$('body').controlCSS({
			add: [error],
			toggle: [progress, splash]
		})

		$$(crawlErrElem).renderHTML({
			text: `Uh oh! Crawling this site is ${response}`
		})
	}
}
