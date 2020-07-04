/* eslint-disable no-undef */
const utilTester = require('../src/utils.js')
var assert = require('assert')

describe('Paths', function () {
  describe('shrinkPath', function () {
    it('should return a shrunk path', function () {
      assert.equal(utilTester.shrinkPath('/home/blabla/TA.pdf'), '.../TA.pdf')
      assert.equal(utilTester.shrinkPath('/home/blabla/shsb/haah/TB.pdf'), '.../TB.pdf')
      assert.equal(utilTester.shrinkPath('TC.pdf'), '.../TC.pdf')
      assert.equal(utilTester.shrinkPath('./TD.pdf'), '.../TD.pdf')
      assert.equal(utilTester.shrinkPath('../TE.pdf'), '.../TE.pdf')
    })
  })
})
