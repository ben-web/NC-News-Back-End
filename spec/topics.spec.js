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
  let
    articleDocs,
    commentDocs,
    topicDocs,
    userDocs,
    wrongId = mongoose.Types.ObjectId(); // Invoking ObjectId here generates a valid mongo ID that shouldn't match anything

  beforeEach(() => {
    return seedDB(testData)
      .then(docsArray => {
        [
          articleDocs,
          commentDocs,
          topicDocs,
          userDocs
        ] = docsArray;
      });
  });

  after(() => {
    mongoose.disconnect();
  });

  describe('/api/topics', () => {
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
  });

  describe('/api/topics/:topic_slug/articles', () => {
    it('GET articles by topic_slug returns all article objects that match the slug and objects have the correct keys', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].belongs_to).to.equal('cats');
          expect(res.body.articles[0]).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
        });
    });
    it('GET articles by non-existent topic_slug returns status 404 and error message', () => {
      return request
        .get('/api/topics/idontexist/articles')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('No Articles Found for Requested Topic');
        });
    });

    it('POST article returns new article object with expected keys', () => {
      const
        userId = userDocs[0]._id,
        topic_slug = topicDocs[0].slug,
        newArticle = {
          title: 'New Article Title',
          body: 'New Article Body',
          created_by: userId
        };
      return request
        .post(`/api/topics/${topic_slug}/articles`)
        .send(newArticle)
        .expect(201)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_by',
            'created_at',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.article.title).to.equal(newArticle.title);
          expect(res.body.article.belongs_to).to.equal(topic_slug);
        });
    });


  }); // CLOSE TOPICS

}); // CLOSE API



/* xit('invalid id returns status 400 and error message', () => {
  return request
    .get('') ${wrongId}
    // Bad Request
    .expect(400)
    .then(res => {
      expect(res.body.msg).to.equal('ID Invalid');
    });
});
 */