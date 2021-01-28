const QueryManager = require("./../QueryManager/index")

exports.makeReservation = async (storeId, reservationId, userId) {
    const queryInterface = await QueryManager.getQueryInterface()

    return await queryInterface.createUserReservation(storeId, reservationId, userId)
}

exports.cancelReservation = async (storeId, ticketId, userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	queryInterface.cancelTicket(storeId, ticketId, userId)
}
