const chai = require('chai');
const should = chai.should();
const console = require('console');
const City = require('../app/models/city');


describe("Acceptance test for Cities model", () => {
  
  //let's make sure that it finds closest cities
  describe('findClosest', () => {
    
    it('it should return the Earth for (0,0)', (done) => {
      let res = City.findClosest(0, 0, 10);
      res.should.be.a('array');
      res.should.have.length(1);
      res[0].i.should.eql(6295630);
      done();
    });
  
  });
});
