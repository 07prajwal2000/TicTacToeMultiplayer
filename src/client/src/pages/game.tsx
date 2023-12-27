import { useEffect, useState } from "react";
import { Routes, useGlobalStore } from "../store/global";
import { useColyseusContext } from "../colyseus";
import GameState from "../types/gameState";
import { Room } from "colyseus.js";

const boardCordinates: {x: number, y: number}[] = [];

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    boardCordinates.push({x: i, y: j});
  }
}

const GamePage = () => {
  const { roomDetails, setRoute } = useGlobalStore();
  const [gameState, setGameState] = useState<GameState | null>(null); 
  const { client } = useColyseusContext()!;
  
  useEffect(() => {
    joinRoom();
    window.onbeforeunload = (e) => {
      return "Dont reload while playing game";
    };
    return () => {
      console.log("Game room exited");
      window.onbeforeunload = null;
    };
  }, []);

  async function joinRoom() {
    try {
      const roomOptions: any = {
        username: roomDetails.username
      };
      roomDetails.password && (roomOptions["password"] = roomDetails.password)
      console.log(roomDetails);
      const room = await client.joinById<GameState>(roomDetails.id, roomOptions);
      handleRoomLogic(room);
    } catch (e) {
      alert("Failed to join room. Maybe room is expired or invalid password");
      console.log(e);
      setRoute(Routes.Home);
    }
  }

  function handleRoomLogic(room:Room<GameState>) {
    room.onStateChange(onStateChanged)
    room.onLeave(code => {
      console.log("Room closed");
      setRoute(Routes.Home);
    });
    room.onError(err => {
      console.log("Room Error: ", err);
    });
  }

  function onStateChanged(gameState: GameState) {
    setGameState(Object.create(gameState));
  }
  
  function onCellClick(x:number, y: number) {
    if (!gameState?.player2?.name) {
      alert("Waiting for player");
      return;
    }
  }
  
  if (!gameState) {
    return <div>
      Loading...
    </div>
  }
  
  return (
    <div className="row">
      <div className="col-4 d-flex flex-column">
        <p>Room id: {roomDetails.id}</p>
        <p>Password protected: {(roomDetails.password != null).toString()}</p>
        <div className="ps-2">
          <div>
            <h4>P1</h4>
            <h4>Name: {gameState.player1?.name || ''}</h4>
          </div>
          <div>
            {gameState.player2?.name ? <><h4>P2</h4>
            <h4>Name: {gameState.player2?.name}</h4></> : <h4>Waiting for player</h4>}
          </div>
        </div>
      </div>
      <div className="col-8 row justify-content-center align-items-center game-board">
        {boardCordinates.map(c => (
          <div key={`${c.x},${c.y}`} onClick={() => onCellClick(c.x, c.y)} className="text-center col-4 game-cell border border-primary">
            {c.x}, {c.y}
          </div>
        ))};
      </div>
    </div>
  )
}

export default GamePage