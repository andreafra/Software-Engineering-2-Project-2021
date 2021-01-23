import React from "react"
import cookie from "react-cookies"
import { Redirect, Route } from "react-router-dom"

/**
 * Routes to the content between <Route></Route> only if the user has a valid
 * cookie `authToken`. If the cookie is not present, the user is router to the
 * website welcome page.
 * @param {object} props
 * @returns A route component with an included redirect if the auth condition is not met.
 */
export default function PrivateRoute(props) {
	return (
		<Route
			path={props.path}
			children={
				cookie.load("authToken") ? (
					props.children || props.component
				) : (
					<Redirect to="/welcome" />
				)
			}
		/>
	)
}
