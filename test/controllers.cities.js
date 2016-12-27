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
          done();
        });
    });

  });


  //-- GET /cities/:cityId routes
  describe('GET /cities/2873891', () => {
    it('it should return expected data for the Monnem', (done) => {
      chai.request(server)
        .get('/cities/2873891')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.eql('Mannheim');
          res.body.id.should.eql(2873891);
          res.body.lat.should.eql(49.488331);
          res.body.lng.should.eql(8.46472);
          done();
        });
    });

    it('it should return 400 if cityId is not valid', (done) => {
      chai.request(server)
        .get('/cities/11nonsense')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.code.should.be.eq('BadRequestError');
          done();
        });
    });
  });


  //TODO: stub actual API call
  //-- GET /cities/:cityId/weather routes
  describe('GET /cities/2873891/weather', () => {
    it('it should return expected weather info', (done) => {
      chai.request(server)
        .get('/cities/2873891/weather')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.all.keys(
            'type', 'type_description', 'sunrise', 'sunset',
            'temp', 'temp_min', 'temp_max', 'pressure',
            'humidity', 'clouds_percent', 'wind_speed'
          );

          done();
        });
    });

    it('it should return 404 if cityID doesnt exist', (done) => {
      chai.request(server)
        .get('/cities/22/weather')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.all.keys('code', 'message');
          done();
        });
    });
  });

});
