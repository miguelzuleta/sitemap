const { urlHasProtocol } = require('./validateURLs')

module.exports = function alterURL() {
	let doubleToSingleSlashes = url => {
		return url.replace(/\/\//g, (match, position, element) => {
			if (element.charAt(position - 1) === ':') {
				return match
			} else {
				return  '/'
			}
		}).split('?')[0]
	}

	let removeParentDir = url => {
		let firstMatch = true
		return url.replace(/(\.\.\/)|(\.\/)/g, () => {
			if (firstMatch) {
				firstMatch = false
				return '/'
			}
				return ''
		})
	}

	let removeDashes = (url) => {
		return url.replace(/(-|\/)/g, ' ')
	}

	let removeLastSlash = url => {
		let hasTrailingSlash = (url.substring(url.length - 1) === '/')
		let URL_NoSlash = url

		if (hasTrailingSlash) {
			URL_NoSlash = url.substring(0, url.length - 1)
		}

		return URL_NoSlash
	}

	let compress = url => {
		let hasProtocol = urlHasProtocol(url)

		if (hasProtocol) {
			return url
				.split('://')[1]
				.split('/').join('-')
				.split('.').join('-')
		} else {
			return
		}
	}

	let fileExtension = file => {
		if (file !== null && file !== undefined) {

			if (file.match(/svg-file__/g)) return 'svg'

			let cleanExtension = ''
			let splitFileType = file.split('.')
			let fileExtension = splitFileType[splitFileType.length - 1]
			let fileSuffixes = ['#', '?', '&', '/']
			let acceptedFileTypes = ['jpg', 'png', 'gif', 'svg', 'tiff']

			fileSuffixes.forEach((suffix, index) => {
				cleanExtension = cleanExtension.split(suffix)[0]

				if (index === 0) {
					cleanExtension = fileExtension.split(suffix)[0]
				}
			})

			cleanExtension = cleanExtension.toLowerCase()
			let isAcceptedFile = (acceptedFileTypes.includes(cleanExtension) === true)

			if (!isAcceptedFile) {
				if (cleanExtension === 'jpeg') {
					return 'jpg'
				}
				return 'other'
			}

			return cleanExtension
		}
	}

	return {
		doubleToSingleSlashes: doubleToSingleSlashes,
		removeParentDir: removeParentDir,
		removeLastSlash: removeLastSlash,
		removeDashes: removeDashes,
		compress: compress,
		fileExtension: fileExtension
	}

}
