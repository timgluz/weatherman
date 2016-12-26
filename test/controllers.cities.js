let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Cities endpoints', () => {
  //functional tests
  describe('/GET cities', () => {
    it('it should return list of cities', (done) => {
      chai.request(server)
        .get('/cities')
        .end((err, res) => {
          console.log(res);

          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        });
    
    });

  });

});
