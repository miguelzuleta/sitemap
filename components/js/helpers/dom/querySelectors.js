module.exports = function elem(element) {

	let selector = query => {
		let querySelector = document.querySelectorAll(query)

		if (querySelector.length === 1) {
			querySelector = document.querySelector(query)
		}

		return querySelector
	}

	switch(element) {

		case 'body':
			return selector('body')

		case 'json-location-input':
			return selector('.json-location input')

		case 'json-location-button':
			return selector('.json-location button')

		case 'site-url':
			return selector('#url')

		case 'toggle-spa':
			return selector('#spa')

		case 'app-start':
			return selector('.url button')

		case 'restart-button':
			return selector('.crawl-restart')

		case 'drag-area':
			return selector('#drag')

		case 'crawl-cancel':
			return selector('button.crawl-cancel')

		case 'map-wrap':
			return selector('.map-wrap')

		case 'map-tree-list':
			return selector('.map-tree-list')

		case 'map-tree-box':
			return selector('.map-tree-list textarea')

		case 'map-tree-root-sites':
			return selector('.map-tree-list > *')

		case 'map-txt-fields':
			return selector('textarea.txt-field')

		case 'map-collapsable-fields':
			return selector('.site-fertile span')

		case 'map-home':
			return selector('.map-home')

	}
}
