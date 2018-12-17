require('dotenv').config();
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = 'http://localhost:'+process.env.PORT;
const uuidv4 = require('uuid/v4');

chai.should();

chai.use(chaiHttp);

const adminId = '89e774a0-920b-48d8-8c00-b725b4fac8fc';
const userId = '4d005401-1a32-42ec-84d5-9050f21c12b4';
const userId2 = '4afe6ad9-ba78-4dc8-98f2-657bd657af79';

describe('Wacana Posts Negative Test', () => {
    beforeEach((done) => {
           done();            
    });

    describe('1. Posts', () => {
        it('Cannot post new wacana content if not admin', (done) => {
            let post_title = 'Post-'+uuidv4();
            let post_content = 'Post-Content-'+uuidv4();

            let requestData = {
                author_id : userId,
                post_title : post_title,
                post_content: post_content
            }

            chai.request(server)
                .post('/api/v1/posts/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('is not allowed to post new wacana content');
                    done();                                
                });
        });

        it('Cannot post new wacana content if missing author_id parameter', (done) => {
            let post_title = 'Post-'+uuidv4();
            let post_content = 'Post-Content-'+uuidv4();

            let requestData = {
                author_id : '',
                post_title : post_title,
                post_content: post_content
            }

            chai.request(server)
                .post('/api/v1/posts/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required author_id parameter');
                    done();                                
                });
        });

        it('Cannot post new wacana content if missing post_title parameter', (done) => {
            let post_content = 'Post-Content-'+uuidv4();

            let requestData = {
                author_id : adminId,
                post_title : '',
                post_content: post_content
            }

            chai.request(server)
                .post('/api/v1/posts/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required post_title parameter');
                    done();                                
                });
        });

        it('Cannot post new wacana content if missing post_content parameter', (done) => {
            let post_title = 'Post-Content-'+uuidv4();

            let requestData = {
                author_id : adminId,
                post_title : post_title,
                post_content: '',
            }

            chai.request(server)
                .post('/api/v1/posts/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required post_content parameter');
                    done();                                
                });
        });
    });
});