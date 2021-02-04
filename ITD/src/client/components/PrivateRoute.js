import React, { useEffect } from "react"
import cookie from "react-cookies"
import { Redirect, Route } from "react-router-dom"
import { API_BASE_URL } from "../defaults"
import TicketListView from "../views/TicketListView"

/**
 * Routes to the content between <Route></Route> only if the user has a valid
 * cookie `authToken`. If the cookie is not present, the user is router to the
 * website welcome page.
 * @param {object} props
 * @returns A route component with an included redirect if the auth condition is not met.
 */
export default function PrivateRoute(props) {
	const authToken = cookie.load("authToken")
	let userHasTickets = cookie.load("user_has_tickets") || false

	// Run this code once when a user navigate to any page
	useEffect(async () => {
		// Request ticket list ONLY IF they have no tickets.
		if (authToken && !userHasTickets) {
			let res = await fetch(API_BASE_URL + "user/ticket", {
				method: "GET",
				headers: {
					// Don't forget to pass authorization token in the header
					"X-Auth-Token": authToken,
				},
			})
			if (res.status === 200) {
				userHasTickets = true
				cookie.save("user_has_tickets", true, { path: "/" })
			}
		}
	}, [])

	/**
	 * If our dear user has a ticket, they should go straight to the ticket
	 * view, if they don't, skip this step.
	 *
	 * Actually, they don't go straight to the ticket page. Say, a user visit
	 * /stores but the cookies say they have a ticket. First you redirect
	 * them to /tickets, then they are "served" the TicketListView.
	 */
	if (authToken && userHasTickets)
		if (props.path != "/tickets") return <Redirect to="/tickets" />
		else return <Route path={"/tickets"} children={<TicketListView />} />

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
