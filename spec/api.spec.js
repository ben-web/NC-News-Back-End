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

  // TOPICS ///////////////////////////////////////

  describe('/api/topics', () => {
    it('GET topics returns all topic objects, and those objects have the expected keys', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('topics');
          expect(res.body.topics.length).to.equal(topicDocs.length);
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
    it('GET articles by topic_slug returns status 200 and all article objects that match the slug and those objects have the correct keys', () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(
            articleDocs.filter(article => article.belongs_to === topicDocs[0].slug).length
          );
          expect(res.body.articles[0]).to.have.all.keys(
            '_id',
            'title',
            'body',
            'comments',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.articles[0].belongs_to).to.equal(topicDocs[0].slug);
          // Check created_by is populated with user object
          expect(res.body.articles[0].created_by).to.have.all.keys(
            '_id',
            'avatar_url',
            'name',
            'username',
            '__v'
          );
        });
    });
    it('GET articles by topic_slug includes comment count with correct value', () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .then(res => {
          expect(res.body.articles[0].comments).to.equal(
            commentDocs.reduce((count, comment) => {
              return count + (comment.belongs_to ===
                articleDocs.find(article => article.belongs_to === topicDocs[0].slug)._id);
            }, 0)
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
    it('POST article returns status 201 posted article object with expected keys and values', () => {
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

  // ARTICLES ///////////////////////////////////////

  describe('/api/articles', () => {
    it('GET articles returns satus 200 and all article objects, and those objects have the expected keys\n         created_by is populated with user object', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('articles');
          expect(res.body.articles.length).to.equal(articleDocs.length);
          expect(res.body.articles[0]).to.be.an('object');
          expect(res.body.articles[0]).to.have.all.keys(
            '_id',
            'title',
            'body',
            'comments',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.articles[0]._id).to.equal(articleDocs[0]._id.toString());
          // Check created_by is populated with user object
          expect(res.body.articles[0].created_by).to.have.all.keys(
            '_id',
            'avatar_url',
            'name',
            'username',
            '__v'
          );
        });
    });
  });
  it('GET articles includes comment count with correct value', () => {
    return request
      .get(`/api/articles`)
      .then(res => {
        expect(res.body.articles[0].comments).to.equal(
          commentDocs.filter(comment => {
            return comment.belongs_to === articleDocs[0]._id;
          }).length
        );
      });
  });

  describe('/api/articles/:article_id', () => {
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
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.article._id).to.equal(articleDocs[0]._id.toString());
          // Check created_by is populated with user object
          expect(res.body.article.created_by).to.have.all.keys(
            '_id',
            'avatar_url',
            'name',
            'username',
            '__v'
          );
        });
    });
    it('GET article with non-existent article_id returns status 404 and error message', () => {
      return request
        .get(`/api/articles/${nonExistentId}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article Not Found');
        });
    });
    it('GET article with invalid article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${invalidId}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
    it('PATCH article vote=up increments article vote by 1, returns status 200 and updated article object', () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('article');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.article._id).to.equal(articleDocs[0]._id.toString());
          expect(res.body.article.votes).to.equal(articleDocs[0].votes + 1);
        });
    });
    it('PATCH article vote=down decrements article vote by 1 returns status 200 and updated article object', () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('article');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.article._id).to.equal(articleDocs[0]._id.toString());
          expect(res.body.article.votes).to.equal(articleDocs[0].votes - 1);
        });
    });
    it('PATCH article with non-existent article_id returns status 404 and error message', () => {
      return request
        .patch(`/api/articles/${nonExistentId}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article Not Found');
        });
    });
    it('PATCH article with invalid article_id returns status 404 and error message', () => {
      return request
        .patch(`/api/articles/${invalidId}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
    it('PATCH article with invalid vote value returns status 400 and error message', () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=abc`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Vote Value Invalid');
        });
    });
  });

  describe('/api/articles/:article_id/comments', () => {
    it('GET comments with valid article_id returns stats 200 and that article\'s comment objects with expected keys\n         belongs_to is populated with article object\n         created_by is populated with user object', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('comments');
          expect(res.body.comments.length).to.equal(
            commentDocs.filter(comment => comment.belongs_to === articleDocs[0]._id).length
          );
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
          // Check belongs_to is populated with article object
          expect(res.body.comments[0].belongs_to).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.comments[0].belongs_to._id).to.equal(articleDocs[0]._id.toString());
          // Check created_by populated with user object
          expect(res.body.comments[0].created_by).to.have.all.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
        });
    });
    it('GET comments returns status 404 if there are no comments related to specified article', () => {
      const newArticle =
      {
        title: 'New Article Title',
        body: 'New Article Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send(newArticle)
        .then(res => {
          return request
            .get(`/api/articles/${res.body.article._id}/comments`)
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal('No Comments Found for Article');
            });
        })
    })
    it('GET comments with non-existent article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${nonExistentId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Article Does Not Exist');
        });
    });
    it('GET comments with invalid article_id returns status 400 and error message', () => {
      return request
        .get(`/api/articles/${invalidId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
    it('POST comment with valid article_id returns posted comment object with expected keys and values,\n         belongs_to is populated with article object\n         created_by is populated with user object', () => {
      const newComment =
      {
        body: 'New Comment Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body.comment).to.have.all.keys(
            '_id',
            'body',
            'belongs_to',
            'created_at',
            'created_by',
            'votes',
            '__v'
          );
          expect(res.body.comment.body).to.equal(newComment.body);
          // Check belongs_to is populated with article object
          expect(res.body.comment.belongs_to).to.have.all.keys(
            '_id',
            'title',
            'body',
            'created_at',
            'created_by',
            'belongs_to',
            'votes',
            '__v'
          );
          expect(res.body.comment.belongs_to._id).to.equal(articleDocs[0]._id.toString());
          // Check created_by populated with user object
          expect(res.body.comment.created_by).to.have.all.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
          expect(res.body.comment.created_by._id).to.equal(userDocs[0]._id.toString());
        })
    });
    it('POST comment with missing required field returns status 400 and error message', () => {
      const newComment =
      {
        // Required field removed: body
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('comments validation failed: body: Path `body` is required.');
        });
    });
    it('POST comment with non-existent article_id returns status 400 and error message', () => {
      const newComment =
      {
        body: 'New Comment Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/articles/${nonExistentId}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Article Does Not Exist');
        });
    });
    it('POST comment with invalid article_id returns status 400 and error message', () => {
      const newComment =
      {
        body: 'New Comment Body',
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/articles/${invalidId}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
    it('POST comment with non-existent user_id returns status 400 and error message', () => {
      const newComment =
      {
        body: 'New Comment Body',
        created_by: nonExistentId
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('User Does Not Exist');
        });
    });
    it('POST comment with invalid user_id returns status 400 and error message', () => {
      const newComment =
      {
        body: 'New Comment Body',
        created_by: invalidId
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('User Does Not Exist');
        });
    });
  });

  // COMMENTS ///////////////////////////////////////

  describe('/api/comments/:comment_id', () => {
    it('PATCH comment vote=up increments comment vote by 1, returns status 200 and updated comment object', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('comment');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment).to.have.all.keys(
            '_id',
            'body',
            'belongs_to',
            'created_at',
            'created_by',
            'votes',
            '__v'
          );
          expect(res.body.comment._id).to.equal(commentDocs[0]._id.toString());
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes + 1);
        });
    });
    it('PATCH comment vote=down decrements comment vote by 1, returns status 200 and updated comment object', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('comment');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment).to.have.all.keys(
            '_id',
            'body',
            'belongs_to',
            'created_at',
            'created_by',
            'votes',
            '__v'
          );
          expect(res.body.comment._id).to.equal(commentDocs[0]._id.toString());
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes - 1);
        });
    });
    it('PATCH comment with non-existent comment_id returns status 404 and error message', () => {
      return request
        .patch(`/api/comments/${nonExistentId}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Comment Not Found');
        });
    });
    it('PATCH comment with invalid comment_id returns status 400 and error message', () => {
      return request
        .patch(`/api/comments/${invalidId}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
    it('DELETE comment with valid comment_id deletes the comment and returns status 200 and deleted comment object', () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('comment');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment).to.have.all.keys(
            '_id',
            'body',
            'belongs_to',
            'created_at',
            'created_by',
            'votes',
            '__v'
          );
          expect(res.body.comment._id).to.equal(commentDocs[0]._id.toString());
        });
    });
    it('DELETE comment with non-existent comment_id returns status 404 and error message', () => {
      return request
        .delete(`/api/comments/${nonExistentId}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Comment Not Found');
        });
    });
    it('DELETE comment with invalid comment_id returns status 400 and error message', () => {
      return request
        .delete(`/api/comments/${invalidId}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Provided ID was Invalid');
        });
    });
  });

  // USERS ///////////////////////////////////////

  describe('/api/users/:username', () => {
    it('DELETE user with valid username deletes the user and returns status 200 and deleted user object', () => {
      return request
        .delete(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys('user');
          expect(res.body.user).to.be.an('object');
          expect(res.body.user).to.have.all.keys(
            '_id',
            'avatar_url',
            'name',
            'username',
            '__v'
          );
          expect(res.body.user._id).to.equal(userDocs[0]._id.toString());
          // add check that user removed from db?
        });
    });
    it('DELETE user with non-existent username returns status 404 and error message', () => {
      return request
        .delete(`/api/users/${nonExistentId}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('User Not Found');
        });
    });
  });
});