const assert = require('chai').assert
const app = require('../renderer.js')

describe('test app', function() {
	it('returns hello', function() {
		assert.equal(app.some(), 'hello')
	})
})
