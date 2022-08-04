const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection')
const seed=require('../db/seeds/seed');

afterAll(() => {
    if (db.end)  return db.end();
  });
beforeEach(() => seed(testData));

xdescribe('GET /api/articles sort_by and order queries',()=>{
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
xdescribe('GET /api/articles topics filter query',()=>{
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