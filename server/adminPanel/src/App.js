import './App.css';
import {
	Login,
	Home
} from "./pages";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalProvider } from "./context/GlobalState";

function App() {
	return (
		<GlobalProvider>
			<Router>
				<Switch>
					<Route exact path="/">
						<Login />
					</Route>
					<Route path="/home">
						<Home />
					</Route>
				</Switch>
			</Router>
		</GlobalProvider>
	);
}

export default App;
