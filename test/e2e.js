require('dotenv').config();
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = 'http://localhost:'+process.env.PORT;
const uuidv4 = require('uuid/v4');

chai.should();

chai.use(chaiHttp);
chai.use(require('chai-things'));

const adminId = '89e774a0-920b-48d8-8c00-b725b4fac8fc';
const userId = '4d005401-1a32-42ec-84d5-9050f21c12b4';
const userId2 = '4afe6ad9-ba78-4dc8-98f2-657bd657af79';

const post_title = 'Post-'+uuidv4();
const post_comment = 'Post-Content-'+uuidv4();
const comment_content1 = 'Comment-'+uuidv4();
const comment_content2 = 'Comment-'+uuidv4();

describe('Wacana E2E Test', () => {
    beforeEach((done) => {
           done();            
    });

    describe('Wacana E2E Test - Ensure the network and API are running', () => {
        it('1. Create Dummy Post and 2 Dummy Comment', (done) => {

            let requestData = {    
                author_id : adminId,
                post_title : post_title,
                post_content: post_comment
            }

            let requestData2 = {
                post_id : '',
                user_id : userId,
                comment_content: comment_content1
            }

            let requestData3 = {
                post_id : '',
                user_id : userId2,
                comment_content: comment_content2
            }

            chai.request(server)
                .post('/api/v1/posts/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql('Successfully created a new post');
                    res.body.should.have.property('post_id');

                    requestData2.post_id = res.body.post_id;
                    requestData3.post_id = res.body.post_id;

                    chai.request(server)
                        .post('/api/v1/comments/')
                        .send(requestData2)
                        .end((err1, res1) => {
                            res1.should.have.status(200);
                            res1.body.should.be.a('object');
                            res1.body.should.have.property('message');
                            res1.body.message.should.eql('Successfully posted a comment');
                            res1.body.should.have.property('comment_id');
                            chai.request(server)
                                .post('/api/v1/comments/')
                                .send(requestData3)
                                .end((err2, res2) => {
                                    res2.should.have.status(200);
                                    res2.body.should.be.a('object');
                                    res2.body.should.have.property('message');
                                    res2.body.message.should.eql('Successfully posted a comment');
                                    res2.body.should.have.property('comment_id');
                                    done();
                                });
                            });
                        });
        });

        it('2. Get All ', (done) => {

            chai.request(server)
                .get('/api/v1/comments/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql('Success');
                    res.body.should.have.property('result');
                    res.body.result.length.should.eql(2);
                    res.body.result.should.all.have.property('content');
                    res.body.result.should.contain.an.item.with.property('content', comment_content1);
                    res.body.result.should.contain.an.item.with.property('content', comment_content2);
                    done();
                });
        });

        it('2. Get All comments', (done) => {

            chai.request(server)
                .get('/api/v1/comments/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql('Success');
                    res.body.should.have.property('result');
                    res.body.result.length.should.eql(2);
                    res.body.result.should.all.have.property('content');
                    res.body.result.should.contain.an.item.with.property('content', comment_content1);
                    res.body.result.should.contain.an.item.with.property('content', comment_content2);
                    done();
                });
        });
    });
});