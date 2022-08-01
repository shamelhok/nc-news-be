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