# Ben Web's NC News

## Back End RESTful API

NC News is a news aggregation demo loosely based on Reddit. This API was built during week six of the Northcoders' Full Stack Developer Course.

This project aims to demonstrate some of the skills learnt in four weeks of back end study including:

* JavaScript programming
* building a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) [Web API](https://en.wikipedia.org/wiki/Web_API) to respond to [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) requests
* storing data and interacting with databases
* [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)

This back end application is consumed by a front end React app created during week nine of the course. Details of the front end may be found on Github: [github.com/ben-web/NC-News-Front-End](https://github.com/ben-web/NC-News-Front-End).

## Using NC News

A working example of this API is published at [ben-web-nc-news-back-end.herokuapp.com](https://ben-web-nc-news-back-end.herokuapp.com/).

Heroku free hosting can be a little slow to start so please allow for this when starting the application.

### Endpoints

The API provides JSON responses to HTTP request methods relating to Articles, Comments, Topics and Users as described on the [API](https://ben-web-nc-news-back-end.herokuapp.com/).

#### Articles

Articles may be retrieved or added using the appropriate GET or POST HTTP method.

It's possible to retrieve all articles or articles filtered by topic.

Comments may be posted to an article on this endpoint.

#### Comments

Comment votes may be incremented or decremented using a PATCH method.

A comment may be deleted using DELETE.

#### Topics

Topics may be retrieved or added using the appropriate GET or POST method.

#### Users

A user object may be retrieved from this endpoint.

#### Errors

Bad route, request and database errors result in the relevant 400/500 response headers and an error message in the JSON response body.

Express's next() method is used to handle errors.

## Seeding Functions

The original seed data for this project did not contain images for the articles. To make the front end more visually appealing, I've added a function to the Article model to insert a random image when an Article object is created.

I've also added random vote counts to Article objects in order to demonstrate sorting by vote count on the front end.

## Installing a Local Copy

These instructions will help you to get a copy of NC News up and running on your local machine for testing purposes.

### Installing

Before installing this project, ensure you have this software installed:

* [Node.js 10.6.0](https://nodejs.org/en/download/)
* [MongoDB 3.4.17](https://docs.mongodb.com/manual/installation/)

Duplicate or fork this repository from [github.com/ben-web/NC-News-Back-End](https://github.com/ben-web/NC-News-Back-End).

Inside this new directory, install the required NPM packages:

```bash
npm install
```

Next, create a _config_ directory in your project root. In this directory, add an _index.js_ file with the following content:

```javascript
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const dbConfig = {
  development: 'mongodb://localhost:27017/northcoders_news',
  production: 'mongodb://<USERNAME>:<PASSWORD>.<YOUR_PRODUCTION_DB_URL>',
  test: 'mongodb://localhost:27017/northcoders_news_test'
};

module.exports = dbConfig[process.env.NODE_ENV]
```

### Seed the database

Before seeding the database, ensure you have MongoDB running. In a separate CLI instance run the command:

```text
mongod
```

Data is stored in the _./seed/data_ directory in JSON format. To seed your database with this data, run this command in your project CLI:

```text
npm run seed:dev
```

If successful, you will see this message:

```text
Added to DB: 36 Articles | 300 Comments | 3 Topics | 6 Users
```

### Run the application

To start the application, run this command in the CLI:

```text
npm run dev
```

If successful, you will see this message:

```text
Express server listening on - http://localhost:9090
Connected to mongodb://localhost:27017/northcoders_news
```

You may now access the application at [http://localhost:9090](http://localhost:9090).

### View endpoints

A HTML summary of API endpoints is displayed at [http://localhost:9090/api](http://localhost:9090/api).

As an example, make a GET request to [http://localhost:9090/api/articles](http://localhost:9090/api/articles).

The _/api/articles_ endpoint will return a JSON array of article objects in this format:

```JSON
{
  "articles": [
    {
      "_id": "5b794cd225a65452d9155364",
      "votes": 0,
      "title": "Running a Node App",
      "created_by": {
        "_id": "5b794cd225a65452d9155363",
        "username": "jessjelly",
        "name": "Jess Jelly",
        "avatar_url": "https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg",
        "__v": 0
      },
      "body": "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
      "created_at": "2016-08-18T12:07:52.389Z",
      "belongs_to": "coding",
      "image_url": "https://picsum.photos/g/600/300?image=30",
      "votes": 51
      "__v": 0,
      "comments": 8
    }
  ]
}
```

## Running the tests

Automated tests for each endpoint are located in _./spec/api.spec.js_.

Run these tests using the command:

```text
npm run test
```

Results are then displayed for each test:

```text
  NORTHCODERS NEWS API
    /api/topics
Connected to mongodb://localhost:27017/northcoders_news_test
      ✓ GET topics returns all topic objects, and those objects have the expected keys (44ms)
    /api/topics/:topic_slug/articles
      ✓ GET articles by topic_slug returns status 200 and all article objects that match the slug, objects have the expected keys
      ✓ GET articles by topic_slug returns article objects which have a created_by key populated with the correct user
      ✓ GET articles by topic_slug includes comment count with correct value
      ✓ GET articles by non-existent topic_slug returns status 404 and error message
      ✓ POST article returns status 201 posted article object with expected keys and values
      ✓ POST article with non-existent topic_slug returns status 400 and error message
      ✓ POST article with missing required field returns status 400 and error message
    /api/articles
      ✓ GET articles returns status 200 and all article objects, objects have the expected keys
      ✓ GET articles returns article objects which have a created_by key populated with correct user
      ✓ GET articles includes comment count with correct value
    /api/articles/:article_id
      ✓ GET article with valid article_id returns status 200 that article object with expected keys
      ✓ GET article returns article object which has a created_by key populated with the correct user
      ✓ GET article includes comment count with correct value
      ✓ GET article with non-existent article_id returns status 404 and error message
      ✓ GET article with invalid article_id returns status 400 and error message
      ✓ PATCH article vote=up increments article vote by 1, returns status 200 and updated article object
      ✓ PATCH article vote=down decrements article vote by 1 returns status 200 and updated article object
      ✓ PATCH article with non-existent article_id returns status 404 and error message
      ✓ PATCH article with invalid article_id returns status 400 and error message
      ✓ PATCH article with invalid vote value returns status 400 and error message
    /api/articles/:article_id/comments
      ✓ GET comments with valid article_id returns stats 200 and that articles comment objects with expected keys
      ✓ GET comments returns comment objects which have a belongs_to key populated with the correct article
      ✓ GET comments returns comment objects which have a created_by key populated with the correct user
      ✓ GET comments returns status 404 if there are no comments related to the specified article
      ✓ GET comments with non-existent article_id returns status 400 and error message
      ✓ GET comments with invalid article_id returns status 400 and error message
      ✓ POST comment with valid article_id returns posted comment object with expected keys and values
      ✓ POST comment returns comment object which has a created_by key populated with the correct user object
      ✓ POST comment with missing required field returns status 400 and error message
      ✓ POST comment with non-existent article_id returns status 400 and error message
      ✓ POST comment with invalid article_id returns status 400 and error message
      ✓ POST comment with non-existent user_id returns status 400 and error message
      ✓ POST comment with invalid user_id returns status 400 and error message
    /api/comments/:comment_id
      ✓ PATCH comment vote=up increments comment vote by 1, returns status 200 and updated comment object
      ✓ PATCH comment vote=down decrements comment vote by 1, returns status 200 and updated comment object
      ✓ PATCH comment with non-existent comment_id returns status 404 and error message
      ✓ PATCH comment with invalid comment_id returns status 400 and error message
      ✓ DELETE comment with valid comment_id returns status 200 and deleted comment object
      ✓ DELETE comment with valid comment_id removes comment from DB
      ✓ DELETE comment with non-existent comment_id returns status 404 and error message
      ✓ DELETE comment with invalid comment_id returns status 400 and error message
    /api/users/:username
      ✓ GET user with valid username returns status 200 and the requested user object
      ✓ GET user with non-existent username returns status 404 and error message

  44 passing (4s)
```

### End to end testing

Tests use [SuperTest](https://github.com/visionmedia/supertest#readme), [Mocha](https://mochajs.org/) and [Chai](http://www.chaijs.com/) for assertion based testing.

Tests use their own database as configured in _.config/index.js_. This database is reseeded before each test using data that is stored in the _./seed/testData_ directory in JSON format.

Endpoints in a RESTful API must respond to HTTP verbs in the correct manner. The tests in this project therefore:

* validate that data is retrieved or amended as appropriate to the controller and HTTP request method
* data is returned in the correct JSON format
* correct HTTP status codes are attached to the response header
* error messages are returned where required

#### Example of happy path testing

This example makes a request for a single article using its ID parameter. The test checks that the endpoint's response:

* has the correct HTTP status code
* includes an article object in the correct format
* that the article returned is the correct article

```javascript
    it('GET article with valid article_id returns status 200 that article object with expected keys', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('article');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'comments',
            'created_at',
            'created_by',
            'belongs_to',
            'image_url',
            'votes',
            '__v'
          );
          expect(res.body.article._id).to.equal(articleDocs[0]._id.toString());
        });
    });
```

#### Example of unhappy path testing

This example makes a request for a single article that does not exist. The test checks that the endpoint's response has the correct HTTP error status code.

```javascript
    it('GET article with non-existent article_id returns status 404 and error message', () => {
      return request
        .get(`/api/articles/${nonExistentId}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article Not Found');
        });
    });
```

Please see the _./spec/api.spec.js_ file for the specification of each test.

## Built With

* [Node.js](https://nodejs.org/) - JavaScript runtime built on [Chrome's V8 JavaScript engine](https://developers.google.com/v8/)
* [Express.js](https://expressjs.com/) - Web Framework for Node.js
* [MongoDB](https://www.mongodb.com/) - Document Database
* [Mongoose](http://mongoosejs.com/) - Object Modelling for Node and Mongo DB
* [Mocha](https://mochajs.org/) - JavaScript test framework
* [Chai](https://www.chaijs.com/) - Asserion based testing for Mocha
* [Supertest](https://github.com/visionmedia/supertest) - HTTP assertion testing agent

## Author

* **Ben Web** - *Northcoders Student* - [northcoders.com](https://northcoders.com)
