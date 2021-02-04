import React from "react"
import Cookie from "react-cookies"
import { Link } from "react-router-dom"
export default function SettingsView() {
	/**
	 * Log out the user by clearing cookies
	 */
	const _logout = () => {
		Cookie.remove("authToken")
		window.location.reload()
	}

	return (
		<div className="columns">
			<div className="column is-8 is-offset-2">
				<div className="section">
					<div className="level">
						<div className="level-left is-align-items-baseline">
							<p className="is-size-3 has-text-weight-bold mr-3">
								Settings
							</p>
						</div>
						<div className="level-right">
							<Link
								to="/stores"
								className="button is-light is-primary"
							>
								Back
							</Link>
						</div>
					</div>
					<div className="block">
						<button
							className="button is-danger is-rounded"
							onClick={_logout}
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
