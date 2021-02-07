const queryManager = require(".")

test("check if user is created", async () => {
	const queryInterface = await queryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		await queryInterface.createUser("0000", "Luigi", "Fusco")

		var isPresent

		isPresent = await queryInterface.checkIfPhoneNumberIsPresent("0000")
		expect(isPresent).toBe(true)

		isPresent = await queryInterface.checkIfPhoneNumberIsPresent("1111")
		expect(isPresent).toBe(false)
	})
})

test("ticket functionalities", async () => {
	const queryInterface = await queryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		await queryInterface.createUser("0000", "Luigi", "Fusco")
		let storeID = await queryInterface.createStore(
			"Polimi",
			"Piazza Leonardo 32",
			100,
			45.47862499832581,
			9.228432011185033
		)

		let ticketID

		ticketID = await queryInterface.addUserToQueue("0000", storeID)
		expect(ticketID >= 1).toBe(true)

		let first = await queryInterface.getFirstQueueTicket(storeID)
		expect(first.id).toBe(ticketID)

		first = await queryInterface.getActiveTicketFromUser("0000")
		expect(first.id).toBe(ticketID)

		await queryInterface.cancelTicket(storeID, ticketID, "0000")
		let cancelled = await queryInterface.getFirstQueueTicket(storeID)
		expect(cancelled).toBe(undefined)

		let deletedTicket = await queryInterface.getTicket(ticketID)
		expect(deletedTicket.status).toBe("cancelled")

		first = await queryInterface.getActiveTicketFromUser("0000")
		expect(first).toBe(undefined)
	})
})

test("reservation functionalities", async () => {
	const queryInterface = await queryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		await queryInterface.createUser("0000", "Luigi", "Fusco")
		let storeID = await queryInterface.createStore(
			"Polimi",
			"Piazza Leonardo 32",
			100,
			45.47862499832581,
			9.228432011185033
		)

		const today = new Date()

		let reservationID = await queryInterface.createReservationSlot(
			storeID,
			today.getDay(),
			`${today.getHours()}:${today.getMinutes() + 1}`,
			10
		)

		let ticketID

		ticketID = await queryInterface.createUserReservation(
			storeID,
			reservationID,
			"0000",
			today
		)

		expect(ticketID >= 1).toBe(true)

		let has = await queryInterface.hasReservation("0000")
		expect(has.id).toBe(ticketID)
	})
})
