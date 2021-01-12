import React, { useState } from "react"

function App() {
	const [fetchedData, setFetchedData] = useState("")

	fetch("http://localhost:8080/api/data", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((json) => {
			setFetchedData(json.message)
		})
		.catch((error) => {
			console.error(error)
		})

	return (
		<div>
			<h1>CLup</h1>
			<p>We're fetching data from the server!</p>
			<p>Result: {fetchedData}</p>
		</div>
	)
}

export default App
