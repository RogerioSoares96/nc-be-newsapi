const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');
const { string } = require('pg-format');


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
                const testDataExpectedOrder = [3, 6, 2, 12, 5, 1, 9, 10, 4, 8, 11, 7]
                const testDataActualOrder = body.articles.map(articleObj => articleObj.article_id)
                expect(testDataExpectedOrder).toEqual(testDataActualOrder); 
            });
        });
    });
    describe.only("GET /api/articles/:article_id", () => {
        it("Check if endpoint returns an single article object", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(expect.objectContaining({}));
            });
        });
        it("Check if returned single article object is correct and matches the corect format", () => {
            const firstArticle =   {
                article_id : 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                created_at: 1602828180000,
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
              }
            const createdAtUTCAdjustedString = new Date(firstArticle.created_at - 3600000);
            firstArticle.created_at = createdAtUTCAdjustedString.toISOString();
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject( {
                    article_id : expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                  }
                );
            });
        });
        it("Check if wrong type of data on the id produces a 400", () => {
            return request(app)
            .get('/api/articles/notANumber') //PSQL Error Code in the case of it not being a number.
            .expect(400)
        });
        //it.only("Check if not valid Id produces a 404", () => {
        //    return request(app)
        //    .get('/api/articles/1000000') //PSQL Check if id exist, if nothing comes back, custom error.
        //    .expect(404)
        //});
    });
    describe("Endpoint Errors", () => {
        it("Check if wrong endpoint produces 404", () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
        });
    });
});