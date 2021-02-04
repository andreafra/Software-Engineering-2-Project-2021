const ReservationManager = require("../ReservationManager")
const QueueManager = require("../QueueManager")
const QueryManager = require("../QueryManager")

/**
 * This method takes as input the identification number of the ticket.
 * It contacts the corresponding component (ReservationManager or QueueManager)
 * to get the informations regarding the validity of the presented ticket.
 *
 * @param {string} storeId
 * @param {string} ticketCode
 * @returns whether the ticket is valid
 */
exports.checkTicket = async (storeId, ticketCode) => {
	if (ticketCode.charAt(0) == "Q")
		return await QueueManager.isTicketValid(
			storeId,
			ticketCode.substring(1)
		)
	else if (ticketCode.charAt(0) == "R")
		return await ReservationManager.isTicketValid(
			storeId,
			ticketCode.substring(1)
		)
	//else
	//TODO: priority tickets? who handles them? needed?
}

/**
 * This method returns the most recent active ticket associated with a certain user.
 *
 * @param {string} userId
 * @returns the ticket object
 */
exports.getTicket = async (userId) => {
	const queryInterface = await QueryManager.getQueryInterface()

	let res = await queryInterface.getActiveTicketFromUser(userId)
	if (res) return res
	else throw new Error("No tickets found!")
}
