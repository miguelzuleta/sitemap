const exec = require('child_process').exec
const execFile = require('child_process').execFile
const fs = require('fs')
const http = require('http')
const { compress } = require('./helpers/urls/alterURLs.js')()
const { userDesktop, phantomPath, userRoot } = require('./helpers/urls/validateURLs.js')
const path = require('path')
const phantomjs = require('phantomjs-prebuilt')

module.exports = {
	createPhantomDirectory() {
		exec(`mkdir ${userRoot()}/phantom-files`)
	},

	removePhantomDirectory() {
		exec(`rm -rf ${userRoot()}/phantom-files`)
	},

	phantomInit(url) {
		let urlToFileName = compress(url)
		let tempPhantomJS = `${userRoot()}/phantom-files/${urlToFileName}.js`
		fs.writeFileSync(tempPhantomJS, _createPhantomFile(url))

		console.log(__dirname)

		return new Promise(resolve => {
			console.log('promise running')
			execFile(phantomPath(), [tempPhantomJS], (error, stdout, stderr) => {

				// console.log(stdout)

				if (error) {
					// throw new Error(error)
					// return
					console.log(`ERROR: ${error}`)
				}
				if (stderr) {
					throw new Error(stderr)
					return
				}
				console.log('execFile function running')
				let renderedBody = new DOMParser().parseFromString(stdout, "text/html")
				resolve(renderedBody)
			})
		})
	}
}

let _createPhantomFile = (domain, directory = '') => {
	let fileCode =`var page = require('webpage').create();
					page.open('${domain}${directory}', function() {
						window.setTimeout(function() {
							console.log(page.content)
							phantom.exit()
						}, 3000)
					});`

	return fileCode
}
