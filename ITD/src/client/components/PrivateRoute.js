import React, { useEffect, useState } from "react"
import cookie from "react-cookies"
import { Redirect, Route, useHistory } from "react-router-dom"
import { API_BASE_URL } from "../defaults"

/**
 * Routes to the content between <Route></Route> only if the user has a valid
 * cookie `authToken`. If the cookie is not present, the user is router to the
 * website welcome page.
 * @param {object} props
 * @returns A route component with an included redirect if the auth condition is not met.
 */
export default function PrivateRoute(props) {
	const authToken = cookie.load("authToken")

	/**
	 * If users have an authToken we presume being valid, they can browse
	 * all views. If they do not have it, it means that they are not logged in.
	 * Send them to the welcome page so that they can login.
	 */
	return (
		<Route
			path={props.path}
			children={
				authToken ? (
					props.children || props.component
				) : (
					<Redirect to="/welcome" />
				)
			}
		/>
	)
}
