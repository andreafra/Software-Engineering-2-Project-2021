import React, { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { Link } from "react-router-dom"
import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"
import { Redirect } from "react-router-dom"

const FAKE_TICKETS = [
	{ receiptId: "QROGUOHRYMM", time: "2011-10-05T14:48:00.000Z" },
]
export default function TicketListView() {
	const [tickets, setTickets] = useState([])

	useEffect(async () => {
		const authToken = cookie.load("authToken")
		// Fetch store list from server
		let res = await fetch(API_BASE_URL + "user/" + "ticket", {
			method: "GET",
			headers: {
				// Don't forget to pass authorization token in the header
				"X-Auth-Token": authToken,
			},
		})
		let data = await res.json()
		console.log(data)
		setTickets([data])
	}, []) // Passing [] as second parameter makes the first callback run once when the component mounts.

	/**
	 * Renders the list of tickets belonging to that user.
	 * @returns JSX elements
	 */
	const _showTickets = () => {
		return tickets.map((t) => {
			let isQueue = t.type === "queue"

			return (
				<div className="card">
					<div className="card-content">
						<div className="content has-text-centered">
							<QRCode value={t.id} />
							<p className="title">{t.id}</p>
							<p className="subtitle">
								<b>Id store: </b> {t.store_id}
							</p>
							<p className="subtitle">
								<b>Type </b> {isQueue ? "Queue" : "Reservation"}
							</p>
							<p className="is-size-5">
								Creation time: {t.creation_date}
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

	const _deleteTicket = async () => {
		let ticket = tickets[0]
		const auth = cookie.load("authToken")
		if (ticket.type == "reservation") {
			const res = await fetch(
				API_BASE_URL +
					"store/" +
					ticket.store_id +
					"/reservation/cancel",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						authToken: auth,
						storeId: ticket.store_id,
						reservationReceiptId: ticket.id,
					}),
				}
			)
		} else {
			const res = await fetch(
				API_BASE_URL +
					"store/" +
					ticket.store_id +
					"/reservation/cancel",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						authToken: auth,
						storeId: ticket.store_id,
						reservationReceiptId: ticket.id,
					}),
				}
			)
		}
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
