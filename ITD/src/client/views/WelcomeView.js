import React from "react"
import Button from "../components/Button"
import { Link } from "react-router-dom"
export default function WelcomeView() {
	return (
		<div className="hero">
			<div className="hero-body">
				<h1 className="title">Welcome to CLup!</h1>
				<p>
					Customers Line-Up(CLup) is a system that allows supermarket
					managers to regulate the influx of peopleinside physical
					stores and reduce the time spent in queue by customers.
				</p>
				<div className="mt-4">
					<Link to="/login">
						<Button title="Login" className="is-primary" />
					</Link>
				</div>
			</div>
		</div>
	)
}
