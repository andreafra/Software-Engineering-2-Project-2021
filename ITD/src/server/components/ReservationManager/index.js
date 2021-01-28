const QueryManager = require("./../QueryManager/index")

exports.makeReservation = async (storeId, reservationId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	return (
		"R" +
		(await queryInterface.createUserReservation(
			storeId,
			reservationId,
			userId
		))
	)
}

exports.isTicketValid = async (storeId, ticketId) => {
	//TODO
	return true
}

exports.cancelReservation = async (storeId, ticketId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	queryInterface.cancelTicket(storeId, ticketId, userId)
}
