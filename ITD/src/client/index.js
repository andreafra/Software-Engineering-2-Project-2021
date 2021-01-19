import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import { BrowserRouter } from "react-router-dom"
import cookie from "react-cookies"
import "bulma/css/bulma.css"

const root = document.getElementById("app")
ReactDOM.render(
	<BrowserRouter>
		<App />
		{/* DEBUG */}
		<footer class="footer">
			<div class="content has-text-centered">
				<p>
					<a onClick={() => cookie.remove("authToken")} href="">
						Clear cookies
					</a>
				</p>
			</div>
		</footer>
	</BrowserRouter>,
	root
)
