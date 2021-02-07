const { query } = require("express")
const supertest = require("supertest")
const app = require("../src/server/main")
const request = supertest(app)
const QueryManager = require("./../src/server/components/QueryManager")
const MockDate = require("mockdate")

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

test("ticket deletion and duplication", async () => {
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

test("access not granted due to reservation", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const storeId = await queryInterface.createStore(
			"esselunga",
			"via zurigo 14",
			2,
			0,
			0
		)

		const today = new Date()

		await queryInterface.createReservationSlot(
			storeId,
			today.getDay(),
			`${today.getHours() + 1}:${today.getMinutes()}`,
			1
		)

		await queryInterface.createUser("totem", "Totemo", "De Totemis", true)
		const totemToken = await queryInterface.createUserToken("totem")

		const number1 = "+393925555050"
		const number2 = "+393399957698"

		let res = await request
			.post("/api/auth/login")
			.send({ phoneNumber: number1 })
			.set("Content-Type", "application/json")

		let smsToken = await queryInterface.getVerificationCode(number1)

		res = await request
			.post("/api/auth/code")
			.send({ SMSCode: smsToken, phoneNumber: number1 })
			.set("Content-Type", "application/json")

		let authToken1 = res.body.authToken

		res = await request
			.post("/api/auth/login")
			.send({ phoneNumber: number2 })
			.set("Content-Type", "application/json")

		smsToken = await queryInterface.getVerificationCode(number2)

		res = await request
			.post("/api/auth/code")
			.send({ SMSCode: smsToken, phoneNumber: number2 })
			.set("Content-Type", "application/json")

		let authToken2 = res.body.authToken

		res = await request
			.post(`/api/store/${storeId}/queue/join`)
			.set("X-Auth-Token", authToken1)
			.expect(200)

		const ticket1 = res.body.receiptId

		res = await request
			.post(`/api/store/${storeId}/queue/join`)
			.set("X-Auth-Token", authToken2)
			.expect(200)

		const ticket2 = res.body.receiptId

		res = await request
			.post(`/api/store/${storeId}/ticket/verify`)
			.set("X-Auth-Token", totemToken)
			.send({ receiptId: ticket1 })
			.set("Content-Type", "application/json")
			.expect(200)

		expect(res.body.isTicketValid).toBe(true)

		res = await request
			.post(`/api/store/${storeId}/ticket/verify`)
			.set("X-Auth-Token", totemToken)
			.send({ receiptId: ticket2 })
			.set("Content-Type", "application/json")
			.expect(200)

		expect(res.body.isTicketValid).toBe(false)
	})
})

test("make and use reservations", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const storeId = await queryInterface.createStore(
			"esselunga",
			"via zurigo 14",
			10,
			0,
			0
		)

		const today = new Date()

		const timeslotId = await queryInterface.createReservationSlot(
			storeId,
			today.getDay(),
			`${today.getHours() + 1}:${today.getMinutes()}`,
			2
		)

		await queryInterface.createUser("totem", "Totemo", "De Totemis", true)
		const totemToken = await queryInterface.createUserToken("totem")

		await queryInterface.createUser("user", "", "")
		const token = await queryInterface.createUserToken("user")
		await queryInterface.createUser("second", "", "")
		const tokenSecond = await queryInterface.createUserToken("second")

		res = await request
			.post(`/api/store/${storeId}/reservation/book/${timeslotId}`)
			.set("X-Auth-Token", token)
			.expect(200)

		const ticket = res.body.receiptId

		res = await request
			.post(`/api/store/${storeId}/reservation/book/${timeslotId}`)
			.set("X-Auth-Token", tokenSecond)
			.expect(200)

		const ticketSecond = res.body.receiptId

		res = await request
			.post(`/api/store/${storeId}/ticket/verify`)
			.set("X-Auth-Token", totemToken)
			.send({ receiptId: ticket })
			.set("Content-Type", "application/json")
			.expect(200)

		expect(res.body.isTicketValid).toBe(false)

		MockDate.set(today.getTime() + 60 * 60 * 1000)

		res = await request
			.post(`/api/store/${storeId}/ticket/verify`)
			.set("X-Auth-Token", totemToken)
			.send({ receiptId: ticket })
			.set("Content-Type", "application/json")
			.expect(200)

		expect(res.body.isTicketValid).toBe(true)

		MockDate.set(today.getTime() + 66 * 60 * 1000)

		res = await request
			.post(`/api/store/${storeId}/ticket/verify`)
			.set("X-Auth-Token", totemToken)
			.send({ receiptId: ticketSecond })
			.set("Content-Type", "application/json")
			.expect(200)

		expect(res.body.isTicketValid).toBe(false)
	})
})
