import React, { useState } from "react"

const FAKE_STORE = {
	id: "store-1",
	name: "Store 1",
	address: "Via Milano 16",
	open: true,
	distance: "0.6km",
	freeTimeslots: 12,
	queueLength: 15,
	queueWaitTime: "03:34:00",
}

export default function StoreDetailView() {
	const [store, setStore] = useState(FAKE_STORE)

	return (
		<div className="columns">
			<div className="column is-8 is-offset-2">
				<div className="section">
					<p className="title">{store.name}</p>
					<p className="subtitle">
						<i>{store.address}</i>
					</p>
					<div className="block">
						<div className="columns is-mobile">
							<div className="column is-half">
								<div className="box has-text-centered">
									<b>Queue</b>
									<hr />
									<b className="is-size-3">
										{store.queueLength}
									</b>
									<br />
									people in queue
									<hr />
									Estimated wait: <b>{store.queueWaitTime}</b>
								</div>
							</div>
							<div className="column is-half">
								<div className="box has-text-centered">
									<b>Reservations</b>
									<hr />
									<b className="is-size-3">
										{store.freeTimeslots}
									</b>
									<br />
									free timeslots
								</div>
							</div>
						</div>
					</div>

					<div></div>
				</div>
			</div>
		</div>
	)
}
