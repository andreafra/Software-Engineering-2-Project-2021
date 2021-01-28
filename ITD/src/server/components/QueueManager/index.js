const QueryManager = require("./../QueryManager/index")

exports.joinQueue = async (storeId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()
	// "Q" added to distinguish between Queue tickets and Reservation tickets
	let code = "Q" + (await queryInterface.joinQueue(storeId, userId))
	console.log("QueueManager: added " + code)

	return code
}

exports.isTicketValid = async (storeId, ticketId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	const firstTicket = await queueInterface.getFirstQueueTicket(storeId)

	if (firstTicket == ticketId) {
		const storeData = await queryInterface.getStoreFillLevel(storeId)
		const reservations = await queryInterface.getStoreNextReservations(
			storeId
		)

		if (storeData.curr_number + reservations < storeData.max_capacity) {
			return true
		}
	}

	return false
}

exports.cancelQueueTicket = async (storeId, ticketId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	queryInterface.cancelTicket(storeId, ticketId, userId)
}
