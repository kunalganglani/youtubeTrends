const chai = require('chai');
const chaiHttp = require('chai-http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const server = require('../app');
const expect = chai.expect;
import { YoutubeService } from '../services/youtube';
import { errorHandler } from '../middleware/error-handler';
const response = require('./response');
chai.should();
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);
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
  it('should send Error code 404, when routed to random url', () => {
    return chai.request(server)
      .get('/random')
      .then((response) => {
        response.should.have.status(404);
      })
      .catch((error) => {
        throw error;
      });
  });
  it('should handle errors with errorHandler with environment as development', () =>{
    let req = {
      params: {},
      body: {},
      app: {
        get(env){
          if(env === 'env')
          return 'development';
          else{
            return 'production';
          }
        }
      }
    };
    let res = {
      data: null,
      code: null,
      locals: {
        message: '',
        error: ''
      },
      status (status) {
        this.code = status
        return this
      },
      render(message) {
        return message;
      },
      send (payload) {
        this.data = payload
      }
    };
    errorHandler({message: 'NotFoundError: Not Found'},req,res);
    expect(res.locals.message).to.equal('NotFoundError: Not Found');
    expect(JSON.stringify(res.locals.error)).to.equal(JSON.stringify({message: 'NotFoundError: Not Found'}));
  });
  it('should handle errors with errorHandler with environment as production', () =>{
    let req = {
      params: {},
      body: {},
      app: {
        get(env){
          if(env === 'env')
          return 'production';
          else{
            return 'development';
          }
        }
      }
    };
    let res = {
      data: null,
      code: null,
      locals: {
        message: '',
        error: ''
      },
      status (status) {
        this.code = status
        return this
      },
      render(message) {
        return message;
      },
      send (payload) {
        this.data = payload
      }
    };
    errorHandler({message: 'NotFoundError: Not Found'},req,res);
    expect(res.locals.message).to.equal('NotFoundError: Not Found');
    expect(JSON.stringify(res.locals.error)).to.equal(JSON.stringify({}));
  });


});
describe('Select Dropdown', function () {
  it('reflects country matching the country code present in url', (done) => {
    chai.request(server)
      .get('/youtube')
      .end(function (err, res) {
        const dom = new JSDOM(`${res.text}`);
        expect((dom.window.document.querySelector("select").value)).to.equal('AF');
        done();
      });
  });
  it('should have country code IN when IN passed as query parameter', (done) => {
    chai.request(server)
      .get('/youtube?countryCode=IN')
      .end(function (err, res) {
        const dom = new JSDOM(`${res.text}`);
        expect((dom.window.document.querySelector("select").value)).to.equal('IN');
        done();
      });
  });
});
describe('Youtube Service', function () {
  it('Service should 24 trend items for any country', async () => {
    mock
      .onGet('/', {
        params: {
          part: 'snippet',
          chart: 'mostPopular',
          regionCode: 'IN',
          maxResults: '24',
          key: 'somekey'
        }
      })
      .reply(200, { trends: response });
    await axios.get('/', {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        regionCode: 'IN',
        maxResults: '24',
        key: 'somekey'
      }
    })
      .then(function (response) {
        expect(response.data.trends.response).with.lengthOf(24);
      }).catch((error) => {
        throw error;
      });;
  })
});
