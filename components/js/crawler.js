const request = require('request')
const cheerio = require('cheerio')

const { createPhantomDirectory, removePhantomDirectory, phantomInit } = require('./phantomFile.js')
const { doubleToSingleSlashes, removeParentDir, removeLastSlash, compress, fileExtension } = require('./helpers/urls/alterURLs.js')()
const { isValidURL, urlHasProtocol, validateURL, userRoot, foreignLanguageCodes, userDesktop } = require('./helpers/urls/validateURLs.js')
const { numOfPagesCrawled, urlError, crawlInProgress, securityError, crawlComplete } = require('./renderers/renderProgress.js')
const { requestResponse, trampoline, requestStylesheets, searchForCSSimages, removeDuplicates, targetCSSselector, categorizeAssets, endCrawl } = require('./helpers/crawlerHelpers.js')
const { imageFromBgStyle } = require('./helpers/stylesheetHelpers.js')

const collectURLs = require('./collect-data/collectURLs.js')
const collectMarkupAssets = require('./collect-data/collectMarkupAssets.js')
const collectStylesheetAssets = require('./collect-data/collectStylesheetAssets.js')

const rerenderDataFile = require('./renderers/rerenderDataFile.js')
const renderChart = require('./renderers/renderChart.js')
const tempObj = require('./temp-files/tempObj.js')
// const temp_outputObj = require('./temp-files/temp_outputObj.js')

const sortCrawledData = require('./sortCrawledData.js')
const elem = require('./helpers/dom/querySelectors.js')
const $$ = require('./helpers/dom/controlElements.js')
const fs = require('fs')


function crawlTempObj() {
	$$('.app').controlCSS({ toggle: ['splash', 'success'] })
	renderChart(tempObj())
}
// crawlTempObj()

removePhantomDirectory()

module.exports = function crawlSite(url, spa) {

	let siteData = {
		links: {},
		assets: {
			all: {},
			unique: {},
			perPage: {}
		}
	}

	let pagesVisited = {}
	let pagesToVisit = []
	let childrenURLs = []
	let stylesheetsVisited = []
	let pagesCrawled = 0
	let errorMsg = ''
	let abortCrawl = false
	let crawlDone = false

	let totalMarkup_AssetArray = []
	let totalCSS_AssetArray = []
	let totalCSS_SelectorArray = []
	let siteCSS_AssetArray = []

	let totalAssetTypes = {}
	let totalAssets = []
	let totalUniqueAssets = []
	let assetPromiseObj = {}

	if (!urlHasProtocol(url)) {
		url = `http://${url}`
	}

	if (spa) {
		createPhantomDirectory()
	}

	url = removeLastSlash(url)
	pagesToVisit.push(url)

	/* -=- =- =- =- =- =- =- =- */
	// TEST temp_outputObj()
	/* -=- =- =- =- =- =- =- =- */
	// endCrawl(
	// 	assetPromiseObj,
	// 	temp_outputObj(),
	// 	totalAssets,
	// 	totalUniqueAssets,
	// 	totalAssetTypes,
	// 	url
	// )

	// return
	/* -=- =- =- =- =- =- =- =- */
	/* -=- =- =- =- =- =- =- =- */

	function crawl() {
		abortCrawl = elem('body').classList.contains('abort')

		if (abortCrawl) return

		let nextPage = pagesToVisit.pop()

		if (nextPage === undefined) {
			crawlDone = true

			endCrawl(
				assetPromiseObj,
				siteData,
				totalAssets,
				totalUniqueAssets,
				totalAssetTypes,
				url
			)

			return
		}

		if (!crawlDone) {
			if (nextPage in pagesVisited) {
				console.log('REVISITING CRAWL...')
				crawl()
			} else {
				console.log(`VISITING NEW PAGE: \n${nextPage}`)
				visitPage(nextPage, crawl)
			}

			pagesCrawled++
		}
	}

	function visitPage(thisRelativeURL, callback) {
		pagesVisited[thisRelativeURL] = true

		let requestArgs = [pagesCrawled, errorMsg, spa, collectSiteData, thisRelativeURL, callback]
		request(
			{ url: thisRelativeURL, followRedirect: false },
			(error, response, body) => requestResponse(error, response, body, ...requestArgs)
		)
	}

	function collectSiteData(thisRelativeURL, $) {
		let siteMarkup_FileExtensions = []
		let siteCSS_FileExtensions = []
		let constData = [$, spa, url, siteData, thisRelativeURL]
		let promiseObjKey = `promise-${pagesCrawled}`

		collectURLs(...constData, pagesToVisit, childrenURLs)

		collectMarkupAssets($, spa, siteMarkup_FileExtensions, totalUniqueAssets)

		assetPromiseObj[promiseObjKey] = collectStylesheetAssets(
											...constData,
											totalCSS_AssetArray,
											siteMarkup_FileExtensions,
											siteCSS_FileExtensions,
											stylesheetsVisited,
											totalUniqueAssets
										)

		console.log('MARKUP EXT: ', siteMarkup_FileExtensions)

	}

	crawl()
}
