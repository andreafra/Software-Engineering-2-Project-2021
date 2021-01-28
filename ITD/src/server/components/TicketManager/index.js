const ReservationManager = require("../ReservationManager")
const QueueManager = require("../QueueManager")

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
	//TODO: priority tickets? who handles them?
}
