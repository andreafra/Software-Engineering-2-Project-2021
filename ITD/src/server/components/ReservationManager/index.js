const QueryManager = require("./../QueryManager/index")

/**
 * This method takes as input the identification number ofthe store
 * and of the timeslot. The ReservationManager will then contact the
 * QueryManager to in-sert the reservation into the system.
 *
 * @param {string} storeId
 * @param {string} reservationId
 * @param {string} userId
 * @returns the `ticketId` to be sent to the client
 */
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

/**
 * This method takes as input the identification number of the ticket
 * and the store.
 * It checks by contacting the QueryManager if the provided ticket is
 * valid for the selected store.
 *
 * @param {string} storeId
 * @param {string} ticketId
 * @returns whether the ticket is valid
 */
exports.isTicketValid = async (storeId, ticketId) => {
	//TODO
	return true
}

/**
 * This method takes as input the identification number of the ticket,
 * then it removes the associated reservation.
 * @param {string} storeId
 * @param {string} ticketId
 * @param {string} userId
 */
exports.cancelReservation = async (storeId, ticketId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	queryInterface.cancelTicket(storeId, ticketId, userId)
}
