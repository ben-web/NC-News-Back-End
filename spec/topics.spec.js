'use strict';

process.env.NODE_ENV = 'test';

const
  { expect } = require('chai'),
  app = require('../app'),
  request = require('supertest')(app),
  testData = require('../seed/testData'),
  seedDB = require('../seed/seed'),
  mongoose = require('mongoose');

describe('NORTHCODERS NEWS API /api', () => {
  let topicDocs, etc, wrongID = mongoose.Types.ObjectId(); // invoking ObjectId here generates a valid mongo ID that shouldn't match anything

  beforeEach(() => {
    return seedDB(testData)
      .then(docsArray => {
        [topicDocs, etcDocs] = docsArray;
      });
  });

  after(() => {
    mongoose.disconnect();
  });

  describe('/topics', () => {

    it('GET returns all topic objects, which have the expected keys', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('topics');
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]).to.be.an('object');
          expect(res.body.topics[0]).to.have.all.keys(
            '_id',
            'title',
            'slug',
            '__v'
          );
        });
    });

    it('POST adds an actore to the db and returns that actor object', () => {
      const newTopic = {
        title: 'My New Title',
        slug: 'my-new-title'
      }
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then(res => {
          expect(res.body.topic).to.have.all.keys(
            '_id',
            'topic',
            'slug',
            '__v'
          );
          expect(res.body.topic).to.eql(newTopic);
        });
    });

    // do post request but miss a field requred in schema, expect a 400, msg to say 'Actors must have names'
    // should get error name of ValidationError


  });


  describe('/topics/:topic/articles', () => {

    it('GET by id returns the ', () => {
      return request
        .get('/api/topics/coding/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('topics');
          expect(res.body.aticles.length).to.equal(2);
          expect(res.body.articles[0].title).to.equal('whatever');
        });
    });

    it('GET invalid id returns status 400 and error message', () => {
      return request
        .get('/api/topics/idontexist/articles')
        // Bad Request
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('ID Invalid');
        });
    });

    it('GET non-existent id returns status 404 and error message', () => {
      return request
        .get('/api/topics/${wrongId}')
        // Bad Request
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('ID Invalid');
        });
    });

  }); // CLOSE TOPICS

}); // CLOSE API

