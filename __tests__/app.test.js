const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection')
const seed=require('../db/seeds/seed')

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
                expect(body.topics).toEqual(expected)
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
  test('should update the article', () => {
    return request(app).patch('/api/articles/2')
    .send({inc_votes:10}).expect(200).then(({body})=>{
      expect(body.article.votes).toEqual(10)
    })
  });
  test('should update the article', () => {
    return request(app).patch('/api/articles/1')
    .send({inc_votes:-10}).expect(200).then(({body})=>{
      expect(body.article.votes).toEqual(90)
    })
  });
  test("status 404 for non existent article", () => {
    return request(app).patch('/api/articles/100000').send({inc_votes:10}).expect(404).then(({body})=>{
      expect(body.msg).toBe('article not found')
    })
  });
  test("status 400 for bad request: boody doesnt have inc_votes property", () => {
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