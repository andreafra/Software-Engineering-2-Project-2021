import React from "react"
import { Route, Switch } from "react-router-dom"
import LoginView from "../views/LoginView"
import SettingsView from "../views/SettingsView"
import StoreDetailView from "../views/StoreDetailView"
import StoreListView from "../views/StoreListView"
import TicketListView from "../views/TicketListView"
import WelcomeView from "../views/WelcomeView"
import PrivateRoute from "./PrivateRoute"

export default function App() {
	return (
		<div className="columns" style={appStyle}>
			<Switch>
				<Route path="/welcome">
					<WelcomeView />
				</Route>
				<Route path="/login">
					<LoginView />
				</Route>
				<PrivateRoute path="/stores">
					<StoreListView />
				</PrivateRoute>
				<PrivateRoute path="/stores/:id">
					<StoreDetailView />
				</PrivateRoute>
				<PrivateRoute path="/reservations">
					<TicketListView />
				</PrivateRoute>
				<PrivateRoute path="/settings">
					<SettingsView />
				</PrivateRoute>
				<PrivateRoute path="/">
					<StoreListView />
				</PrivateRoute>
			</Switch>
		</div>
	)
}

const appStyle = {
	minHeight: "100vh",
}
