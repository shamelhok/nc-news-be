const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection')
const seed=require('../db/seeds/seed');

afterAll(() => {
    if (db.end)  return db.end();
  });
beforeEach(() => seed(testData));

xdescribe('POST /api/articles/:article_id/comments',()=>{
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