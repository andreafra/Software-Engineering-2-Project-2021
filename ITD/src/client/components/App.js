import React from "react"
import { Route, Switch } from "react-router-dom"
import LoginView from "../views/LoginView"
import SettingsView from "../views/SettingsView"
import StoreDetailView from "../views/StoreDetailView"
import StoreListView from "../views/StoreListView"
import TicketListView from "../views/TicketListView"
import WelcomeView from "../views/WelcomeView"
import TimeslotsView from "../views/TimeslotsView"
import PrivateRoute from "./PrivateRoute"

export default function App() {
	return (
		<div className="container">
			<Switch>
				<Route path="/welcome" children={<WelcomeView />} />
				<Route path="/login" children={<LoginView />} />
				<PrivateRoute
					path="/stores/:id/timeslots"
					component={<TimeslotsView />}
				/>
				<PrivateRoute
					path="/stores/:id"
					children={<StoreDetailView />}
				/>
				<PrivateRoute path="/stores" children={<StoreListView />} />
				<PrivateRoute
					path="/tickets"
					children={<TicketListView />}
				/>
				<PrivateRoute path="/settings" children={<SettingsView />} />
				<PrivateRoute path="/" children={<StoreListView />} />
			</Switch>
		</div>
	)
}
