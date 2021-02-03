const QueryManager = require("./../QueryManager/index")
const utils = require("./../../utils")

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

	// TODO: clear old reservations
	//await queryInterface.clearOldReservations(userId)
	const hasReservation = await queryInterface.hasReservation(userId)

	if (hasReservation) throw "Already has reservation"

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
 * If the ticket is valid it is automatically used.
 *
 * @param {string} storeId
 * @param {string} ticketId
 * @returns whether the ticket is valid
 */
exports.isTicketValid = async (storeId, ticketId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	const ticketInfo = await queryInterface.getTicket(ticketId)
	const reservationInfo = await queryInterface.getReservation(
		ticketInfo.reservation_id
	)
	const storeInfo = await queryInterface.getStoreFillLevel(storeId)

	const today = new Date()

	const reservationTime = utils.timeToMinutes(reservationInfo.start_time)
	const todayTime = today.getHours() * 60 + today.getMinutes()

	if (
		storeInfo.curr_number < storeInfo.max_capacity &&
		reservationInfo.is_active &&
		reservationInfo.weekday === today.getDay() &&
		todayTime >= reservationTime &&
		todayTime <= reservationTime + 5 //margin of five minutes
	) {
		await queryInterface.useTicket(storeId, ticketId)
		return true
	}

	return false
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

	return await queryInterface.cancelTicket(storeId, ticketId, userId)
}

/**
 * This method takes as an input the store identification number and
 * contacts the QueryManager to get the reservation data on the specified
 * store id.
 * @param {string} storeId
 * @returns reservation data
 */
exports.getReservationData = async (storeId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	const data = await queryInterface.getReservationData(storeId)
	for (let i = 0; i < data.length; ++i)
		data[i].crowdness = Math.floor(
			(data[i].count * 3) / data[i].max_people_allowed
		)

	return data
}
