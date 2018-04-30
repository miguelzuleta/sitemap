const elem = require('../helpers/dom/querySelectors.js')
const { crawlComplete } = require('./renderProgress.js')
const { /*treeDimensions,*/ renderCrawlStats, renderAssetStats, chartDepth, addDataObj, urlExistsInChild, treeColumns, collapseChartTitles } = require('../helpers/chartHelpers.js')()
const $$ = require('../helpers/dom/controlElements.js')
const { removeDashes } = require('../helpers/urls/alterURLs.js')()
const sortCrawledData = require('../sortCrawledData.js')

module.exports = function renderChart(outputObj) {
	crawlComplete()
	// $$('body').renderHTML({
	// 	child: 'textarea',
	// 	attrs: {
	// 		'style': 'width: 100vw; height: 50vh; background-color: black; color: white; font-size: 13px; padding: 30px; position: fixed; bottom: 0; font-family: monospace;'
	// 	},
	// 	text: JSON.stringify(outputObj, null, 2)
	// })
	let dataTreeRoot = outputObj['tree']
	let dataTree = dataTreeRoot['children']

	let stats = outputObj['stats']
	let assets = stats['assets']

	let dataStructure = stats['structure']
	let allAssets = assets['all']
	let uniqueAssets = assets['unique']

	let renderElem = siteName = siteTitleMarkup = ''
	let idCount = childCount1 = childCount2 = 0
	let listClass = 'site'
	let renderProps = {}
	let isElementRoot = false
	let isRootNameNull = (dataTreeRoot['editedName'] === null)

	$$('.map-home').renderHTML({
		child: 'textarea',
		attrs: { 'class': 'txt-field txt-field--site-root' },
		text: isRootNameNull ? dataTreeRoot['name'] : dataTreeRoot['editedName']
	})

	let renderTreeMap = new Promise(resolve => {
		let findChild = arr => {
			arr.forEach(obj => {
				idCount++

				isElementRoot = false
				renderElem = `[data-child="${obj.parentID}"] > ul`
				listClass = 'site site-child'

				if (obj.parentID === '') {
					renderElem = '.map-tree-list'
					listClass = 'site site-root'
					isElementRoot = true
				}

				siteName = obj['name']

				if (obj['editedName'] !== null) {
					if (obj['editedName'].length > 0) {
						siteName = obj['editedName']
					}
				}

				textareaInput = `<textarea class="txt-field txt-field--${obj.id}">${siteName}</textarea>`

				siteTitleMarkup = `<li class="site-title site-fertile">
									 <span></span>
									 ${textareaInput}
								   </li>`

				renderProps = {
					child: 'ul',
					class: 'class-test',
					attrs: {
						'id': obj.id,
						'class': listClass,
						'data-parent': obj.parentID,
						'data-child': obj.childID
					},
					text: `${siteTitleMarkup}<ul></ul>`
				}

				if (obj.children.length > 0) {
					childCount1++
					$$(renderElem).renderHTML(renderProps)
					findChild(obj.children)
				} else {
					if (isElementRoot) {
						renderProps['text'] = siteTitleMarkup.replace('fertile', 'barren')
					} else {
						renderProps['child'] = 'li'
						renderProps['text'] = textareaInput

						delete renderProps['attrs']['class']
						delete renderProps['attrs']['data-parent']
						delete renderProps['attrs']['data-child']
					}
					$$(renderElem).renderHTML(renderProps)
				}

				$$('.assets-page .asset-list').renderHTML({
					child: 'div',
					attrs: { class: `asset-${obj.id}`}
				})

				$$(`.asset-${obj.id}`).renderHTML({
					child: 'p',
					attrs: { class: 'asset-title'},
					text: (obj.editedName === null) ? obj.name : obj.editedName
				})

				renderAssetStats(obj.assets, `.asset-${obj.id}`)
			})
			childCount2++

			if (childCount2 > childCount1) resolve()
		}

		findChild(dataTree)

	}).then(() => {
		console.log('all children found. phew!')

		let { colCount, colWidth } = treeColumns()
		let gridColumnsValue = `grid-template-columns:repeat(${colCount}, minmax(auto, ${colWidth}))`
		elem('map-tree-list').setAttribute('style', gridColumnsValue)

		collapseChartTitles()

		elem('map-txt-fields').forEach(txtField => {
			txtField.addEventListener('focus', () => {

				let assetID = txtField.getAttribute('class').split('txt-field--')[1]

				if (assetID === 'site-root') {
					txtField.select()
					return
				}

				let assetSiteElem = document.querySelector(`.asset-${assetID}`)
				let revealedBox = document.querySelector('.assets-page .asset-list .show')
				let isElemShown = assetSiteElem.className.match('show')

				if (isElemShown) {
					return
				}

				if (revealedBox !== null) {
					revealedBox.classList.remove('show')
				}

				if (!isElemShown) {
					assetSiteElem.classList.add('show')
					txtField.select()
				}
			})
		})

		renderAssetStats(allAssets, '.assets-all .asset-list')
		renderAssetStats(uniqueAssets, '.assets-unique .asset-list')
		renderCrawlStats(dataStructure)
		// treeDimensions()
	})
}
