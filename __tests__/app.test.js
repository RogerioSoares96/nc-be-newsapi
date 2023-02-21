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
        it("Check if first object matches object in db", () => {
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
    describe("Endpoint Errors", () => {
        it("Check if wrong endpoint produces 404", () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
        });
    });
});