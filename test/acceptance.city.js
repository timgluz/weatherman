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
 
    it('it should return Singapore as top result', (done) => {
      let res = City.findClosest(1.2896700, 103.8500700);
      
      res.should.be.a('array');
      res.should.have.length(7);
      res[0].i.should.eql(1882118); //Tanglin Halt in Singapore
      res[1].i.should.eql(1882707); //Chinese garden in Singapore
      res[2].i.should.eql(1880252); //Singapore
      done();
    });

    it('it should return New York as top result', (done) => {
      let res = City.findClosest(40.7142700, -74.0059700);
      res.should.be.a('array');
      res.should.have.length(10);
      res[0].i.should.eql(5095445); // Bayonne, New Jersey
      res[8].i.should.eql(5128581); // New York City 
      done();
    });

    it('it should return Tallinn as top result', (done) => {
      let res = City.findClosest(59.4369600, 24.7535300);

      res.should.be.a('array');
      res.should.have.length(10);
      res[0].i.should.eql(589947); // N6mme, part of City
      res[8].i.should.eql(588409); // Tallinn 
      done();
    });


  });
});
