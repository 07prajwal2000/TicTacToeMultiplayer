import { Client } from "colyseus.js";
import React, { useContext } from "react";

const ColyseusContext = React.createContext<{client: Client} | null>(null);

export function useColyseusContext() {
  return useContext(ColyseusContext);
}

export default ColyseusContext;