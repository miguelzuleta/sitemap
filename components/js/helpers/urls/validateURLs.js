const path = require('path')
const phantomjs = require('phantomjs-prebuilt')

module.exports = {
	isValidURL(element, response) {
		let isValidURL = true
		let urlIsEmpty = (element === '')
		let invalidResponse = (response === undefined)

		if (urlIsEmpty || invalidResponse) {
			isValidURL = false
		}

		return isValidURL
	},

	urlHasProtocol(url) {
		let protocol = url.match(/(http(s)?)(\:\/\/)/g)
		let hasProtocol = (protocol === null) ? false : true

		return hasProtocol
	},

	validateURL(url) {
		return url.match(/(^(http|\#|\?|[a-z])|(\#|\?)|.(pdf|js|css|jpg|jpeg|png|svg|zip|aspx)$)/g)
	},

	trimDirectory(element, elementSection) {
		// console.log(element, elementSection)
		return element
				.replace(elementSection, '')
				.replace('/', '')
	},

	userDesktop() {
		return `${process.env['HOME']}/Desktop`
	},

	userRoot() {
		return process.env['HOME']
	},

	phantomPath() {
		let appAsarDirName = 'app.asar'
		let phantomJSLocation = 'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs'

		if (!fs.existsSync(phantomJSLocation)) {
			let currentDir = __dirname
			let builtAppAsarDirectory = currentDir.split(appAsarDirName)[0]
			let phantomJSLocationInBuiltApp = `${builtAppAsarDirectory}${appAsarDirName}/${phantomJSLocation}`

			return phantomJSLocationInBuiltApp
		}

		return phantomJSLocation
	},

	foreignLanguageCodes() {
		let foreignLanguages = {
			'aa': 'Afar',
			'ab': 'Abkhazian',
			'af': 'Afrikaans',
			'am': 'Amharic',
			'ar': 'Arabic',
			'as': 'Assamese',
			'ay': 'Aymara',
			'az': 'Azerbaijani',
			'ba': 'Bashkir',
			'be': 'Byelorussian',
			'bg': 'Bulgarian',
			'bh': 'Bihari',
			'bi': 'Bislama',
			'bn': 'Bengali',
			'bo': 'Tibetan',
			'br': 'Breton',
			'ca': 'Catalan',
			'co': 'Corsican',
			'cs': 'Czech',
			'cy': 'Welsh',
			'da': 'Danish',
			'de': 'German',
			'dz': 'Bhutani',
			'el': 'Greek',
			'eo': 'Esperanto',
			'es': 'Spanish',
			'es': 'Espanol',
			'et': 'Estonian',
			'eu': 'Basque',
			'fa': 'Persian',
			'fi': 'Finnish',
			'fj': 'Fiji',
			'fo': 'Faeroese',
			'fr': 'French',
			'fy': 'Frisian',
			'ga': 'Irish',
			'gd': 'Gaelic',
			'gl': 'Galician',
			'gn': 'Guarani',
			'gu': 'Gujarati',
			'ha': 'Hausa',
			'hi': 'Hindi',
			'hr': 'Croatian',
			'hu': 'Hungarian',
			'hy': 'Armenian',
			'ia': 'Interlingua',
			'ie': 'Interlingue',
			'ik': 'Inupiak',
			'in': 'Indonesian',
			'is': 'Icelandic',
			'it': 'Italian',
			'iw': 'Hebrew',
			'ja': 'Japanese',
			'ji': 'Yiddish',
			'jw': 'Javanese',
			'ka': 'Georgian',
			'kk': 'Kazakh',
			'kl': 'Greenlandic',
			'km': 'Cambodian',
			'kn': 'Kannada',
			'ko': 'Korean',
			'ks': 'Kashmiri',
			'ku': 'Kurdish',
			'ky': 'Kirghiz',
			'la': 'Latin',
			'ln': 'Lingala',
			'lo': 'Laothian',
			'lt': 'Lithuanian',
			'lv': 'Latvian',
			'mg': 'Malagasy',
			'mi': 'Maori',
			'mk': 'Macedonian',
			'ml': 'Malayalam',
			'mn': 'Mongolian',
			'mo': 'Moldavian',
			'mr': 'Marathi',
			'ms': 'Malay',
			'mt': 'Maltese',
			'my': 'Burmese',
			'na': 'Nauru',
			'ne': 'Nepali',
			'nl': 'Dutch',
			'no': 'Norwegian',
			'oc': 'Occitan',
			'om': 'Oriya',
			'pa': 'Punjabi',
			'pl': 'Polish',
			'ps': 'Pashto',
			'pt': 'Portuguese',
			'qu': 'Quechua',
			'rm': 'Rhaeto-Romance',
			'rn': 'Kirundi',
			'ro': 'Romanian',
			'ru': 'Russian',
			'rw': 'Kinyarwanda',
			'sa': 'Sanskrit',
			'sd': 'Sindhi',
			'sg': 'Sangro',
			'sh': 'Serbo-Croatian',
			'si': 'Singhalese',
			'sk': 'Slovak',
			'sl': 'Slovenian',
			'sm': 'Samoan',
			'sn': 'Shona',
			'so': 'Somali',
			'sq': 'Albanian',
			'sr': 'Serbian',
			'ss': 'Siswati',
			'st': 'Sesotho',
			'su': 'Sundanese',
			'sv': 'Swedish',
			'sw': 'Swahili',
			'ta': 'Tamil',
			'te': 'Tegulu',
			'tg': 'Tajik',
			'th': 'Thai',
			'ti': 'Tigrinya',
			'tk': 'Turkmen',
			'tl': 'Tagalog',
			'tn': 'Setswana',
			'to': 'Tonga',
			'tr': 'Turkish',
			'ts': 'Tsonga',
			'tt': 'Tatar',
			'tw': 'Twi',
			'uk': 'Ukrainian',
			'ur': 'Urdu',
			'uz': 'Uzbek',
			'vi': 'Vietnamese',
			'vo': 'Volapuk',
			'wo': 'Wolof',
			'xh': 'Xhosa',
			'yo': 'Yoruba',
			'zh': 'Chinese',
			'zu': 'Zulu'
		}

		let allLanguagesArray = []

		for(let language in foreignLanguages) {
			let languageNames = [language, foreignLanguages[language].toLowerCase()]
			allLanguagesArray.push(...languageNames)
		}

		return allLanguagesArray
	}


}
