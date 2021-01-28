const ticketManager = require(".")
const queueManager = require("../QueueManager")
const queryManager = require("../QueryManager")

test("Check queue ticket", async () => {
	const queryInterface = await queryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		await queryInterface.createUser("420", "Piano", "Forte")
		let ticketID = await queueManager.joinQueue(1, 420)
		console.log("Generated ticket: " + ticketID)

		let isValid = await ticketManager.checkTicket(1, ticketID)
		expect(isValid).toBe(true)

		let notValid = await ticketManager.checkTicket(1, "Q9876")
		expect(notValid).toBe(false)
	})
})
