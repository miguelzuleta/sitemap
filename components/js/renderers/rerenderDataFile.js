const elem = require('../helpers/dom/querySelectors.js')
const { writeDataFile } = require('../helpers/chartHelpers.js')()
const fs = require('fs')

module.exports = function rerenderDataFile(outputObj, fileLocation) {
	elem('map-txt-fields').forEach(elem => {
		elem.addEventListener(('focusout'), () => {
			let fieldParentID = elem.className.split('field--')[1]

			let renameField = arr => {
				arr.forEach(obj => {

					if (fieldParentID === obj['id']) {
						if (obj['name'] !== elem.value) {
							obj['editedName'] = elem.value
							writeDataFile(outputObj, fileLocation)
							return
						}
					}

					if (obj.children.length > 0) {
						renameField(obj.children)
					}

				})
			}

			if (fieldParentID !== 'site-root') {
				let assetPageTitle = document.querySelector(`.asset-${fieldParentID} .asset-title`)

				if (elem.value !== assetPageTitle.innerHTML) {
					assetPageTitle.innerHTML = elem.value
				}
			} else {
				outputObj['tree']['editedName'] = elem.value
				writeDataFile(outputObj, fileLocation)
			}

			renameField(outputObj['tree']['children'])

		})
	})
}
