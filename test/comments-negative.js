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
let dummyPostid;

describe('Wacana Comments Negative Test', () => {
    before((done) => {
        // create dummy post
        let post_title = 'Post-'+uuidv4();
        let post_comment = 'Post-Content-'+uuidv4();

        let requestData = {    
            author_id : adminId,
            post_title : post_title,
            post_content: post_comment
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
                dummyPostid = res.body.post_id;
                done();
            });
    });

    beforeEach((done) => {
           done();            
    });

    describe('1. Post Comments', () => {
        it('Cannot post new comment if missing post_id parameter', (done) => {
            let comment_content = 'Comment-Content-'+uuidv4();

            let requestData = {
                post_id : '',
                user_id : userId,
                comment_content: comment_content
            }

            chai.request(server)
                .post('/api/v1/comments/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required post_id parameter');
                    done();                                
                });
        });

        it('Cannot post new wacana content if missing user_id parameter', (done) => {
            let comment_content = 'Comment-Content-'+uuidv4();

            let requestData = {
                post_id : dummyPostid,
                user_id : '',
                comment_content: comment_content
            }

            chai.request(server)
                .post('/api/v1/comments/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required user_id parameter');
                    done();                                
                });
        });

        it('Cannot post new wacana content if missing comment_content parameter', (done) => {

            let requestData = {
                post_id : dummyPostid,
                user_id : userId,
                comment_content: ''
            }

            chai.request(server)
                .post('/api/v1/comments/')
                .send(requestData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.include('Validation Failed : missing required comment_content parameter');
                    done();                                
                });
        });
    });
});