import React, { useState } from "react"
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react"

/**
 * Draw the maps and handles the google API.
 *
 * @param {object} props pass a `stores` array of stores and a callback called
 * when a marker is clicked on map. Callback has assigned store object as paramter.
 * @returns
 */
export function StoreMap(props) {
	const _mapStores = () => {
		// haha geddit?
		return props.stores.map((s) => (
			<Marker
				key={s.id}
				title={s.name}
				name={s.name}
				position={{ lat: s.latitude, lng: s.longitude }}
				onClick={() => props.onMarkerClick(s)}
			></Marker>
		))
	}

	return (
		<Map
			google={props.google}
			zoom={16}
			containerStyle={containerStyle}
			style={mapStyles}
			initialCenter={{
				lat: 45.478559614074626,
				lng: 9.228327906101491,
			}}
		>
			{_mapStores()}
		</Map>
	)
}

export default GoogleApiWrapper({
	apiKey: process.env.MAPS_API_KEY,
})(StoreMap)

const mapStyles = {
	width: "100%",
	height: "100%",
}

const containerStyle = {
	position: "relative",
	width: "100%",
	height: "100%",
}
