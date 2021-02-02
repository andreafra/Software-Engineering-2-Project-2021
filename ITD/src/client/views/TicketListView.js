import React, { useState } from "react"
import QRCode from "react-qr-code"
import { Link } from "react-router-dom"

const FAKE_TICKETS = [
	{ receiptId: "QROGUOHRYMM", time: "2011-10-05T14:48:00.000Z" },
]
export default function TicketListView() {
	const [tickets, setTickets] = useState(FAKE_TICKETS)

	// TODO: fetch data from server

	/**
	 * Renders the list of tickets belonging to that user.
	 * @returns JSX elements
	 */
	const _showTickets = () => {
		return tickets.map((t) => {
			let isQueue = t.receiptId[0] === "Q"

			return (
				<div className="card">
					<div className="card-content">
						<div className="content has-text-centered">
							<QRCode value={t.receiptId} />
							<p className="title">{t.receiptId}</p>
							<p className="subtitle">
								<b>Type </b> {isQueue ? "Queue" : "Reservation"}
							</p>
							<p className="is-size-5">
								You'll enter at: {t.time}
							</p>
						</div>
					</div>
					<footer className="card-footer">
						<p className="card-footer-item">
							<button
								className="button is-danger is-rounded"
								onClick={_deleteTicket}
							>
								{isQueue ? "Exit Queue" : "Delete Reservation"}
							</button>
						</p>
					</footer>
				</div>
			)
		})
	}

	const _deleteTicket = () => {
		// TODO: Cancel reservation/queue
	}

	return (
		<div className="columns">
			<div className="column is-8 is-offset-2">
				<div className="section">
					<div className="level">
						<div className="level-left is-align-items-baseline">
							<p className="is-size-3 has-text-weight-bold mr-3">
								Tickets
							</p>
						</div>
						<div className="level-right">
							<Link
								to="/stores"
								className="button is-light is-primary"
							>
								Back
							</Link>
						</div>
					</div>
					<div className="block">{_showTickets()}</div>
				</div>
			</div>
		</div>
	)
}
