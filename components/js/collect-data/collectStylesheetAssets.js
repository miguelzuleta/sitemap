const { requestStylesheets, targetCSSselector, searchForCSSimages, categorizeAssets } = require('../helpers/crawlerHelpers.js')
const { fileExtension, removeLastSlash } = require('../helpers/urls/alterURLs.js')()

module.exports = function collectStylesheetAssets($, spa, url, siteData, thisRelativeURL, totalCSS_AssetArray, siteMarkup_FileExtensions, siteCSS_FileExtensions, stylesheetsVisited, totalUniqueAssets) {
	return new Promise(resolve => {
		let siteCSS_AssetArray = []
		let cssImagesPerSite = []
		let allStylesheets = []
		let siteStylesheets = []
		let selector = 'link[href*=".css"]'

		if (spa) {
			console.log($)
			siteStylesheets = $.querySelectorAll(selector)
			siteStylesheets.forEach(elem => {
				allStylesheets.push(elem.href)
			})
		} else {
			siteStylesheets = $(selector)
			siteStylesheets.each(function(){
				allStylesheets.push(this.attribs.href)
			})
		}

		if (!allStylesheets.length) {
			resolve([])
		} else {
			requestStylesheets(url, allStylesheets).then(stylesheetBody => {
				let newCSSassetArray = searchForCSSimages(stylesheetBody)
				console.log(newCSSassetArray)

				siteCSS_AssetArray = [...siteCSS_AssetArray, ...newCSSassetArray]
				totalCSS_SelectorArray = siteCSS_AssetArray.map(elem => elem[0])
				totalCSS_AssetArray = siteCSS_AssetArray.map(elem => fileExtension(elem[1]))

				cssImagesPerSite = targetCSSselector(siteData, thisRelativeURL, siteCSS_AssetArray, $, spa)

				if (cssImagesPerSite.length) {
					siteCSS_FileExtensions = cssImagesPerSite.map((elem, index) => {
						if (totalCSS_SelectorArray.includes(elem)) {
							totalUniqueAssets.push(totalCSS_AssetArray[index])
							return fileExtension(totalCSS_AssetArray[index])
						}
					})

					console.log('CSS EXT: ', siteCSS_FileExtensions)
					resolve(siteCSS_FileExtensions)
				} else {
					console.log('ELSE!!')
					resolve([])
				}
			})
		}
	}).then(result => {
		totalSiteAssets = [...siteMarkup_FileExtensions, ...result]

		siteData['assets']['perPage'][removeLastSlash(thisRelativeURL)] = categorizeAssets(totalSiteAssets)
	})
}
