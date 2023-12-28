import { useEffect, useState } from "react";
import { Routes, useGlobalStore } from "../store/global";
import { useColyseusContext } from "../colyseus";
import GameState from "../types/gameState";
import { Room } from "colyseus.js";
import toast from "react-hot-toast";

const boardCordinates: { x: number; y: number }[] = [];

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		boardCordinates.push({ x: i, y: j });
	}
}

const GamePage = () => {
	const { roomDetails, setRoute } = useGlobalStore();
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [room, setRoom] = useState<Room<GameState> | null>(null);

	const { client } = useColyseusContext()!;
	const isP1Me = gameState?.player1.name == roomDetails.username || false;
	const myTurn =
		(isP1Me && gameState?.currentPlayer == 1) ||
		(!isP1Me && gameState?.currentPlayer == 2);

	useEffect(() => {
		joinRoom();
		window.onbeforeunload = () => {
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
				username: roomDetails.username,
			};
			if (roomDetails.password) {
				roomOptions["password"] = roomDetails.password;
			}
			const room = await client.joinById<GameState>(
				roomDetails.id,
				roomOptions
			);
			setRoom(room);
			handleRoomLogic(room);
			room.onMessage("game-won", onGameWonMsg);
			room.onMessage("player-exited", onPlayerExited);
		} catch (e: any) {
			console.log("Err type: ", typeof e);
			toast.error(
				"Failed to join room. Maybe room is expired or invalid password"
			);
			console.log(e);
			setRoute(Routes.Home);
		}
	}
	function onPlayerExited() {
		toast("Opponent exited the match.")
		setRoute(Routes.Home);
	}

	function onGameWonMsg() {
		console.log(gameState);
		toast(`Game won. Room is closing in 10s.`);
	}

	function handleRoomLogic(room: Room<GameState>) {
		room.onStateChange(onStateChanged);
		room.onLeave(() => {
			console.log("Room closed");
			setRoute(Routes.Home);
		});
		room.onError((err) => {
			console.log("Room Error: ", err);
		});
	}

	function onStateChanged(gameState: GameState) {
		console.log(gameState);
		setGameState(Object.create(gameState));
	}

	function onCellClick(x: number, y: number) {
		if (!room) {
			console.log("Room is null.");
			return;
		}
		if (!gameState?.gameStarted) {
			toast.error("Game not started yet, Please wait.");
			return;
		}
		if (!myTurn) {
			toast("Not your turn.", {
				style: {
					backgroundColor: "yellow",
				},
			});
			return;
		}
		room.send("boardClick", { x, y });
	}

	if (!gameState) {
		return <div>Loading...</div>;
	}

	return (
		<div className="row">
			<div className="col-12 col-lg-4 d-flex flex-column">
				<h3>Room Details</h3>
				<hr />
				<p>Room id: {roomDetails.id}</p>
				<p>
					Password protected:{" "}
					{(roomDetails.password != "").toString()}
				</p>
				<div className="ps-2">
					<div className="py-4">
						<h4 className={`${isP1Me && "text-primary"}`}>
							P1: {gameState?.player1?.name || ""}{" "}
							{isP1Me && <p>You</p>}
						</h4>
					</div>
					<div>
						{gameState?.player2?.name ? (
							<div>
								<h4 className={`${!isP1Me && "text-primary"}`}>
									P2: {gameState?.player2?.name || ""}
								</h4>
							</div>
						) : (
							<h4>Waiting for player</h4>
						)}
					</div>
					<div>
						{gameState.gameStarted && <h4>{myTurn ? "Your turn" : "opponent's turn"}</h4>}
					</div>
					<div>
						{gameState?.winPlayer != -1 && (
							<div>
								<h5>
									Player{" "}
									{gameState.winPlayer == 1
										? gameState.player1.name
										: gameState.player2.name}{" "}
									won the match.
								</h5>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="col-12 col-lg-8 row justify-content-center align-items-center game-board">
				{boardCordinates.map((c) => {
					const key = `${c.x}-${c.y}`;
					const filled = gameState?.board.get(key);
					let cn = "";
					if (filled) {
						cn =
							filled.whichPlayer == 1
								? "bg-danger"
								: "bg-primary";
					}
					return (
						<div
							key={key}
							onClick={() => onCellClick(c.x, c.y)}
							className={
								"text-center col-4 game-cell border border-primary " +
								cn
							}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default GamePage;
