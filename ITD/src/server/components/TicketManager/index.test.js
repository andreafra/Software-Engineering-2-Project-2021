const ticketManager = require(".")
const queueManager = require("../QueueManager")
const queryManager = require("../QueryManager")

test("Check queue ticket", async () => {
	const queryInterface = await queryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		// create store
		const storeID = await queryInterface.createStore(
			"Polimi",
			"Piazza Leonardo 32",
			100,
			45.47862499832581,
			9.228432011185033
		)

		// create user
		await queryInterface.createUser("420", "Piano", "Forte")
		// add user to store queue
		let ticketID = await queueManager.joinQueue(storeID, 420)

		// check user is in queue
		let isValid = await ticketManager.checkTicket(storeID, ticketID)
		expect(isValid).toBe(true)

		// check non-existing user not to be in queue
		let notValid = await ticketManager.checkTicket(storeID, "Q9876")
		expect(notValid).toBe(false)
	})
})
