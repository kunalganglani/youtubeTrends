const chai = require('chai');
const chaiHttp = require('chai-http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const server = require('../app');
const expect = chai.expect;
import { YoutubeService } from '../services/youtube';
chai.should();

chai.use(chaiHttp);

describe('Server', function () {

  it('should redirect on youtube trends', (done) => {
    chai.request(server)
      .get('/').redirects(0)
      .then(function (res) {
        res.should.have.status(302);
        res.should.redirectTo('/youtube');
        done();
      }).catch(done);
  });

  it('should open /youtube', (done) => {
    chai.request(server)
      .get('/youtube')
      .then(function (res) {
        res.should.have.status(200);
        done();
      }).catch(done);
  });

  it('should open /youtube/player', (done) => {
    chai.request(server)
      .get('/youtube/kLjJD2WH5GQ?countryCode=AF')
      .end(function (err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should send 200 response with Country Codes, Pattern:/youtube?countrycode=code', (done) => {
    chai.request(server)
      .get('/youtube?countryCode=IN')
      .end(function (err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('dropdown reflects country matching the country code present in url', (done) => {
    chai.request(server)
      .get('/youtube')
      .end(function (err, res) {
        const dom = new JSDOM(`${res.text}`);
        expect( (dom.window.document.querySelector("select").value) ).to.equal('AF');
        done();
      });
  });

  it('dropdown should have country code IN when IN passed as query parameter', (done) => {
    chai.request(server)
      .get('/youtube?countryCode=IN')
      .end(function (err, res) {
        const dom = new JSDOM(`${res.text}`);
        expect( (dom.window.document.querySelector("select").value) ).to.equal('IN');
        done();
      });
  });

  it('should send Error code 404, when routed to random url', ()=> {
    return chai.request(server)
    .get('/random')
    .then((response) => {
      response.should.have.status(404);
    })
    .catch((error) => {
      throw error;
    });
  })

  it('Service should 24 trend items for any country', async () => {
    const service = new YoutubeService();
    const trends = await service.getTrendingVideos();
    expect((trends).length).to.equal(24);
  })
});