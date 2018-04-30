module.exports = {

	cleanSelector(selector) {
		let thisSelector = selector.replace(_pseudoElements(), '')

		let selectorFilter = [
			[',', 0],
			['/*', 0],
			['*/', 1],
			[';', 1]
		]

		selectorFilter.forEach(elem => {
			let splitElement = thisSelector.split(elem[0])
			let isFilterDefined = (splitElement.length > 1)

			if (isFilterDefined) thisSelector = splitElement[elem[1]]
		})

		return thisSelector
	},

	invalidSelectors(selector) {
		let matchBlanks = ['', ' ', '\n'].some(elem => elem === selector)
		let matchRegex = selector.match(/(\n|\@)/g)

		if (matchBlanks || matchRegex) return true
		return false
	},

	imageFromBgStyle(elem) {
		return elem.split('url(')[1].split(')')[0]
	}

}

let _pseudoElements = () => {
	return /:before|:after|:active|:checked|:disabled|:empty|:enabled|:first-child|:first-of-type|:focus|:hover|:in-range|:invalid|:lang(language)|:last-child|:last-of-type|:link|:not\((.*?)\)|:nth-child\((.*?)\)|:nth-last-child\((.*?)\)|:nth-last-of-type\((.*?)\)|:nth-of-type\((.*?)\)|:only-of-type|:only-child|:optional|:out-of-range|:read-only|:read-write|:required|:root|:target|:valid|:visited|::placeholder|::-moz-placeholder|:-ms-input-placeholder|_:-ms-input-placeholder/g
}
