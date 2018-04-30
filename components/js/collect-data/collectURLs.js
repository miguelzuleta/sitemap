const { validateURL, foreignLanguageCodes } = require('../helpers/urls/validateURLs.js')
const { doubleToSingleSlashes, removeParentDir, removeLastSlash } = require('../helpers/urls/alterURLs.js')()
const { removeDuplicates } = require('../helpers/crawlerHelpers.js')

let _populateURLArrays = (newURL, thisRelativeURL, childrenURLs, pagesToVisit, url) => {
	if (newURL !== undefined) {
		let sameDomainAbsoluteURL = newURL.split(url)[1]
		let sameDomainAbsoluteURLexists =  (sameDomainAbsoluteURL !== undefined)

		if (sameDomainAbsoluteURLexists) {
			if (sameDomainAbsoluteURL.length > 1) {
				newURL = sameDomainAbsoluteURL
			}
		}

		let validURL = (validateURL(newURL) === null)
		let fullURL = doubleToSingleSlashes(newURL)
		fullURL = removeParentDir(fullURL)

		let fullURLNoSlash = removeLastSlash(fullURL)

		if (validURL) {
			childrenURLs.push(`${url}${fullURLNoSlash}`)

			let languageDir = fullURL.split('/')[1]
			languageDir = (languageDir !== undefined) ? languageDir.split('-')[0] : undefined

			let isForeign = foreignLanguageCodes().some(lang => languageDir === lang)
			let validPageToVisit = `${url}${fullURL}`

			if (!isForeign && !pagesToVisit.includes(validPageToVisit)) {
				pagesToVisit.push(validPageToVisit)
			}
		} else {
			childrenURLs.push(fullURLNoSlash)
		}
	}
}

module.exports = function collectURLs($, spa, url, siteData, thisRelativeURL, pagesToVisit, childrenURLs){
	let urlSelector = ['a', 'href']
	let siteLinks = []
	let linkURL = ''

	if (spa) {
		siteLinks = $.querySelectorAll(urlSelector[0])
		childrenURLs = []
		siteLinks.forEach(element => {
			linkURL =  element.getAttribute(urlSelector[1]) || ''
			_populateURLArrays(linkURL, thisRelativeURL, childrenURLs, pagesToVisit, url)
		})
	} else {
		siteLinks = $(urlSelector[0])
		childrenURLs = []
		siteLinks.each(function() {
			linkURL =  $(this).attr(urlSelector[1])
			_populateURLArrays(linkURL, thisRelativeURL, childrenURLs, pagesToVisit, url)
		})
	}

	let uniqueURLs = removeDuplicates(childrenURLs)
	thisRelativeURL = removeLastSlash(thisRelativeURL)
	siteData['links'][thisRelativeURL] = uniqueURLs
}
