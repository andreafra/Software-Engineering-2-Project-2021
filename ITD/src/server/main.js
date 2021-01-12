const express = require("express")
const app = express()
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
