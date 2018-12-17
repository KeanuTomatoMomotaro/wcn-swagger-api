# Wcn-swagger-node-api

This repository contains the Node.js backend logic code to complement the wcn content platform written with [Express.js](https://expressjs.com/). In addition, this project utilizes [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) to allow for convinient API testing using the swagger web interface.

## Getting Started

These instructions will get you a copy of the project up and running on a local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (Node v8.11.x, npm v5.6.x)
- Local MariaDb / mysql database environment with [XAMPP](https://www.apachefriends.org/index.html) (latest) / [mysql docker image](https://hub.docker.com/_/mysql/) (v5.7.x)

### Installing

1. Clone this repository

2. `cd` into cloned directory folder and Install Node.js dependencies

```
npm install
```
3. Create a `.env` file and populate with the development environment credentials

```
DB_HOST=[sql database hostname]
DB_USER=[sql database username]
DB_PASSWORD=[sql database password]
DB_NAME=[sql database name in the sql database environment]
PORT=[desired port to run application]
```

4. Setup a sql database environment and import the sql table schema from `db/wcn.sql`

5. Run the express.js API

```
> npm start

> wcn-swagger-api@1.0.0 start /Users/ibm-jti/Documents/CODE/cloud/personal/express/wcn-swagger-api
> node app.js

API Server started. Listening on port:8081
```

6. Finally you can run the end to end tests or interact with the API manually using the swagger API in `http://localhost:PORT/api-docs`

## Running tests

After cloning the repository, downloading project dependencies, and setting up the development environment, it is advised to run the end to end test.

```
npm run e2e-test
```

### Break down into end to end tests

The end to end test is basically a positive test case to test the API's ability to successfully create new posts and comments for the wcn platform. By default, it creates a single dummy post and two dummy comments and sends them each to the database within the development environment.

```
...
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
...
```

In addition to the end to end test, negative unit tests for each functionality are also provided.

```
// runs all negative test
npm run negative-test

// runs a post functionality negative test
npm run posts-negative-test

// runs a comments functionality negative test
npm run comments-negative-test
...
```
Refer to the `package.json` file to see all relevant test scripts that can be run 

## Deployment

`manifest.yml` can be used to deploy to IBM Cloud Node.js PAAS [Guidelines WIP]


## Contributing

Please read the `LICENSE` file for relevant license information. [Contribution guidelines WIP]


## Authors

* **Keanu Nurherbyanto** - *Initial work* - [KeanuTomatoMomotaro](https://github.com/KeanuTomatoMomotaro)

See also the list of [contributors](https://github.com/KeanuTomatoMomotaro/wcn-swagger-node-api/graphs/contributors) who participated in this project.

## License

This project is licensed under the APACHE License - see the [LICENSE](LICENSE) file for details