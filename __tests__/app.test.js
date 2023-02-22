const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');
const sorted = require('jest-sorted')


beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("App", () => {
    describe("GET /api/topics", () => {
        it("Check if endpoint returns an array of topic objects", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(response.body.topics).toBeInstanceOf(Array);
                expect(response.body.topics[0]).toEqual(expect.any(Object));
            });
        });
        it("Check if body array of object matches objects in test data and its format", () => {
            const testData = { topics : [
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
            ] };
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(response.body.topics).toHaveLength(3);
                expect(response.body).toEqual(expect.objectContaining(testData));
                response.body.topics.forEach((topicObj) => {
                    expect(topicObj).toMatchObject({
                    description : expect.any(String),
                    slug : expect.any(String) 
                    });
                });
            });
        });
    });
    describe("GET /api/articles", () => {
        it("Check if endpoint returns an array of articles objects", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeInstanceOf(Array);
                expect(response.body.articles[0]).toEqual(expect.any(Object));
            });
        });
        it("Check if body array of object matches objects in test data and its format", () => {
            const firstArticle =   {
                article_id : 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: 1594329060000,
                votes: 100,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 11
              }
            const createdAtString = new Date(firstArticle.created_at - 3600000);
            firstArticle.created_at = createdAtString.toISOString();
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toHaveLength(12);
                response.body.articles.forEach((articleObj) => {
                    if (articleObj.article_id === 1) expect(articleObj).toEqual(expect.objectContaining(firstArticle));
                    expect(articleObj).toMatchObject( {
                        article_id : expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                      }
                    );
                });
            });
        });
        it("Check if body array of objects are sorted by date and in descending order", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', { descending : true, });
            });
        });
    });
    describe("Endpoint Errors", () => {
        it("Check if wrong endpoint produces 404", () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
        });
    });
});