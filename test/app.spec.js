const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();

chai.use(chaiHttp);

describe('Server', function() {

  it('should redirect on youtube trends', (done) => {
    chai.request(server)
      .get('/').redirects(0)
      .end(function(err, res){
        res.should.have.status(302);
        res.should.redirectTo('/youtube');
        done();
      });
  });

  it('should open /youtube', (done) => {
    chai.request(server)
      .get('/youtube')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});
