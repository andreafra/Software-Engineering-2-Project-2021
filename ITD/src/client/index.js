import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import { BrowserRouter, Link } from "react-router-dom"
import cookie from "react-cookies"
import "bulma/css/bulma.css"

const root = document.getElementById("app")
ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	root
)
