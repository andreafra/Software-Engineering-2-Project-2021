import React from "react"

export default function ErrorMsg(props) {
	if (props.message && props.message.length > 0) {
		return (
			<div className="message is-danger">
				<div className="message-body">{props.message}</div>
			</div>
		)
	} else return null
}
