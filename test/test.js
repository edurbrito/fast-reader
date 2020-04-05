const util_tester = require('../src/utils.js');
var assert = require('assert');

describe('Paths', function() {
  describe('shrinkPath', function() {
    it('should return a shrunk path', function() {
      assert.equal(util_tester.shrinkPath("/home/blabla/TA.pdf"),".../TA.pdf");
      assert.equal(util_tester.shrinkPath("/home/blabla/shsb/haah/TB.pdf"),".../TB.pdf");
      assert.equal(util_tester.shrinkPath("TC.pdf"),".../TC.pdf");
      assert.equal(util_tester.shrinkPath("./TD.pdf"),".../TD.pdf");
      assert.equal(util_tester.shrinkPath("../TE.pdf"),".../TE.pdf");
    });
  });
});
