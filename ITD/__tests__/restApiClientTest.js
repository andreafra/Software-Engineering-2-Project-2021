const supertest = require("supertest")
const app = require("../src/server/main")
const request = supertest(app)

describe("GET /", () => {
	it("responds with greeting", async (done) => {
		const res = await request.get("/")
		expect(res.status).toBe(200)

		done()
	})
})
