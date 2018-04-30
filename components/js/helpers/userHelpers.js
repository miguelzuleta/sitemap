const { userDesktop } = require('./urls/validateURLs.js')
const { dialog } = require('electron').remote

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
