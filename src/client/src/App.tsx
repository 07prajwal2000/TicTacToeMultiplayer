import { Client } from "colyseus.js";
import ColyseusContext from "./colyseus";
import Router from "./componnets/Router";
import { Toaster } from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BASEURL_WS;
const client = new Client(baseUrl);

function App() {
	return (
		<ColyseusContext.Provider value={{ client }}>
			<Toaster
				position="top-right"
			/>
      <Router />
    </ColyseusContext.Provider>
	);
}

export default App;
