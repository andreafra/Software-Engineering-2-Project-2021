const QueueManager = require(".")
const QueryManager = require("../QueryManager")

test("Only one ticket valid in the queue at a time", async () => {
	const queryInterface = await QueryManager.getQueryInterface()

	await queryInterface.executeAndRollback(async () => {
		const today = new Date()
		const time = "" + today.getHours() + ":" + today.getMinutes()
		const storeId = await queryInterface.createStore(
			"esselunga",
			"via zurigo 14",
			1,
			0,
			0
		)

		await queryInterface.createUser("0000", "luigi", "fusco")
		await queryInterface.createUser("0001", "andrea", "franchini")

		ticketId1 = await QueueManager.joinQueue(storeId, "0000")
		const res1 = await QueueManager.isTicketValid(
			storeId,
			ticketId1.substring(1)
		)

		expect(res1).toBe(true)

		ticketId2 = await QueueManager.joinQueue(storeId, "0001")
		const res2 = await QueueManager.isTicketValid(
			storeId,
			ticketId2.substring(1)
		)
		
		expect(res2).toBe(false)
	})
})
