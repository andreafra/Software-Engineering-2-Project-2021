const StoreSearch = require("./components/StoreSearch")
const AccountManager = require("./components/AccountManager")
const QueueManager = require("./components/QueueManager")
const ReservationManager = require("./components/ReservationManager")
const TicketManager = require("./components/TicketManager")

const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

app.get("/", (req, res) => {
	res.send("CLup API")
})

app.listen(port, () => {
	console.log(`CLup listening at http://localhost:${port}`)
})

app.use(express.json())
app.use(cors())

/* REST ENDPOINTS */
app.post("/api/auth/login", (req, res) => {
	let phoneNum = req.body.phoneNumber
	console.log(phoneNum)
	try {
		console.log(`/api/auth/login <-- phoneNum=${phoneNum}`)
		AccountManager.loginWithPhoneNumber(phoneNum)
		res.status(200).send("OK - phoneNumber received")
	} catch (err) {
		console.error(err)
		res.status(400).send("Format is invalid")
	}
})

app.post("/api/auth/code", async (req, res) => {
	let phoneNum = req.body.phoneNumber
	let SMSCode = req.body.SMSCode
	try {
		console.log(
			`/api/auth/code <-- phoneNum=${phoneNum}; SMSCode=${SMSCode}`
		)
		await AccountManager.verifyPhoneNumber(phoneNum, SMSCode)
		const authToken = await AccountManager.getAccountToken(phoneNum)
		res.status(200).send({
			authToken: authToken,
		})
	} catch (err) {
		console.error(err)
		res.status(400).send("Bad code")
	}
})

app.get("/api/search/:coordinates", async (req, res) => {
	let rawCoordinates = req.params.coordinates
	let [lat, long] = rawCoordinates.split("|")
	if (lat === undefined || long === undefined) {
		res.status(400).send("Bad request")
		return
	}

	lat = parseFloat(lat)
	long = parseFloat(long)

	try {
		let stores = await StoreSearch.getStores(lat, long)
		res.status(200).send(stores)
	} catch (err) {
		res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/queue/join", async (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken

	let userId
	try {
		userId = AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		let receipt = QueueManager.joinQueue(storeID, userId)
		res.status(200).send(receipt)
	} catch (err) {
		res.status(404).send("Store not found")
		// res.status(503).send("Failed to join the queue at this time. Try later.")
	}
})

app.post("/api/store/:storeId/queue/leave", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken
	let ticketId = req.body.queueReceiptId

	let userId
	try {
		userId = AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		QueueManager.cancelQueueTicket(storeId, ticketId, userId)
		res.status(200).send("OK")
	} catch (err) {
		res.status(404).send("Receipt not found")
	}
})

app.get("/api/store/:storeId/reservation/timeslots", async (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken

	try {
		AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		let reservations = {}
		reservations = await ReservationManager.getReservationData(storeId)
		res.status(200).send(reservations)
	} catch (err) {
		res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/reservation/book/:timeslotId", (req, res) => {
	let storeId = req.params.storeId
	let timeslotId = req.params.timeslotId
	let authToken = req.body.authToken

	let userId
	try {
		userId = AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		let receipt = {}
		receipt = ReservationManager.makeReservation(
			storeId,
			timeslotId,
			userId
		)
		res.status(200).send(receipt)
	} catch (err) {
		res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/reservation/cancel", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken
	let ticketId = req.body.reservationReceiptId

	let userId
	try {
		userId = AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		ReservationManager.cancelReservation(storeId, ticketId, userId)
		res.status(200).send(receipt)
	} catch (err) {
		res.status(404).send("Store/receipt not found")
	}
})

app.post("/api/store/<storeId>/ticket/verify", async (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken
	let ticketId = req.body.receiptId

	try {
		AccountManager.validateToken(authToken)
	} catch (e) {
		res.status(401).send("Invalid auth token")
		return
	}

	try {
		let isValid = false
		isValid = await TicketManager.checkTicket(storeId, ticketId)
		res.status(200).send({
			isTicketValid: isValid,
		})
	} catch (err) {
		res.status(404).send("Store/receipt not found")
	}
})
