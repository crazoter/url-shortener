// https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const db = require("../app/models");
const Url = db.Url;
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Urls', () => {
    beforeEach((done) => { //Before each test we empty the database
        Url.destroy({
            where: {},
            truncate: false
        }).then(result => {
            done();
        }).catch(err => {
            done();
        });
        
    });

    let global_shortUrl = "";

    /*
    * Test the /POST route
    */
    describe('/POST url', () => {
        it('it should not POST an invalid URL', (done) => {
            let url = {
                url: "www.google.com"
            }
        chai.request(server)
            .post('/')
            .send(url)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                done();
            });
        });

        it('it should POST a valid URL', (done) => {
            let url = {
                url: "http://google.com"
            }
        chai.request(server)
            .post('/')
            .send(url)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('shortUrl');
                global_shortUrl = res.body.shortUrl;
                done();
            });
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET website', () => {
        it('it should GET the main webpage', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
            });
        });
    });

    /*
  * Test the /GET/:id route
  */
  describe('/GET/:id url', () => {
        it('it should not GET a url by an invalid id', (done) => {
            chai.request(server)
                .get('/a')
                .redirects(0)
                .end((err, res) => {
                    // console.log(res);
                    res.should.have.status(302);
                    res.header.should.have.property('location').eql("/?msg=Url%20with%20id%20a%20not%20found");
                    done();
            });
        });
        it('it should GET a url by a valid id', (done) => {
            chai.request(server)
                .get(`/${global_shortUrl}`)
                .redirects(0)
                .end((err, res) => {
                    res.should.have.status(302);
                    res.header.should.have.property('location');
                    res.header.should.have.property('location').not.eql("/?msg=Url%20with%20id%20a%20not%20found");
                    done();
            });
        });
    });

});