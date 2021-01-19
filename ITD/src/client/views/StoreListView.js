import React, { useState } from "react"

export default function StoreListView() {
	const [stores, setStores] = useState([])

	return (
		<div className="column">
			<h1 className="title">Store List</h1>
			<div className="storeList"></div>
			<div className="storeMap"></div>
		</div>
	)
}
