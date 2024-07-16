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

describe("GET /api/", () => {
	it("status: 200, should respond with all the available endpoints of the API", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpoints);
			});
	});
});

describe("GET /api/topics", () => {
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

describe("GET /api/articles/:articles_id", () => {
	it("status: 200, should respond with the requested article", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(body).toMatchObject({
					article_id: expect.any(Number),
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					article_img_url: expect.any(String),
				});
			});
	});

	it("status: 400, should respond with a 400 message when passed an invalid ID", () => {
		return request(app)
			.get("/api/articles/thisisinvalid")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("not a valid article ID")
			})
	})

	it("status: 404, should respond with a 404 message when passed a valid but none existent article ID", () => {
		return request(app)
			.get("/api/articles/808")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no article found under article_id 808");
			});
	});
});

describe("GET /api/articles", () => {
	it("status: 200, should respond with all articles and their properties", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const bodyArray = body.articles;
				bodyArray.forEach((article) => {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});
				});
			});
	});
	it("status: 200, should not repsond with body property in any of the arrays", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const bodyArray = body.articles;
				bodyArray.forEach((article) => {
					expect(article).not.toHaveProperty("body");
				});
			});
	});
});
