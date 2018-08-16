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
    userDocs;

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
      const topic_slug = topicDocs[0].slug;
      return request
        .get(`/api/topics/${topic_slug}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].belongs_to).to.equal(topic_slug);
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
      const topic_slug = 'idontexist';
      return request
        .get(`/api/topics/${topic_slug}/articles`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('No Articles Found for Requested Topic');
        });
    });
    it('POST article returns posted article object with expected keys and values', () => {
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
    it('POST article with non-existent topic_slug returns status 400 and error message', () => {
      const
        userId = userDocs[0]._id,
        topic_slug = 'idontexist',
        newArticle = {
          title: 'New Article Title',
          body: 'New Article Body',
          created_by: userId
        };
      return request
        .post(`/api/topics/${topic_slug}/articles`)
        .send(newArticle)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Topic Does Not Exist');
        });
    });
    it('POST article with missing required field returns status 400 and error message', () => {
      const
        userId = userDocs[0]._id,
        topic_slug = topicDocs[0].slug,
        newArticle = {
          title: 'New Article Title',
          // Required field removed: body
          created_by: userId
        };
      return request
        .post(`/api/topics/${topic_slug}/articles`)
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
      const
        article_id = articleDocs[0]._id,
        title = articleDocs[0].title;
      return request
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('article');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article.title).to.equal(title);
        });
    });
    it('GET with non-existent article_id returns status 404 and error message', () => {
      const article_id = mongoose.Types.ObjectId();
      return request
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article Not Found');
        });
    });
    it('GET with invalid article_id returns status 404 and error message', () => {
      const article_id = 'iAmNotAnId';
      return request
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });

  });
});
