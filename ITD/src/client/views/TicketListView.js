import React, { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { Link } from "react-router-dom"
import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"
import ErrorMsg from "../components/ErrorMsg"

export default function TicketListView() {
	const [tickets, setTickets] = useState([])
	const [errorMsg, setErrorMsg] = useState("")

	useEffect(async () => {
		const authToken = cookie.load("authToken")
		// Fetch store list from server
		let res = await fetch(API_BASE_URL + "user/ticket", {
			method: "GET",
			headers: {
				// Don't forget to pass authorization token in the header
				"X-Auth-Token": authToken,
			},
		})

		if (res.status === 200) {
			let data = await res.json()
			setTickets([data])
			// Cache the fact that user has a ticket
			// This causes users to be redirected to this page as long as
			// they have a valid ticket.
			cookie.save("user_has_tickets", true, { path: "/" })
		} else {
			setErrorMsg(await res.text())
		}
	}, []) // Passing [] as second parameter makes the first callback run once when the component mounts.

	/**
	 * Renders the list of tickets belonging to that user.
	 * @returns JSX elements
	 */
	const _showTickets = () => {
		return tickets.map((t) => {
			let isQueue = t.type === "queue"

			return (
				<div className="card" key={t.id}>
					<div className="card-content">
						<div className="content has-text-centered">
							<QRCode value={String(t.id)} />
							<p className="title">#{t.id}</p>
							<p className="subtitle">
								<b>Id store: </b> {String(t.store_id)}
							</p>
							<p className="subtitle">
								<b>Type </b> {isQueue ? "Queue" : "Reservation"}
							</p>
							<p className="is-size-5">
								<b>Creation time: </b>{" "}
								{new Date(t.creation_date).toLocaleDateString()}
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
		const authToken = cookie.load("authToken")

		if (ticket.type == "reservation") {
			// Delete reservation
			const res = await fetch(
				API_BASE_URL +
					"store/" +
					ticket.store_id +
					"/reservation/cancel",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Auth-Token": authToken,
					},
					body: JSON.stringify({
						reservationReceiptId: ticket.id,
					}),
				}
			)

			if (res !== 200) {
				setErrorMsg(await res.text())
			} else {
				cookie.save("user_has_tickets", false, { path: "/" })
			}
		} else {
			// Exit queue
			const res = await fetch(
				API_BASE_URL + "store/" + ticket.store_id + "/queue/leave",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Auth-Token": authToken,
					},
					body: JSON.stringify({
						queueReceiptId: ticket.id,
					}),
				}
			)
			if (res !== 200) {
				setErrorMsg(await res.text())
			} else {
				cookie.save("user_has_tickets", false, { path: "/" })
			}
		}
	}

	// DEBUG/DEMO utility:
	const _clearCookies = () => {
		cookie.remove("authToken")
		cookie.remove("user_has_tickets")
		window.location.reload()
	}

	const _clearTickets = () => {
		cookie.remove("user_has_tickets")
		window.location.reload()
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
					<div className="block">
						<ErrorMsg message={errorMsg} />
					</div>
					<div className="block">{_showTickets()}</div>
				</div>
				<div className="footer has-background-white">
					<a onClick={_clearCookies}>Clear Cookies</a>
					<br />
					<a onClick={_clearTickets}>Clear Tickets</a>
				</div>
			</div>
		</div>
	)
}
