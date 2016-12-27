let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Cities endpoints', () => {
  //functional tests
  describe('/GET cities', () => {
    it('it should return 400 if no parameters were given', (done) => {
      chai.request(server)
        .get('/cities')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.be.eq('BadRequestError')
          done();
        });
    });

    it('it should return 400 if latitude is out of valid range', (done) => {
      chai.request(server)
        .get('/cities?lat=360.0&lng=0')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.be.eq('BadRequestError')
          done();
        });
    });
    
    //TODO: test cases when latitude is int, string, same for longitude;
    
    it('it should return correct list of cities', (done) => {
      chai.request(server)
        .get('/cities?lat=49.488331&lng=8.46472')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(10);
          done()
        });
    });

  });

});
