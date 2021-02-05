import cookie from "react-cookies"
import { API_BASE_URL } from "../defaults"

/**
 * Redirect the user if they have existing ticket.
 * Call this at the end of a useEffect() to avoid memory leaks.
 *
 * @param {History} history retrieve the parameter from the useHistory() hook.
 */
export default async function checkForExistingTicket(history) {
	const authToken = cookie.load("authToken")
	const hasTicket = cookie.load("user_has_tickets") === "true"
	// Run this code once when a user navigate to any page
	// Request ticket list ONLY IF they have no tickets.
	if (authToken) {
		if (!hasTicket) {
			let res = await fetch(API_BASE_URL + "user/ticket", {
				method: "GET",
				headers: {
					// Don't forget to pass authorization token in the header
					"X-Auth-Token": authToken,
				},
			})
			console.log(res.status)
			if (res.status === 200) {
				cookie.save("user_has_tickets", true, { path: "/" })
				history.push("/tickets")
			}
		} else {
			history.push("/tickets")
		}
	}
}
