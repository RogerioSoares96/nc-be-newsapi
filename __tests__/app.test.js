const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');


beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("App", () => {
    describe("GET /api/topics", () => {
        it("Check if endpoint returns an array of topic objects", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toEqual(true);
                expect(typeof(response.body[0])).toEqual('object');
            });
        });
        it("Check if first object matches object in db", () => {
            return db.query(`SELECT * FROM topics;`).then((queryResult) => {
                const firstResult =  queryResult.rows[0]
                request(app)
                .get('/api/topics')
                .expect(200)
                .then((response) => {
                    expect(response.body.length).toEqual(3);
                    expect(response.body[0]).toEqual(firstResult);
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