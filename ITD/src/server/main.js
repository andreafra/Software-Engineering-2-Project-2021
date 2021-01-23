const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

app.get("/", (req, res) => {
	res.send("Hello World!")
})

// Example of REST API endpoint
app.get("/api/data", (req, res) => {
	// Send to the client a JSON object containing a message
	res.send({
		message: "Hello World!",
	})
})

app.listen(port, () => {
	console.log(`CLup listening at http://localhost:${port}`)
})

// Requires clients to use the following header
// "Content-Type": "application/x-www-form-urlencoded",
// app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

/* REST ENDPOINTS */
app.post("/api/auth/login", (req, res) => {
	let phoneNum = req.body.phoneNumber
	try {
		console.log(`/api/auth/login <-- phoneNum=${phoneNum}`)
		// AccountManager.loginWithPhoneNumber(phoneNum)
		res.status(200).send("OK - phoneNumber received")
	} catch (err) {
		res.status(400).send("Format is invalid")
	}
})

app.post("/api/auth/code", (req, res) => {
	let phoneNum = req.body.phoneNumber
	let SMSCode = req.body.SMSCode
	try {
		console.log(
			`/api/auth/code <-- phoneNum=${phoneNum}; SMSCode=${SMSCode}`
		)
		let authToken = null
		// authToken = AccountManager.verifyPhoneNumber(phoneNum, code)
		res.status(200).send({
			authToken: authToken,
		})
	} catch (err) {
		res.status(400).send("Bad code")
	}
})

app.get("/api/search/:coordinates", (req, res) => {
	let rawCoordinates = req.params.coordinates
	let [x, y] = rawCoordinates.split("|")
	try {
		let stores = {}
		// stores = StoreSearch.getStores({x: x, y: y}) // no filters
		res.status(200).send(stores)
	} catch (err) {
		res.status(400).send("Bad request")
		// res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/queue/join", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken

	try {
		let receipt = {}
		// receipt = QueueManager. joinQueue(storeID)
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

	try {
		// QueueManager.cancelQueueTicket(storeId, ticketID)
		res.status(200).send("OK")
	} catch (err) {
		res.status(404).send("Receipt not found")
	}
})

app.get("/api/store/:storeId/reservation/timeslots", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken

	try {
		let reservations = {}
		// reservations = ReservationManager.getReservationData(storeId)
		res.status(200).send(reservations)
	} catch (err) {
		res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/reservation/book/:timeslotId", (req, res) => {
	let storeId = req.params.storeId
	let timeslotId = req.params.timeslotId
	let authToken = req.body.authToken

	try {
		let receipt = {}
		// receipt = ReservationManager.makeReservation(storeId, timeslotId)
		res.status(200).send(receipt)
	} catch (err) {
		res.status(404).send("Store not found")
	}
})

app.post("/api/store/:storeId/reservation/cancel", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken
	let ticketId = req.body.reservationReceiptId

	try {
		// ReservationManager.cancelReservation(ticketId)
		res.status(200).send(receipt)
	} catch (err) {
		res.status(404).send("Store/receipt not found")
	}
})

app.post("/api/store/<storeId>/ticket/verify", (req, res) => {
	let storeId = req.params.storeId
	let authToken = req.body.authToken
	let ticketId = req.body.receiptId

	try {
		let isValid = false
		// isValid = TicketManager.cancelReservation(ticketId)
		res.status(200).send({
			isTicketValid: isValid,
		})
	} catch (err) {
		res.status(404).send("Store/receipt not found")
	}
})
