const request = require('request')
const cheerio = require('cheerio')
const renderChart = require('../renderers/renderChart.js')
const { createPhantomDirectory, removePhantomDirectory, phantomInit } = require('../phantomFile.js')
const { doubleToSingleSlashes, removeParentDir, removeLastSlash, compress } = require('../helpers/urls/alterURLs.js')()
const { isValidURL, urlHasProtocol, validateURL, userDesktop } = require('./urls/validateURLs.js')
const { numOfPagesCrawled, urlError, crawlInProgress, securityError, crawlComplete } = require('../renderers/renderProgress.js')
const { cleanSelector, invalidSelectors, imageFromBgStyle } = require('../helpers/stylesheetHelpers.js')
const { fileExtension } = require('../helpers/urls/alterURLs.js')()
const { writeDataFile } = require('../helpers/chartHelpers.js')()
const sortCrawledData = require('../sortCrawledData.js')

const tempObj = require('../temp-files/tempObj.js')
const tempCSS = require('../temp-files/tempCSS.js')
const elem = require('./dom/querySelectors.js')
const $$ = require('../helpers/dom/controlElements.js')
const fs = require('fs')

module.exports = {

	requestResponse(error, response, body, pagesCrawled, errorMsg, spa, collectSiteData, thisRelativeURL, callback) {
		let isURLValid = isValidURL(url, response)

		if (!isURLValid) {
			urlError(true)
			return
		}
		else if (isURLValid && pagesCrawled === 1) {
			crawlInProgress()
		}

		numOfPagesCrawled(pagesCrawled)

		let statusCode = response.statusCode

		if (statusCode !== 200) {
			console.log('statusCode IS NOT 200')
			switch(statusCode) {
				case 403:
					errorMsg = `forbidden`
					break
				case 401:
					errorMsg = `unauthorized`
					break
			}

			if (errorMsg !== '') {
				securityError(`${errorMsg} (Error ${statusCode}).`)
				return
			}

			if (!spa) {
				callback()
				return
			}
		}

		if (spa) {
			phantomInit(thisRelativeURL).then(response => {
				collectSiteData(thisRelativeURL, response)
				callback()
			})
		} else {
			let $ = cheerio.load(body)
			collectSiteData(thisRelativeURL, $)
			callback()
		}
	},

	searchForCSSimages(stylesheet) {

		let allStyles = stylesheet.split('}')
		let cssSelectors = allStyles.map(elem => elem.split('{')[0])
		let cssDeclarations = allStyles.map(elem => elem.split('{')[1])

		let setSelectorsWithImages = cssDeclarations.map((elem, index) => {
			if (elem !== undefined) {
				let declarationHasImage = elem.match(/url\(/g)

				if (declarationHasImage !== null) {
					let thisSelector = cleanSelector(cssSelectors[index])

					if (!invalidSelectors(thisSelector)) {
						let thisImage = imageFromBgStyle(elem)

						console.log([thisSelector, thisImage])
						return [thisSelector, thisImage]
					}
				}
			}
		}).filter(elem => elem !== undefined)

		return setSelectorsWithImages
	},

	requestStylesheets(rootURL, styleSheetsArray) {
		let numOfStylesheets = styleSheetsArray.length
		let allStylesheets = ''

		return new Promise(resolve => {
			styleSheetsArray.forEach(elem => {
				let stylesheetURL = (urlHasProtocol(elem)) ? elem : `${rootURL}${elem}`

				request(stylesheetURL, (error, response, body) => {
					allStylesheets += body

					numOfStylesheets--

					if (numOfStylesheets === 0) {
						resolve(allStylesheets)
					}
				})
			})
		})
	},

	targetCSSselector(urlObj, url, assetArray, $, spa) {
		let cssImagesPerPage = []

		assetArray.forEach((elem, index) => {
			let selectorString = `${cleanSelector(elem[0])}`
			let cssSelector = spa ? $.querySelectorAll(selectorString) : $(selectorString)

			if (cssSelector.length > 0) {
				cssImagesPerPage.push(selectorString)
			}
		})

		return cssImagesPerPage
	},

	removeDuplicates(array) {
		return Array.from(new Set(array)).sort()
	},

	categorizeAssets(assetArray) {
		let assetCount = 0
		let assetTypeObj = {}

		assetArray.sort().forEach((elem, index) => {
			if (elem !== assetArray[index + 1]) {
				assetTypeObj[elem] = assetCount + 1
				assetCount = 0
			} else {
				assetCount++
			}
		})

		assetTypeObj['total'] = assetArray.length

		return assetTypeObj
	},

	totalCollectedAssets(obj) {
		let assets = {}

		for(site in obj) {
			for(fileType in obj[site]) {
				if (assets[fileType] === undefined) {
					assets[fileType] = 0
				}
				assets[fileType] += obj[site][fileType]
			}
		}

		return assets
	},

	// treeDimensions() {
	// 	let wrapDimensions = {
	// 		height: elem('map-wrap').offsetHeight,
	// 		width: elem('map-wrap').offsetWidth
	// 	}

	// 	let treeDimensions = {
	// 		height: elem('map-tree-list').offsetHeight,
	// 		width: elem('map-tree-list').offsetWidth
	// 	}

	// 	console.log(wrapDimensions, treeDimensions)

	// },

	endCrawl(assetPromiseObj, siteData, totalAssets, totalUniqueAssets, totalAssetTypes, url) {
		console.log('CRAWL FINISHED')
		console.log(assetPromiseObj)
		let _this = module.exports
		let promiseAllArr = []

		for (promise in assetPromiseObj) {
			promiseAllArr.push(assetPromiseObj[promise])
		}

		// console.log(totalUniqueAssets)

		Promise.all(promiseAllArr).then(result => {
			console.log('CRAWL COMPLETE')

			let totalAssetCount = siteData['assets']['perPage']
			let uniqueTotalAssetCount = _this.removeDuplicates(totalUniqueAssets)
											 .map(elem => fileExtension(elem))

			console.log(uniqueTotalAssetCount)

			siteData['assets']['all'] = _this.totalCollectedAssets(totalAssetCount)
			siteData['assets']['unique'] = _this.categorizeAssets(uniqueTotalAssetCount)

			let treeMapObj = sortCrawledData(siteData)
			let dataFileSuffix = compress(url).replace("www-", "")
			let dataFileLocation = `${elem('json-location-input').value}/sitemap-${dataFileSuffix}.json`

			writeDataFile(treeMapObj, dataFileLocation)

			renderChart(treeMapObj)
			rerenderDataFile(treeMapObj, dataFileLocation)
			removePhantomDirectory()

			// _this.treeDimensions()

			return
		})
	}

}
