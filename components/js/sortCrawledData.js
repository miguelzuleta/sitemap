const elem = require('./helpers/dom/querySelectors.js')
const { crawlComplete } = require('./renderers/renderProgress.js')
const { joinDetachedPages, writeDataFile, renderCrawlStats, chartDepth, addDataObj, urlExistsInChild, numOfSiteRootPages } = require('./helpers/chartHelpers.js')()
const $$ = require('./helpers/dom/controlElements.js')
const { removeDashes, fileExtension, doubleToSingleSlashes } = require('./helpers/urls/alterURLs.js')()

module.exports = function sortCrawledData(outputObj) {
	let sortedURL = Object.keys(outputObj['links']).sort()
	let visitedParents = {}
	let sortedURLsArray = []

	let injectElementNum =
		familyCount =
		totalLinkCount = 0

	let notIncest =
		isBarren =
		wasVisited =
		duplParent =
		isLastElement =
		wasNewElementInjected =
		thisParent =
		childSite =
		longDir = null

	let detachedParent = 1
	let detachedParentArray = []
	let siteIDPrefix = 'site-'
	let siteRootID = `${siteIDPrefix}root`
	let siteID = siteRootID
	let pageAssetObj = outputObj['assets']['perPage']
	let pageAssetKey = sortedURL[0]

	addDataObj(
		sortedURLsArray,
		siteRootID,
		null,
		sortedURL[0],
		pageAssetObj[pageAssetKey],
		sortedURL[0]
	)

	elem('map-tree-list').setAttribute('id', siteRootID)

	let rootSiteName = sortedURLsArray[0]['site']
	console.log(rootSiteName)

	let node
	let map = {}
	let roots = [];
	let nodeInfo = sortedURLsArray

	node = sortedURLsArray[familyCount]
	map[node.site] = familyCount
	roots.push(node);
	familyCount++

	sortedURL.forEach(element => {
		visitedParents[element] = false
	})

	sortedURL.forEach(parentSite => {
		thisParent = outputObj['links'][parentSite]

		for (i=0; i < thisParent.length; i++) {
			totalLinkCount++
			childSite = thisParent[i]
			notIncest = (childSite.match(parentSite) !== null)
			isBarren = (!(childSite in visitedParents))
			wasVisited = (visitedParents[childSite])
			duplParent = (parentSite === childSite)
			alreadyInChild = urlExistsInChild(parentSite, childSite, visitedParents)

			if (!notIncest || isBarren || wasVisited || duplParent || alreadyInChild) continue

			pageAssetKey = childSite

			// let deepLink = joinDetachedPages(parentSite, sortedURL)

			addDataObj(
				sortedURLsArray,
				`${siteIDPrefix}${familyCount}`,
				// (deepLink === null) ? parentSite : deepLink,
				parentSite,
				childSite,
				pageAssetObj[pageAssetKey],
				true
			)

			isLastElement = (sortedURL.length - injectElementNum - 1 === familyCount)
			wasNewElementInjected = (injectElementNum > 0)

			if (isLastElement && wasNewElementInjected) {
				thisParent.push(childSite)
			}

			node = sortedURLsArray[familyCount]
			map[node.site] = familyCount

			/*


			 "name": "resources/blog-kindred-spirit/2017/10/01/why-chronic-pain-brings-you-down---and-how-to-feel-better",
			is not detched. try to link to detached parent

			*/

			if (map[node.parent] === undefined) {
				pageAssetKey = parentSite

				if (!detachedParentArray.includes(parentSite)) {
					detachedParentArray.push(doubleToSingleSlashes(parentSite))

					let deepLink = joinDetachedPages(parentSite, sortedURL)
					console.log(deepLink)
					console.log(parentSite)

					addDataObj(
						sortedURLsArray,
						`${siteIDPrefix}detached-${detachedParent}`,
						(deepLink === null) ? sortedURL[0] : deepLink,
						// sortedURL[0],
						parentSite,
						pageAssetObj[pageAssetKey],
						true
					)

					thisParent.push(childSite)
					familyCount++
					injectElementNum++
					detachedParent++
				}

			} else {
				nodeInfo[map[node.parent]]['children'].push(node)
				familyCount++
			}
		}

		visitedParents[parentSite] = true
	})

	delete outputObj['assets']['perPage']

	return {
		tree: roots[0],
		stats: {
			structure: {
				links: totalLinkCount,
				pages: familyCount,
				levels: chartDepth(roots[0])
			},
			assets: outputObj['assets']
		}
	}
}
