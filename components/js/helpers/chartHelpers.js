const $$ = require('../helpers/dom/controlElements.js')
const elem = require('../helpers/dom/querySelectors.js')
const { trimDirectory } = require('../helpers/urls/validateURLs.js')
const { removeLastSlash } = require('../helpers/urls/alterURLs.js')()

module.exports = function chartHelpers(){
	let chartDepth = object => {
		let depth = 0;
		let tmpDepth
		if (object.children) {
			object.children.forEach(element => {
				tmpDepth = chartDepth(element)
				if (tmpDepth > depth) {
					depth = tmpDepth
				}
			})
		}
		return 1 + depth
	}

	let addDataObj = (sortedURLsArray, id, parent, site, assets, name = false) => {
		let rootObjectDefined = (sortedURLsArray.length > 0)
		let siteID = memberID =>
			rootObjectDefined ? trimDirectory(memberID, sortedURLsArray[0]['site']) : null

		sortedURLsArray.push({
			id: id,
			site: site,
			name: (!name) ? name : trimDirectory(site, parent),
			editedName: null,
			parentID: siteID(parent),
			childID: siteID(site),
			parent: parent,
			assets: assets,
			children: []
		})
	}

	let joinDetachedPages = (parentSite, sortedURL) => {
		let deepLinkArr = parentSite
						.replace(sortedURL[0], '')
						.split('/')
						.filter((elem, index) => index !== 0)

		console.log(deepLinkArr)

		let linkDepth = ''
		let deepLink = null
		let deepLinkExists = false

		for (let i = 0; i < deepLinkArr.length; i++) {
			let elem = deepLinkArr[i]
			linkDepth += `/${elem}`

			let thisLink = `${sortedURL[0]}${linkDepth}`
			deepLinkExists = sortedURL.includes(thisLink)

			if (deepLinkExists) {
				deepLink = thisLink
				break
			}
		}

		return deepLink
	}

	let urlExistsInChild = (parentSite, childSite, visitedParents) => {
		let clipChild = childSite.split('/')
		let childEnd = clipChild[clipChild.length - 1]
		let childRoot = removeLastSlash(childSite.split(childEnd)[0])

		let urlInChild = (visitedParents[childRoot] === false
					  && childRoot.split('/').length !== 3
					  && childRoot !== parentSite)

		if (urlInChild) return true

		return false
	}

	let treeColumns = () => {
		let rootCount = 0

		elem('map-tree-root-sites').forEach(e => {
			rootCount++
		})

		return {
			colCount: rootCount,
			colWidth: '400px'
		}
	}

	let collapseChartTitles = () => {
		elem('map-collapsable-fields').forEach(elem => {
			let parentSiteListID = document.querySelector(`#${elem.parentNode.parentNode.id}`)

			elem.addEventListener('click', () => {
				parentSiteListID.classList.toggle('collapsed')
				// treeDimensions()
			})
		})
	}

	let renderCrawlStats = (info) => {
		for (let element in info) {
			$$(`.count .count-${element} .count-value`)
				.renderHTML({
					text: info[element]
				})
		}
	}

	let renderAssetStats = (obj, parentElem) => {
		for (key in obj) {
			$$(parentElem).renderHTML({
				child: 'div',
				text: `<span class="asset-type">${key}</span> ${obj[key]}`
			})
		}
	}

	let writeDataFile = (obj, location) => {
		fs.writeFileSync(location, JSON.stringify(obj, null, 2))
	}

	let treeDimensions = () => {
		let { colCount, colWidth } = treeColumns()

		let wrapDimns = {
			height: elem('map-wrap').offsetHeight,
			width: elem('map-wrap').offsetWidth
		}

		let treeDimns = {
			height: elem('map-tree-list').offsetHeight,
			width: elem('map-tree-list').offsetWidth
		}

		let wrapHigherThanTree = (wrapDimns.height > treeDimns.height)
		let wrapWiderThanTree = (wrapDimns.width > (colCount * parseInt(colWidth)))

		// console.log(`wrapHigherThanTree: ${wrapDimns.height} > ${treeDimns.height}`)
		// console.log(`wrapWiderThanTree: ${wrapDimns.width} > ${treeDimns.width}`)

		let controlScroll = (boolean, axis) => {
			if (boolean) {
				elem('map-wrap').classList.add(`no-scroll-${axis}`)
			} else {
				elem('map-wrap').classList.remove(`no-scroll-${axis}`)
			}
		}

		controlScroll(wrapWiderThanTree, 'x')
		controlScroll(wrapHigherThanTree, 'y')
		// console.log('get rid of treeDimensions()')
	}

	return {
		chartDepth: chartDepth,
		renderCrawlStats: renderCrawlStats,
		addDataObj: addDataObj,
		treeColumns: treeColumns,
		urlExistsInChild: urlExistsInChild,
		collapseChartTitles: collapseChartTitles,
		renderAssetStats: renderAssetStats,
		writeDataFile: writeDataFile,
		treeDimensions: treeDimensions,
		joinDetachedPages: joinDetachedPages
	}
}
