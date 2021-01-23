import React from "react"

export default function Button(props) {
	if (props.hidden) return null
	return (
		<button className={"button " + props.className} onClick={props.onClick}>
			{props.title}
		</button>
	)
}
