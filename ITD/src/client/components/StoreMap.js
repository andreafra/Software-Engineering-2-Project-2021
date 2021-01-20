import React from "react"
import { Map, GoogleApiWrapper } from "google-maps-react"

export function StoreMap(props) {
	return (
		<Map
			google={props.google}
			zoom={14}
			containerStyle={containerStyle}
			style={mapStyles}
			initialCenter={{
				lat: -1.2884,
				lng: 36.8233,
			}}
		/>
	)
}

export default GoogleApiWrapper({
	apiKey: process.env.MAPS_API_KEY,
})(StoreMap)

const mapStyles = {
	width: "100%",
	height: "100vh",
}

const containerStyle = {
	position: "relative",
	width: "100%",
	height: "100%",
}
