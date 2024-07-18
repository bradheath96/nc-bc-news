const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");
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
				expect(body.endpoints).toEqual(endpoints);
			});
	});
});

describe("GET /api/articles", () => {
	it("status: 200, should respond with all articles and their properties", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const articlesArray = body.articles;
				articlesArray.forEach((article) => {
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

	it("status; 200, should respond with all articles in descending order by date", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const articlesArray = body.articles;
				expect(articlesArray).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
});

describe("GET /api/topics", () => {
	it("status: 200, should respond with an array of topics", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const topicsArray = body.topics;
				topicsArray.forEach((topic) => {
					expect(topic).toStrictEqual({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});

describe("GET /api/users", () => {
	it("status: 200, should respond with an array of users", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const usersArray = body.users;
				usersArray.forEach((user) => {
					expect(user).toStrictEqual({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
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

	it("status: 400, should respond with a 400 message when passed an invalid article_id", () => {
		return request(app)
			.get("/api/articles/thisisinvalid")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("not a valid article ID");
			});
	});

	it("status: 404, should respond with a 404 message when passed a valid but none existent article_id", () => {
		return request(app)
			.get("/api/articles/808")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no article found under article_id 808");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	it("status: 200, should successfully increment the vote count", () => {
		const input = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article).toHaveProperty("votes", 101);
			});
	});

	it("status: 200, should successfully decrease the vote count", () => {
		const input = { inc_votes: -10 };
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article).toHaveProperty("votes", 90);
			});
	});

	it("status: 200, vote remains unchanged when increment counter is 0", () => {
		const input = { inc_votes: 0 };
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article).toHaveProperty("votes", 100);
			});
	});

	it("status: 400, should respond with an error for non-numeric article ID", () => {
		const input = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/not-a-number")
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid article ID");
			});
	});

	it("status: 404, should respond with an error for non-existent article ID", () => {
		const input = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/1010")
			.send(input)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no article found under article_id 1010");
			});
	});

	it("status: 400, should respond with an error for missing inc_votes property", () => {
		const input = {};
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Missing required field: inc_votes");
			});
	});

	it("status: 400, should respond with an error for non-numeric inc_votes value", () => {
		const input = { inc_votes: "not a number" };
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid value for inc_votes");
			});
	});

	it("status: 400, should respond with an error for inc_votes being undefined", () => {
		const input = { inc_votes: undefined };
		return request(app)
			.patch("/api/articles/1")
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Missing required field: inc_votes");
			});
	});
});

describe("GET /api/articles/:articles_id/comments", () => {
	it("status: 200, should respond with an array of comments from the given article_id", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				const commentsArray = body.comments;
				commentsArray.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: expect.any(Number),
					});
				});
			});
	});

	it("status: 200, should respond with an empty array when the article has no comments", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toEqual([]);
			});
	});

	it("status; 200, should respond with all articles in descending order by date", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const articlesArray = body.articles;
				expect(articlesArray).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});

	it("status: 400, should respond with a 400 message when passed an invalid article_id", () => {
		return request(app)
			.get("/api/articles/thisisinvalid/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("not a valid article ID");
			});
	});

	it("status: 404, should respond with a 404 message when passed a valid but none existent article_id", () => {
		return request(app)
			.get("/api/articles/808/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no article found under article_id 808");
			});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	it("status: 201, should respond with the posted comment", () => {
		const newComment = {
			username: "rogersop",
			body: "This is a test comment lol",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				const returnedComment = body;
				expect(returnedComment).toMatchObject({
					comment_id: expect.any(Number),
					author: "rogersop",
					body: "This is a test comment lol",
				});
			});
	});

	it("status: 400, should respond with a 400 message when passed an invalid article_id", () => {
		const newComment = {
			username: "bradheath96",
			body: "this is a test comment lol",
		};
		return request(app)
			.post("/api/articles/invalid_id/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("not a valid article ID");
			});
	});

	it("status: 404, should respond with a 404 message when no article found for valid article_id", () => {
		const newComment = {
			username: "bradheath96",
			body: "this is a test comment lol",
		};
		return request(app)
			.post("/api/articles/8080/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no article found for article_id 8080");
			});
	});

	it("status: 400, should respond with a 400 message when missing a username", () => {
		const newComment = {
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("missing required fields: username and body");
			});
	});

	it("status: 400, should respond with a 400 message when missing a body", () => {
		const newComment = {
			username: "bradheath96",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("missing required fields: username and body");
			});
	});

	it("status: 400, should respond with a 400 message when username is empty", () => {
		const newComment = {
			username: "",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("missing required fields: username and body");
			});
	});

	it("status: 400, should respond with a 400 message when body is empty", () => {
		const newComment = {
			username: "bradheath96",
			body: "",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("missing required fields: username and body");
			});
	});
});

describe("DELETE /api/comments", () => {
	it("status: 204, should successfully delete a comment", async () => {
		await request(app).delete("/api/comments/1").expect(204);

		const deletedComment = await db.query(
			`SELECT * FROM comments WHERE comment_id = 1`
		);
		expect(deletedComment.rows.length).toBe(0);
	});

	it("status: 400, should return an arror for an invalid comment ID", () => {
		return request(app)
			.delete("/api/comments/thisisbad")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid comment ID");
			});
	});

	it("status: 404, should return an error for a comment ID that doesn't exist", () => {
		return request(app)
			.delete("/api/comments/8080")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("no comment found under comment_id 8080");
			});
	});
});
