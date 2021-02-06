import React, { useEffect, useState } from "react"
import cookie from "react-cookies"
import { Link } from "react-router-dom"
import StoreMap from "../components/StoreMap"
import { API_BASE_URL, POLIMI_COORDS } from "../defaults"
import ErrorMsg from "../components/ErrorMsg"
import checkForExistingTicket from "../components/TicketCache"
import { useHistory } from "react-router-dom"

export default function StoreListView() {
	const [stores, setStores] = useState([])
	const [useGPS, setUseGPS] = useState(false)
	const [coords, setCoords] = useState(_parseCoords(POLIMI_COORDS))
	const [errorMsg, setErrorMsg] = useState("")
	const history = useHistory()
	const authToken = cookie.load("authToken")

	useEffect(async () => {
		setErrorMsg("")
		console.log("Retriving stores...")
		// Fetch store list from server
		let res = await fetch(
			API_BASE_URL + `search/${coords.lat}|${coords.lng}`,
			{
				method: "GET",
				headers: {
					// Don't forget to pass authorization token in the header
					"X-Auth-Token": authToken,
				},
			}
		)
		if (res.status === 200) {
			let data = await res.json()
			console.log(data)
			setStores(data)
		} else {
			setErrorMsg(await res.text())
		}

		// Redirect if we have tickets
		await checkForExistingTicket(history)
	}, [coords]) // Passing [] as second parameter makes the first callback run once when the component mounts.

	const _listStores = () => {
		return stores.map((store) => (
			<li className="card mb-5" key={store.id}>
				<div className="card-header has-background-primary-light">
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
							{_getDistance(
								coords.lat,
								coords.lng,
								store.latitude,
								store.longitude
							)}{" "}
							m
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

	const _toggleGPS = () => {
		setUseGPS(!useGPS)
		if (!useGPS) {
			// switch to gps
			// Try use gps api, requires HTTPS
			if (!navigator.geolocation) {
				alert("Geolocation is not supported by your browser")
			} else {
				navigator.geolocation.getCurrentPosition(
					// Success
					(pos) => {
						let coords = {
							lat: pos.coords.latitude,
							lng: pos.coords.longitude,
						}
						console.log("Retrived coords... " + coords)
						setCoords(coords)
					},
					// Error
					() => setErrorMsg("Unable to retrieve position")
				)
			}
		} else {
			// switch to coords
			setCoords(_parseCoords(POLIMI_COORDS))
			console.log("Using default coords... " + POLIMI_COORDS)
		}
	}

	return (
		<div>
			<div className="columns is-gapless store-view">
				<div className="column is-one-third store-list">
					<div className="p-5">
						<ErrorMsg message={errorMsg} />
						<ul>{_listStores()}</ul>
					</div>
				</div>
				<div className="column is-two-thirds store-map">
					<StoreMap
						coords={coords}
						stores={stores}
						onMarkerClick={(store) =>
							history.push("/stores/" + store.id)
						}
					/>
					<div className="store-searchbox">
						<a
							className="button is-small is-warning"
							onClick={_toggleGPS}
						>
							{useGPS ? "Use Coordinates" : "Use GPS"}
						</a>
					</div>
				</div>
			</div>
			<div className="navbar is-fixed-bottom">
				<div className="navbar-item">
					<div className="columns is-mobile">
						{/* <div className="column is-half">
							<Link
								className="button is-primary is-fullwidth is-rounded"
								to={
									cookie.load("user_has_tickets") === "true"
										? "/tickets"
										: ""
								}
								disabled={
									cookie.load("user_has_tickets") === "false"
								}
							>
								See tickets
							</Link>
						</div> */}
						<div className="column">
							<Link
								className="button is-rounded is-fullwidth"
								to="/settings"
							>
								Settings
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const _parseCoords = (coords) => {
	const coordsArray = coords.split("|")
	const lat = parseFloat(coordsArray[0])
	const lng = parseFloat(coordsArray[1])
	return { lat: lat, lng: lng }
}

/**
 * Get distance between to points.
 * From: https://stackoverflow.com/questions/639695/
 * Explanation: https://en.wikipedia.org/wiki/Haversine_formula
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance
 */
const _getDistance = (lat1, lon1, lat2, lon2) => {
	var R = 6378.137 // Radius of earth in KM
	var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180
	var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	var d = R * c
	return Math.trunc(d * 1000) // meters
}
