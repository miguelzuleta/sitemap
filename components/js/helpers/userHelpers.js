const { userDesktop } = require('./urls/validateURLs.js')

window.nodeRequire = require
const { dialog } = window.nodeRequire('electron').remote

// console.log(dialog)

module.exports = {
	filePathFromDialog(element) {
		dialog.showOpenDialog(
			{ properties: ["openDirectory"] },
			(folderPath) => {
				if(folderPath === undefined) {
					element.value = userDesktop()
				}

				element.value = folderPath[0]
			}
		)
	}
}
