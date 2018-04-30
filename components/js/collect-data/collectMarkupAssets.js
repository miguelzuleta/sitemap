// const htmlparser2 = require('htmlparser2')
const { imageFromBgStyle } = require('../helpers/stylesheetHelpers.js')
const { fileExtension } = require('../helpers/urls/alterURLs.js')()

let svgData = ''

module.exports = function collectMarkupAssets($, spa, siteMarkup_FileExtensions, totalUniqueAssets) {
	let assetTypeProp = ''
	let siteMarkup_AssetTypes = []
	let elemProps = ['src', 'srcset', 'style']
	let siteMarkupObj = {
		img: 'img',
		svg: 'svg',
		source: 'source:first-child',
		inline: '[style*="url"]'
	}

	for (selector in siteMarkupObj) {
		svgData = 'svg-file__'
		let assetProps = (elem, imgProp, srcsetProp, styleProp) => {

			let elemAttr = (prop) => {
				if (spa) return elem.getAttribute(prop)

				return elem['attribs'][prop]
			}

			switch (selector) {
				case 'img':
					assetTypeProp = elemAttr(imgProp)
					break

				case 'svg':
					assetTypeProp = 'svg'
					break

				case 'source':
					assetTypeProp = elemAttr(srcsetProp)
					break

				case 'inline':
					assetTypeProp = imageFromBgStyle(elemAttr(styleProp))
					break
			}

			if (assetTypeProp !== undefined) {
				siteMarkup_FileExtensions.push(fileExtension(assetTypeProp))

				if (assetTypeProp === 'svg') {
					if (spa) {
						let svgString = svgData + elem.innerHTML.replace(/>\s+|\s+</g, '')
						totalUniqueAssets.push(svgString)
					} else {
						totalUniqueAssets.push(_stringifySVGdata(elem['children']))
						svgData = 'svg-file__'
					}
				} else {
					totalUniqueAssets.push(assetTypeProp)
				}
			}
		}

		if (spa) {
			siteMarkup_AssetTypes = $.querySelectorAll(siteMarkupObj[selector])

			siteMarkup_AssetTypes.forEach(elem => {
				assetProps(elem, ...elemProps)
			})

		} else {
			siteMarkup_AssetTypes = $(siteMarkupObj[selector])

			siteMarkup_AssetTypes.each(function() {
				assetProps(this, ...elemProps)
			})
		}

	}
}

let _stringifySVGdata = elem => {
	elem.forEach(data => {
		svgData += data.type
		let elemHasChildren = (data.children !== undefined)
		let elemHasAttr = (data.attribs !== undefined)

		if (elemHasAttr) svgData += JSON.stringify(data.attribs)
		if (elemHasChildren) _stringifySVGdata(data.children)
	})

	return svgData
}
