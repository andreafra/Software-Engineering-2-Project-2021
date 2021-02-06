import React, { useEffect, useState } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"
import checkForExistingTicket from "../components/TicketCache"

export default function TimeslotsView() {
	const storeId = useParams().id
	const [store, setStore] = useState([])
	const [errorMsg, setErrorMsg] = useState("")
	const [timeslots, setTimeslots] = useState([])
	const [selectedTimeslot, setSelectedTimeslot] = useState("")
	const authToken = cookie.load("authToken")
	const history = useHistory()

	useEffect(async () => {
		let res = await fetch(API_BASE_URL + "store/" + storeId, {
			method: "GET",
			headers: {
				// Don't forget to pass authorization token in the header
				"X-Auth-Token": authToken,
			},
		})
		let data = await res.json()
		setStore(data)

		let res1 = await fetch(
			API_BASE_URL + "store/" + storeId + "/reservation/timeslots",
			{
				method: "GET",
				headers: {
					// Don't forget to pass authorization token in the header
					"X-Auth-Token": authToken,
				},
			}
		)
		let data1 = await res1.json()
		setTimeslots(data1)

		// Redirect if we have tickets
		await checkForExistingTicket(history)
	}, []) // Passing [] as second parameter makes the first callback run once when the component mounts.

	// Handle selection of a timeslot from the list
	const _selectTimeslot = (timeslotId) => {
		setSelectedTimeslot(timeslotId)
	}

	// Parses available timeslots and lists them with separators
	const _getTimeslots = () => {
		let ret = []
		let timeslotsSorted = timeslots
			.sort((a, b) => a.weekday - b.weekday)
			.sort((a, b) => {
				let a_time = a.start_time.split(":")
				let b_time = b.start_time.split(":")
				return a_time[0] * 60 + a_time[1] - (b_time[0] * 60 + b_time[1])
			})
		timeslotsSorted.forEach((ts) => {
			if (ts.weekday == 1) {
				ts.weekday = "Monday"
			} else if (ts.weekday == 2) {
				ts.weekday = "Tuesday"
			} else if (ts.weekday == 2) {
				ts.weekday = "Wednesday"
			} else if (ts.weekday == 2) {
				ts.weekday = "Thursday"
			} else if (ts.weekday == 2) {
				ts.weekday = "Friday"
			} else if (ts.weekday == 2) {
				ts.weekday = "Saturday"
			} else {
				ts.weekday = "Sunday"
			}
		})
		DAYS.forEach((d) => {
			// Get all the timeslots in that day
			let slots = timeslotsSorted.filter((t) => t.weekday === d)
			if (slots.length > 0) {
				// Add a separator for each day
				ret.push(
					<h3 key={d} className="title is-4 pt-4">
						{d}
					</h3>
				)

				let elems = slots.map((t) => (
					<button
						key={t.id}
						onClick={() => _selectTimeslot(t.id)}
						className={
							"button mr-1 is-family-code " +
							(t.id === selectedTimeslot ? "is-primary" : "")
						}
					>
						{t.start_time}
						<span
							className={
								"ml-2 tag " + getCrowdnessColor(t.crowdness)
							}
						>
							{t.crowdness}
						</span>
					</button>
				))
				ret.push(elems)
			}
		})

		return ret
	}

	/**
	 * Called when the user confirms their timeslot selection.
	 */
	const _handleReserveTimeslot = async () => {
		const authToken = cookie.load("authToken")
		const res = await fetch(
			API_BASE_URL +
				"store/" +
				storeId +
				"/reservation/book/" +
				selectedTimeslot,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth-Token": authToken,
				},
				body: JSON.stringify({
					storeId: storeId,
					timeslotId: selectedTimeslot,
				}),
			}
		)
		if (res.status === 200) {
			let data = await res.json()
			console.log(data)
			history.push("/tickets")
		} else {
			setErrorMsg(await res.text())
		}
	}

	return (
		<div className="columns">
			<div className="column is-8 is-offset-2">
				<div className="section">
					<p className="title">{store.name} - Timeslots</p>
					<p className="subtitle">
						<i>{store.address}</i>
					</p>
					<div className="block">
						<p>
							The number between [ ] indicates the estimated
							crowdness of the store (0 = not crowded, 2 = very
							crowded).
						</p>
						<p>
							<i>
								Please select one timeslot from the list below.
							</i>
						</p>
					</div>
					<div className="block">{_getTimeslots()}</div>

					<div className="buttons">
						<button
							className="button is-rounded is-primary is-fullwidth has-text-weight-bold"
							disabled={selectedTimeslot === ""}
							onClick={_handleReserveTimeslot}
						>
							Book the selected timeslot
						</button>
						<Link
							to={"/stores/" + storeId}
							className="button is-rounded is-light is-fullwidth"
						>
							Back
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

// helpers
const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
]

function getDayId(day) {
	switch (day) {
		case "Monday":
			return 0
		case "Tuesday":
			return 1
		case "Wednesday":
			return 2
		case "Thursday":
			return 3
		case "Friday":
			return 4
		case "Saturday":
			return 5
		case "Sunday":
		default:
			return 6
	}
}

function getCrowdnessColor(crowdness) {
	switch (crowdness) {
		case 0:
			return "is-success"
		case 1:
			return "is-warning"
		case 2:
			return "is-danger"
		default:
			return ""
	}
}
