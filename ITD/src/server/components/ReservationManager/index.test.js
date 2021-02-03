const ReservationManager = require(".")
const QueryManager = require("../QueryManager")

test("check acceptance if overfull", async () => {
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
		const reservationSlotId = await queryInterface.createReservationSlot(
			storeId,
			today.getDay(),
			time,
			10
		)

		await queryInterface.createUser("0000", "luigi", "fusco")
		await queryInterface.createUser("0001", "andrea", "franchini")

		const ticketId1 = await ReservationManager.makeReservation(
			storeId,
			reservationSlotId,
			"0000"
		)

		const ticketId2 = await ReservationManager.makeReservation(
			storeId,
			reservationSlotId,
			"0001"
		)

		const res1 = await ReservationManager.isTicketValid(
			storeId,
			ticketId1.substring(1)
		)

		expect(res1).toBe(true)

		const res2 = await ReservationManager.isTicketValid(
			storeId,
			ticketId2.substring(1)
		)

		expect(res2).toBe(false)
	})
})

test("check reservation info", async () => {
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

		const reservationSlotId = await queryInterface.createReservationSlot(
			storeId,
			today.getDay(),
			time,
			10
		)

		await queryInterface.createReservationSlot(
			storeId,
			today.getDay() + 1,
			time,
			10
		)

		await queryInterface.createUser("0000", "luigi", "fusco")
		await queryInterface.createUser("0001", "andrea", "franchini")

		const ticketId1 = await ReservationManager.makeReservation(
			storeId,
			reservationSlotId,
			"0000"
		)

		const ticketId2 = await ReservationManager.makeReservation(
			storeId,
			reservationSlotId,
			"0001"
		)

		console.log(await ReservationManager.getReservationData(storeId))
	})
})
