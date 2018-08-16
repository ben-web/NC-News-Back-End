'use strict';

process.env.NODE_ENV = 'test';

const
  { expect } = require('chai'),
  app = require('../app'),
  request = require('supertest')(app),
  testData = require('../seed/testData'),
  seedDB = require('../seed/seed'),
  mongoose = require('mongoose');

describe('NORTHCODERS NEWS API', () => {
  let
    articleDocs,
    commentDocs,
    topicDocs,
    userDocs,
    nonExistentId = mongoose.Types.ObjectId(),
    invalidId = 'notAnId';

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
    it('GET returns all topic objects, and those objects have the expected keys', () => {
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
    it('GET articles by topic_slug returns all article objects that match the slug and those objects have the correct keys', () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].belongs_to).to.equal(topicDocs[0].slug);
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
        .get(`/api/topics/non-existent-slug/articles`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('No Articles Found for Requested Topic');
        });
    });
    it('POST article returns posted article object with expected keys and values', () => {
      const newArticle =
      {
        title: 'New Article Title',
        body: 'New Article Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
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
          expect(res.body.article.belongs_to).to.equal(topicDocs[0].slug);
        });
    });
    it('POST article with non-existent topic_slug returns status 400 and error message', () => {
      const newArticle =
      {
        title: 'New Article Title',
        body: 'New Article Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/topics/non-existent-slug/articles`)
        .send(newArticle)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Topic Does Not Exist');
        });
    });
    it('POST article with missing required field returns status 400 and error message', () => {
      const newArticle =
      {
        title: 'New Article Title',
        // Required field removed: body
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send(newArticle)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('articles validation failed: body: Path `body` is required.');
        });
    });
  });
  describe('/api/articles', () => {
    it('GET returns all article objects, and those objects have the expected keys', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.be.an('object');
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
  });

  describe('/api/articles/:article_id', () => {
    it('GET with valid article_id returns that article', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('article');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article.title).to.equal(articleDocs[0].title);
        });
    });
    it('GET with non-existent article_id returns status 404 and error message', () => {
      return request
        .get(`/api/articles/${nonExistentId}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article Not Found');
        });
    });
    it('GET with invalid article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${invalidId}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    it('GET with valid article_id returns that article\'s comment objects and those objects have correct keys', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('comments');
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.comments[0]).to.be.an('object');
          expect(res.body.comments[0]).to.have.all.keys(
            '_id',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.comments[0].belongs_to).to.equal(articleDocs[0]._id.toString());
        });
    });
    xit('GET with valid article_id returns status 404 if there are no related comments', () => {
      // will have to come back to this as no test data suits test case
      return request
        .get(`/api/articles/id-of-article-without-comments/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('No Comments Found for Article');
        });
    });
    it('GET with non-existent article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${nonExistentId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Article Does Not Exist');
        });
    });
    it('GET with invalid article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${invalidId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });

    

    it('POST with valid article_id returns posted comment object');
    it('POST with non-existent article_id returns status 404 and error message');
    it('POST with invalid article_id returns status 400 and error message');
  });


});
