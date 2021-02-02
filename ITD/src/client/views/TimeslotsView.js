import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"
import { Redirect } from "react-router-dom"

const FAKE_STORE = {
	id: "store-1",
	name: "Store 1",
	address: "Via Milano 16",
	open: true,
	distance: "0.6km",
	freeTimeslots: 12,
	queueLength: 15,
	queueWaitTime: "2008-09-22T14:01:54.9571247Z",
}

const FAKE_TIMESLOTS = [
	{
		id: "d121d85d-3621-4ac1-a2c0-ab635057efb6",
		day: "Monday",
		time: "11:00",
		crowdness: 1,
	},
	{
		id: "31d00b84-1ff9-48fc-aa74-c261e43734c8",
		day: "Monday",
		time: "10:30",
		crowdness: 0,
	},
	{
		id: "74139f05-30d8-4498-acd8-3b526983aa0c",
		day: "Monday",
		time: "14:30",
		crowdness: 2,
	},
	{
		id: "d5b4ed40-f7de-484e-89fc-210ba1ea4f28",
		day: "Tuesday",
		time: "9:30",
		crowdness: 1,
	},
	{
		id: "969786c0-6c55-4a95-b47b-f55690119108",
		day: "Friday",
		time: "12:30",
		crowdness: 2,
	},
]

export default function TimeslotsView() {
	const storeId = useParams().id
	const [store, setStore] = useState([])
	const [timeslots, setTimeslots] = useState([])
	const [button_pressed, setButton] = useState(false)
	const [selectedTimeslot, setSelectedTimeslot] = useState("")

	useEffect(async () => {
		const authToken = cookie.load("authToken")
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

		console.log("Timeslots ricevuti:")
		console.log(data1)
		setTimeslots(data1)
	}, []) // Passing [] as second parameter makes the first callback run once when the component mounts.

	// Handle selection of a timeslot from the list
	const _selectTimeslot = (timeslotId) => {
		setSelectedTimeslot(timeslotId)
	}

	// Parses available timeslots and lists them with separators
	const _getTimeslots = () => {
		let ret = []
		let timeslotsSorted = timeslots
			.sort((a, b) => getDayId(a.day) - getDayId(b.day))
			.sort((a, b) => {
				let a_time = a.time.split(":")
				let b_time = b.time.split(":")
				return a_time[0] * 60 + a_time[1] - (b_time[0] * 60 + b_time[1])
			})
		DAYS.forEach((d) => {
			// Get all the timeslots in that day
			let slots = timeslotsSorted.filter((t) => t.day === d)
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
						{t.time}
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
		const authToken1 = cookie.load("authToken")
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
				},
				body: JSON.stringify({
					storeId: storeId,
					timeslotId: selectedTimeslot,
					authToken: authToken1,
				}),
			}
		)
		let data = await res.json()
		console.log("Booking a timeslot reply:")
		console.log(data)

		setButton(true)
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
						{/*Redirect us only if we have pressed the button*/}
						{button_pressed ? <Redirect to="/tickets" /> : null}
						<Link
							to={"/stores/" + storeId}
							className="button is-rounded is-light is-fullwidth"
						>
							I don't want to reserve a timeslot
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
