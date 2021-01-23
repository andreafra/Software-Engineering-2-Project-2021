import React from "react"

function Field(props) {
	if (props.hidden) return null

	return (
		<div className="field">
			<label className="label" htmlFor={props.id}>
				{props.label}
			</label>
			<div className="control">
				<input
					id={props.id}
					className="input"
					type={props.type}
					placeholder={props.placeholder}
					onChange={props.onChange}
					disabled={props.disabled}
					maxLength={props.maxLength}
				/>
			</div>
		</div>
	)
}

export function TextField(props) {
	return Field({
		...props,
		type: "text",
	})
}

export function PhoneField(props) {
	return Field({
		...props,
		placeholder: "+39 555 5555555",
		type: "tel",
	})
}

export function BoolField(props) {
	return Field({
		...props,
		type: "checkbox",
	})
}
