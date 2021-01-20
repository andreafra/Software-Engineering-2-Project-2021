import React, { useState } from "react"
import StoreMap from "../components/StoreMap"
import { Link } from "react-router-dom"
// DEBUG
const FAKE_STORES = [
	{
		id: "store-1",
		name: "Store 1",
		address: "Via Milano 16",
		open: true,
		distance: "0.6km",
		freeTimeslots: 12,
		queueLength: 15,
		queueWaitTime: "03:34:00",
	},
	{
		id: "store-2",
		name: "Store 2",
		address: "Corso Roma 4",
		open: false,
		distance: "0.3km",
		freeTimeslots: 5,
		queueLength: 3,
		queueWaitTime: "00:15:00",
	},
	{
		id: "store-3",
		name: "Store 3",
		address: "Piazza Leonardo da Vinci",
		open: true,
		distance: "0.1km",
		freeTimeslots: 23,
		queueLength: 999,
		queueWaitTime: "08:44:00",
	},
]

export default function StoreListView() {
	const [stores, setStores] = useState(FAKE_STORES)

	const _listStores = () => {
		return stores.map((store) => (
			<li className="card mb-5" key={store.id}>
				<div className="card-header has-background-primary">
					<h3 className="card-header-title is-centered">
						{store.name}
					</h3>
				</div>
				<div className="card-content">
					<div className="content">
						<p>
							<b>Address </b>
							{store.address}
						</p>
						<p>
							<b>Distance </b>
							{store.distance}
						</p>
						<p>
							<b>Open </b>
							{store.open ? "Yes" : "No"}
						</p>
					</div>
				</div>
				<div className="card-footer">
					<Link
						className="card-footer-item"
						to={"/stores/" + store.id}
					>
						<b>Details</b>
					</Link>
				</div>
			</li>
		))
	}

	return (
		<div className="columns is-gapless">
			<div className="column is-one-third store-list">
				<div className="p-5">
					<ul>{_listStores()}</ul>
				</div>
			</div>
			<div className="column is-two-thirds">
				<StoreMap />
			</div>
		</div>
	)
}
