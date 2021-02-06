const supertest = require("supertest")
const app = require("../src/server/main")
const request = supertest(app)
const QueryManager = require("./../src/server/components/QueryManager")

describe("GET /", () => {
	it("responds with greeting", async (done) => {
		const res = await request.get("/")
		expect(res.status).toBe(200)

		done()
	})
})

test("user creation", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const number = "+393925555050"

		const res = await request
			.post("/api/auth/login")
			.send({ phoneNumber: number })
			.set("Content-Type", "application/json")

		const smsToken = await queryInterface.getVerificationCode(number)

		await request
			.post("/api/auth/code")
			.send({ SMSCode: smsToken, phoneNumber: number })
			.set("Content-Type", "application/json")
			.expect(200)
	})
})

test("ticket deletion", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const storeId = await queryInterface.createStore(
			"esselunga",
			"via zurigo 14",
			1,
			0,
			0
		)

		const number = "+393925555050"

		let res = await request
			.post("/api/auth/login")
			.send({ phoneNumber: number })
			.set("Content-Type", "application/json")

		const smsToken = await queryInterface.getVerificationCode(number)

		res = await request
			.post("/api/auth/code")
			.send({ SMSCode: smsToken, phoneNumber: number })
			.set("Content-Type", "application/json")

		const authToken = res.body.authToken

		res = await request
			.get("/api/search/0|0")
			.set("X-Auth-Token", authToken)

		expect(res.body[0].id).toBe(storeId)

		res = await request
			.post(`/api/store/${storeId}/queue/join`)
			.set("X-Auth-Token", authToken)
			.expect(200)

		const ticket = res.body.receiptId

		res = await request
			.post(`/api/store/${storeId}/queue/join`)
			.set("X-Auth-Token", authToken)
			.expect(404)

		res = await request
			.post(`/api/store/${storeId}/queue/leave`)
			.set("X-Auth-Token", authToken)
			.send({ queueReceiptId: ticket.substring(1) })
			.set("Content-Type", "application/json")
			.expect(200)

		res = await request
			.get("/api/user/ticket")
			.set("X-Auth-Token", authToken)
			.expect(404)
	})
})
