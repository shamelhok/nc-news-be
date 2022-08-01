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

})