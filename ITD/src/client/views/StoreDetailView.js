import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"
import { Redirect } from "react-router-dom"
import ErrorMsg from "../components/ErrorMsg"
import checkForExistingTicket from "../components/TicketCache"

export default function StoreDetailView() {
	// storeId
	const storeId = useParams().id
	const stores_list = cookie.load("stores_list")
	const [store, setStore] = useState([])
	const [isTicketReceived, setIsTicketReceived] = useState(false)
	const [errorMsg, setErrorMsg] = useState("")
	const authToken = cookie.load("authToken")
	const history = useHistory()

	useEffect(async () => {
		// Fetch store list from server
		let res = await fetch(API_BASE_URL + "store/" + storeId, {
			method: "GET",
			headers: {
				// Don't forget to pass authorization token in the header
				"X-Auth-Token": authToken,
			},
		})
		if (res.status === 200) {
			let data = await res.json()
			setStore(data)
		} else if (res.status === 404) {
			setErrorMsg("Error: store not found")
		} else if (res.status === 401) {
			console.error("Expired token!")
			cookie.remove("authToken")
			history.push("/login")
		} else {
			setErrorMsg("We couldn't fetch the store details")
		}

		// Redirect if we have tickets
		await checkForExistingTicket(history)
	}, []) // Passing [] as second parameter makes the first callback run once when the component mounts.

	const waitTime = new Date(store.queueWaitTime)
	const waitHours = waitTime.getHours()
	const waitMinutes = waitTime.getMinutes()

	/**
	 * Called when the user click on the "Queue Now" button.
	 */
	const _handleJoinQueue = async () => {
		const authToken = cookie.load("authToken")

		const res = await fetch(
			API_BASE_URL + "store/" + storeId + "/queue/join",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth-Token": authToken,
				},
				body: JSON.stringify({
					storeId: storeId,
				}),
			}
		)

		if (res.status === 200) {
			let data = await res.json()

			// Cache last ticket
			// Swap with local storage for more stable persistence
			cookie.save("ticketId", data.receiptId, { path: "/" })

			setIsTicketReceived(true)
			console.log(data)
		} else if (res.status === 401) {
			console.error("Expired token!")
			cookie.remove("authToken")
			history.push("/login")
		} else {
			setErrorMsg(await res.text())
		}
	}

	return (
		<div className="columns">
			<div className="column is-8 is-offset-2">
				<div className="section">
					<div className="level">
						<div className="level-left is-align-items-baseline">
							<p className="is-size-3 has-text-weight-bold mr-3">
								{store.name}
							</p>
							<p className="is-size-4 is-italic">
								<i>{store.address}</i>
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
					<div className="block box">
						<div className="columns is-mobile">
							<div className="column is-half has-text-centered">
								<b>Queue</b>
								<br />
								<b className="is-size-3">{store.queueLength}</b>
							</div>
							<div className="column is-half has-text-centered">
								<b>Enter in</b>
								<br />
								<b className="is-size-3">
									{waitHours}h {waitMinutes}m
								</b>
								<br />
							</div>
						</div>
					</div>

					<div className="block">
						<Link
							to={"/stores/" + storeId + "/timeslots"}
							className="button is-rounded is-primary is-outlined is-fullwidth has-text-weight-bold"
						>
							See available timeslots
						</Link>
						<p className="has-text-centered p-3">
							<b>OR</b>
						</p>
						<button
							className="button is-rounded is-primary is-fullwidth has-text-weight-bold"
							onClick={_handleJoinQueue}
						>
							Queue now
						</button>
						{/*Redirect us only if we have pressed the button*/}
						{isTicketReceived ? <Redirect to="/tickets" /> : null}
					</div>
				</div>
			</div>
		</div>
	)
}
