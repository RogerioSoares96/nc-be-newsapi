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
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body[0]).toEqual(expect.any(Object));
            });
        });
        it("Check if first object matches object in db", () => {
            return db.query(`SELECT * FROM topics;`).then((queryResult) => {
                const firstResult =  queryResult.rows[0]
                request(app)
                .get('/api/topics')
                .expect(200)
                .then((response) => {
                    expect(response.body).toHaveLength(queryResult.rows.length);
                    expect(response.body).toEqual(expect.objectContaining(firstResult));
                    expect(response.body).toMatchObject({
                        description : expect.any(String),
                        slug : expect.any(String) 
                    })
                });
            })
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