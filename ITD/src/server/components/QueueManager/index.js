const QueryManager = require("./../QueryManager/index")

exports.joinQueue = async (storeId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()
	return queryInterface.joinQueue(storeId, userId)
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
