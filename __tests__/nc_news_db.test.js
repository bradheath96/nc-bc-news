const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");


beforeEach(() => {
	return seed(data);
});
afterAll(() => {
	if (db.end) db.end();
});

describe("All bad URLs", () => {
	it("ALL METHODS 404: Responds with an error for an endpoint not found", () => {
		return request(app)
			.get("/api/unuseable")
			.expect(404)
			.then(({ body }) => {
				const { message } = body;
				expect(message).toBe("endpoint not found");
			});
	});
});

describe("GET api/", () => {
	it("status: 200, should respond with all the available endpoints of the API", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpoints)
			})
	})
})

describe("GET api/topics", () => {
	it("status: 200, should respond with an array of topics", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const topicsArray = body;
				topicsArray.forEach((topic) => {
					expect(topic).toStrictEqual({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
