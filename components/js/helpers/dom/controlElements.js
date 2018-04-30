module.exports = function $$(...allElems) {
	let resetElement = function() {
		allElems.forEach((element, index) => {
			let elementToReset = document.querySelectorAll(allElems[index])
			elementToReset.forEach(resetElement => {
				resetElement.innerHTML = ''
			})
		})

		return this
 	}

	let controlCSS = function(props) {
		for (value in props) {
			allElems.forEach(element => {
				let allElements = document.querySelectorAll(element)
				allElements.forEach(styleElement => {
					let classNameArray = props[value]
					switch (value) {
						case 'add':
							styleElement.classList.add(...classNameArray)
							break;

						case 'remove':
							styleElement.classList.remove(...classNameArray)
							break;

						case 'toggle':
							if (classNameArray.length === 2) {
								styleElement.classList.remove(classNameArray[0])
								styleElement.classList.add(classNameArray[1])
							} else {
								styleElement.classList.toggle(...classNameArray)
							}
							break;
					}
				})
			})
		}

		return this
	}

	let renderHTML = function(newElement) {
		let getParent = document.querySelectorAll(allElems)
		let childAttrs = newElement.attrs || {}
		let newChild

		getParent.forEach(eachElement => {
			function emptyHTML() {
				if (newElement.rerender){
					eachElement.innerHTML = ''
				}
			}

			if (newElement.child) {
				newChild = document.createElement(newElement.child)
				newChild.innerHTML = newElement.text || ''

				for (let key in childAttrs){
					newChild.setAttribute(key, childAttrs[key])
				}

				emptyHTML()
				eachElement.appendChild(newChild)
			} else {
				if (newElement.attrs) {
					for (let key in childAttrs){
						eachElement.setAttribute(key, childAttrs[key])
					}
				} else {
					emptyHTML()
					eachElement.innerHTML = newElement.text || '(empty)'
				}
			}
		})
	}

	return {
		resetElement: resetElement,
		controlCSS: controlCSS,
		renderHTML: renderHTML
	}
}
