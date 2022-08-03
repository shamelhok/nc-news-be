const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection')
const seed=require('../db/seeds/seed');

afterAll(() => {
    if (db.end)  return db.end();
  });
beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
    test('endpoint responds with an array', () => {
        return request(app).get('/api/topics').expect(200).then(({body})=>{
            expect(Array.isArray(body.topics)).toBe(true)
        });
    })
    test('endpoint responds with an array of objects with correct properties', () => {
        return request(app).get('/api/topics').expect(200).then(({body})=>{
            body.topics.forEach(topic=>{
              expect(typeof(topic.description)).toEqual('string')
              expect(typeof(topic.slug)).toEqual('string')
            })
        });
    })
    test('array contains the correct data', () => {
        return request(app)
            .get('/api/topics')
            .then(({body}) => {
                const expected = [
                    {
                      description: 'The man, the Mitch, the legend',
                      slug: 'mitch'
                    },
                    {
                      description: 'Not dogs',
                      slug: 'cats'
                    },
                    {
                      description: 'what books are made of',
                      slug: 'paper'
                    }
                  ]
                expect(body.topics).toMatchObject(expected)
                expect(body.topics.length).toBe(3)
            });
    });
});
describe('GET /api/nonsense', () => {
    test('endpoint responds with a bad path messaeg', () => {
        return request(app).get('/api/nonsense').expect(404).then(({body})=>{
            expect(body.msg).toBe('URL not found')
        });
    })
});
describe('GET /api/articles/:article_id',()=>{
    test('status 200 should respond with article object', () => {
      return request(app).get('/api/articles/1').expect(200).then(({body})=>{
        expect(typeof(body.article)).toBe('object')
      })
    });
    test('status 200 article object should have correct title, topic, body and votes', () => {
      return request(app).get('/api/articles/1').expect(200).then(({body})=>{
        const expected = {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          body: "I find this existence challenging",
          votes: 100,
        }
        expect(body.article).toMatchObject(expected)
      })
    });
    test("status 200 should respond with author 's name and correct created at date", () => {
      return request(app).get('/api/articles/1').expect(200).then(({body})=>{
        const {article} = body
        expect(article.author).toBe('jonny')
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
      })
    });
    test("status 404 if no article found with requested id", () => {
      return request(app).get('/api/articles/100000').expect(404).then(({body})=>{
        expect(body.msg).toBe('article not found')
      })
    });
    test("status 400 for invalid non numeric id", () => {
      return request(app).get('/api/articles/banana').expect(400).then(({body})=>{
        expect(body.msg).toBe('invalid id')
      })
    });
})
describe('PATCH /api/articles/:article_id', ()=>{
  test('should return the article', () => {
    return request(app).patch('/api/articles/1')
    .send({inc_votes:0}).expect(200).then(({body})=>{
      const article= body.article
      expect(body.article.article_id).toEqual(1)
      expect(article.author ).toEqual('jonny')
      expect(article. title ).toEqual( "Living in the shadow of a great man" )
      expect( article.topic ).toEqual( "mitch" )
      expect(article. body).toEqual(  "I find this existence challenging")
      expect(article. votes ).toEqual( 100 )
      expect(article. created_at ).toEqual( "2020-07-09T20:11:00.000Z" )
    })
  });
  test('should update the article, increase vote', () => {
    return request(app).patch('/api/articles/2')
    .send({inc_votes:10}).expect(200).then(({body})=>{
      expect(body.article.votes).toEqual(10)
    })
  });
  test('should update the article, decrease vote', () => {
    return request(app).patch('/api/articles/1')
    .send({inc_votes:-10}).expect(200).then(({body})=>{
      expect(body.article.votes).toEqual(90)
    })
  });
  test('status 400 bad request for non inc_votes', () => {
    return request(app).patch('/api/articles/2')
    .send({inc_votes:'asdasd'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test("status 404 for non existent article", () => {
    return request(app).patch('/api/articles/100000').send({inc_votes:10}).expect(404).then(({body})=>{
      expect(body.msg).toBe('article not found')
    })
  });
  test("status 400 for bad request: body doesnt have inc_votes property", () => {
    return request(app).patch('/api/articles/100000').send({banana:10}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test("status 400 for invalid non numeric id", () => {
    return request(app).patch('/api/articles/banana').send({inc_votes:10}).expect(400).then(({body})=>{
      expect(body.msg).toBe('invalid id')
    })
  });
})
describe('GET /api/users',()=>{
  test('200 should respond with an array', () => {
    return request(app).get('/api/users').expect(200).then(({body})=>{
      expect(body.users).toBeInstanceOf(Array)
    })
  });
  test('200 should respond with an array of correct length', () => {
    return request(app).get('/api/users').expect(200).then(({body})=>{
      expect(body.users.length).toBe(4)
    })
  });
  test('200 should respond with stored users data', () => {
    return request(app).get('/api/users').expect(200).then(({body})=>{
      const user1 = body.users[0]
      const expected = {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      }
      expect(user1).toMatchObject(expected)
    })
  });
  test('200 array should contain user objects with correct properties', () => {
    return request(app).get('/api/users').expect(200).then(({body})=>{
      body.users.forEach(user=>{
      expect(user).toBeInstanceOf(Object)
      expect(typeof(user.name)).toBe('string')
      expect(typeof(user.username)).toBe('string')
      expect(typeof(user.avatar_url)).toBe('string')
    })
    })
  });
})
describe('GET and PATCH /api/articles/:article_id now includes comment count',()=>{
  test('200 article response should now include comment count property', () => {
    return request(app).get('/api/articles/1').expect(200).then(({body})=>{
      expect(body.article).toHaveProperty('comment_count')
    })
  });
  test('200 comment_count counts comments 1', () => {
    return request(app).get('/api/articles/1').expect(200).then(({body})=>{
      expect(body.article.comment_count).toEqual(11)
    })
  });
  test('200 comment_count counts comments 2', () => {
    return request(app).get('/api/articles/2').expect(200).then(({body})=>{
      expect(body.article.comment_count).toEqual(0)
    })
  });
  test('200 PATCH includes correct comment_count', () => {
    return request(app).patch('/api/articles/1').send({inc_votes:1}).expect(200).then(({body})=>{
      expect(body.article.comment_count).toEqual(11)
    })
  });
})
describe('GET /api/articles',()=>{
  test('should respond with articles array', () => {
    return request(app).get('/api/articles').expect(200).then(({body})=>{
      expect(body.articles).toBeInstanceOf(Array)
    })
  });
  test('should respond with all articles in database', () => {
    return request(app).get('/api/articles').expect(200).then(({body})=>{
      expect(body.articles.length).toBe(12)
    })
  });
  test('array should contain article objects with correct properties', () => {
    return request(app).get('/api/articles').expect(200).then(({body})=>{
      const article = body.articles[0]
      expect(typeof(article.author)).toBe('string')
      expect(typeof(article.title)).toBe('string')
      expect(typeof(article.article_id)).toBe('number')
      expect(typeof(article.topic)).toBe('string')
      expect(typeof(article.created_at)).toBe('string')
      expect(typeof(article.votes)).toBe('number')
      expect(typeof(article.comment_count)).toBe('number')
    })
  });
  test('should respond with articles in descinding date order', () => {
    return request(app).get('/api/articles').expect(200).then(({body})=>{
      const expectedFirst = testData.articleData[2]
      const expectedLast = testData.articleData[6]
      const first = body.articles[0]
      const last = body.articles.at(-1)
      expect(first.title).toBe(expectedFirst.title)
      expect(last.title).toBe(expectedLast.title)
    })
  });
  test('should respond with articles in descinding date order, tested directly with jest', () => {
    return request(app).get('/api/articles').expect(200).then(({body})=>{
      expect(body.articles).toBeSortedBy('created_at',{descending:true})
    })
  });
})
describe('GET /api/articles/:article_id/comments',()=>{
  test('should respond with comments array', () => {
    return request(app).get('/api/articles/1/comments').expect(200).then(({body})=>{
      expect(body.comments).toBeInstanceOf(Array)
    })
  });
  test('should respond with all comments, if there are comments', () => {
    return request(app).get('/api/articles/1/comments').expect(200).then(({body})=>{
      expect(body.comments.length).toBe(11)
    })
  });
  test('array should contain comment objects with correct properties', () => {
    return request(app).get('/api/articles/1/comments').expect(200).then(({body})=>{
      body.comments.forEach(comment=>{
      expect(typeof(comment.body)).toBe('string')
      expect(typeof(comment.author)).toBe('string')
      expect(typeof(comment.created_at)).toBe('string')
      expect(typeof(comment.votes)).toBe('number')
      expect(typeof(comment.comment_id)).toBe('number')
    })
    })
  });
  test('should return correct comment data', () => {
    return request(app).get('/api/articles/6/comments').expect(200).then(({body})=>{
      const comment = body.comments[0]
      expect(comment.body).toBe("This is a bad article name")
      expect(comment.votes).toBe(1)
      expect(comment.author).toBe('jonny')
    })
  });
  test("status 404 if no article found with requested id", () => {
    return request(app).get('/api/articles/100000/comments').expect(404).then(({body})=>{
      expect(body.msg).toBe('article not found')
    })
  });
  test("status 400 for invalid non numeric id", () => {
    return request(app).get('/api/articles/banana/comments').expect(400).then(({body})=>{
      expect(body.msg).toBe('invalid id')
    })
  });
  test('should give message for no comments', () => {
    return request(app).get('/api/articles/2/comments').expect(200).then(({body})=>{
      expect(body.msg).toBe('no comments')
      expect(body.comments.length).toBe(0)
    })
  });
})
describe('POST /api/articles/:article_id/comments',()=>{
  test('should return posted comment', () => {
    return request(app).post('/api/articles/1/comments').send({username:'butter_bridge',body:'THIS IS A NEW COMMENT'}).expect(201).then(({body})=>{
      const new_comment= body.new_comment 
      expect(typeof(new_comment.comment_id)).toBe('number')
      expect(typeof(new_comment.votes)).toBe('number')
      expect(typeof(new_comment.created_at)).toBe('string')
      expect(typeof(new_comment.author)).toBe('string')
      expect(new_comment.body).toBe('THIS IS A NEW COMMENT')
    })
  });
  test('should return authors name instead of username', () => {
    return request(app).post('/api/articles/2/comments').send({username:'butter_bridge',body:'THIS IS A NEW COMMENT'}).expect(201).then(({body})=>{
      const new_comment= body.new_comment 
      expect(new_comment.author).toBe('jonny')
    })
  });
  test('should update database', () => {
    return request(app).post('/api/articles/12/comments').send({username:'butter_bridge',body:'THIS IS A NEW COMMENT'}).expect(201).then(({body})=>{
      return request(app).get('/api/articles/12/comments')
    }).then(data=>{
      const comment= data.body.comments.at(-1)
      expect(comment.body).toBe('THIS IS A NEW COMMENT')
    })
  });
  test('status 400: missing username', () => {
    return request(app).post('/api/articles/2/comments').send({body:'THIS IS A NEW COMMENT'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test('status 400: missing body', () => {
    return request(app).post('/api/articles/2/comments').send({username:'butter_bridge'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test('status 400: username not found', () => {
    return request(app).post('/api/articles/2/comments').send({username:'efdsdfs',body:'THIS IS A NEW COMMENT'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test('status 400: invalid username', () => {
    return request(app).post('/api/articles/2/comments').send({username: 45,body:'THIS IS A NEW COMMENT'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('bad request')
    })
  });
  test("status 404 if no article found with requested id", () => {
    return request(app).post('/api/articles/100000/comments').send({username:'butter_bridge',body:'THIS IS A NEW COMMENT'}).expect(404).then(({body})=>{
      expect(body.msg).toBe('article not found')
    })
  });
  test("status 400 for invalid non numeric id", () => {
    return request(app).post('/api/articles/banana/comments').send({username:'butter_bridge',body:'THIS IS A NEW COMMENT'}).expect(400).then(({body})=>{
      expect(body.msg).toBe('invalid id')
    })
  });
})
describe('GET /api/articles ( sort by queries)',()=>{
  test('should take sort_by query and return articles in order, defaults to descending', () => {
      return request(app).get('/api/articles?sort_by=created_at').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('created_at',{descending:true})
      })
  });
  test('sort_by = title', () => {
      return request(app).get('/api/articles?sort_by=title').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('title',{descending:true})
      })
  });
  test('sort_by = article id', () => {
      return request(app).get('/api/articles?sort_by=article_id').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('article_id',{descending:true})
      })
  });
  test('sort_by = votes', () => {
      return request(app).get('/api/articles?sort_by=votes').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('votes',{descending:true})
      })
  });
  test('sort_by = comment_count', () => {
      return request(app).get('/api/articles?sort_by=comment_count').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('comment_count',{descending:true})
      })
  });
  test('sort_by = topic', () => {
      return request(app).get('/api/articles?sort_by=topic').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('topic',{descending:true})
      })
  });
  test('sort_by = author', () => {
      return request(app).get('/api/articles?sort_by=author').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('author',{descending:true})
      })
  });
  test('order query to decide order : ascending', () => {
      return request(app).get('/api/articles?sort_by=article_id&order=asc').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('article_id')
      })
    });
  test('order query to decide order : descending', () => {
      return request(app).get('/api/articles?sort_by=article_id&order=desc').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('article_id',{descending:true})
      })
    });
  test('sort_by should default to date', () => {
      return request(app).get('/api/articles?order=asc').expect(200).then(({body})=>{
        expect(body.articles).toBeSortedBy('created_at')
      })
    });
  test('400 invalid sort_by query', () => {
      return request(app).get('/api/articles?sort_by=banana').expect(400).then(({body})=>{
        expect(body.msg).toBe('bad request')
      })
    });
  test('400 invalid order query', () => {
      return request(app).get('/api/articles?order=banana').expect(400).then(({body})=>{
        expect(body.msg).toBe('bad request')
      })
    });
})
describe('GET /api/articles topics filter query',()=>{
  test('should filter results using topic query, topic = mitch', () => {
    return request(app).get('/api/articles?topic=mitch').expect(200).then(({body})=>{
      body.articles.forEach(article=>{
        expect(article.topic).toBe('mitch')
      })
      expect(body.articles.length).toBeGreaterThan(0)
    })
  });
  test('topic = cats', () => {
    return request(app).get('/api/articles?topic=cats').expect(200).then(({body})=>{
      body.articles.forEach(article=>{
        expect(article.topic).toBe('cats')
      })
      expect(body.articles.length).toBeGreaterThan(0)
    })
  });
  test('404 topic = nonsense', () => {
    return request(app).get('/api/articles?topic=nonsense').expect(404).then(({body})=>{
      expect(body.msg).toBe('articles not found')
    })
  });
})