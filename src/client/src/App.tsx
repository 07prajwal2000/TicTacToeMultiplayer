import { Client } from "colyseus.js";
import ColyseusContext from "./colyseus";
import Router from "./componnets/Router";

const client = new Client("ws://localhost:3000");

function App() {
	return (
		<ColyseusContext.Provider value={{ client }}>
      <Router />
    </ColyseusContext.Provider>
	);
}

export default App;
