import { MapSchema, Schema, type } from "@colyseus/schema";
import { Client, ClientArray, Room, matchMaker } from "colyseus";
import { IncomingMessage } from "http";
import { boardClickTypeSchema } from "../types/requests/roomType";

class Player extends Schema {
	@type("string") name: string = "";
	@type("string") id: string = "";
	@type("string") color: string = "red";
	@type("boolean") active: boolean = false;
}

class Board extends Schema {
	@type("int8") x: number = 0;
	@type("int8") y: number = 0;
	@type("int8") whichPlayer: number = 1;

	constructor(x: number, y: number, whichP: number) {
		super();
		this.x = x;
		this.y = y;
		this.whichPlayer = whichP;
	}
}

class GameState extends Schema {
	@type({ map: Board }) board: MapSchema<Board> = new MapSchema<Board>();
	@type("int8") currentPlayer: number = 1;
	@type(Player) player1: Player = new Player();
	@type(Player) player2: Player = new Player();
	@type("boolean") gameStarted: boolean = false;
	@type("int8") winPlayer: number = -1;
}

export default class GameRoom extends Room<GameState> {
	private password: string = "";
	private timeoutId: NodeJS.Timeout | undefined = undefined;

	onCreate(options: any): void | Promise<any> {
		this.setState(new GameState());
		this.password = options?.password || "";
		console.log("Options: ", options);
		this.onMessage("boardClick", (c, m) => this.onBoardClick(c, m));
		this.autoCloseRoomAfterTimeout();
	}

	onAuth(
		client: Client,
		options: any,
		request?: IncomingMessage | undefined
	) {
		if (!this.password || this.password == options.password) {
			return true;
		}
		return false;
	}

	async onJoin(
		client: Client,
		options?: any,
		auth?: any
	): Promise<void | Promise<any>> {
		const key = !this.state.player1.active ? "player1" : "player2";
		if (!this.state[key].active) {
			this.state[key].active = true;
			this.state[key].name = options.username;
			this.state[key].color = key == "player1" ? "red" : "blue";
			this.state[key].id = client.sessionId;
		}
		if (key == "player2") {
			this.state.gameStarted = true;
			this.state.currentPlayer = 1;
			await this.lock();
		}
		console.log("Player joined: ", this.state[key]);
	}

	onLeave(
		client: Client,
		consented?: boolean | undefined
	): void | Promise<any> {
		if (this.clients.length == 0) this.disconnect();
		if (this.clients.length == 1 && this.state.winPlayer == -1) {
			this.broadcast("player-exited");
		}
	}

	private onBoardClick(client: Client<GameState>, message: any) {
		if (this.state.winPlayer != -1) return;
		if (!boardClickTypeSchema.safeParse(message)) return;
		const { x, y }: { x: number; y: number } = message;
		console.log(this.state);
		const currentPlayer = this.state.currentPlayer;
		this.updateBoard(x, y, currentPlayer);
		const gameWon = this.checkWinner(x, y);
		if (gameWon) {
			this.state.winPlayer = this.state.currentPlayer;
			this.broadcast("game-won");
			setTimeout(() => {
				this.disconnect();
			}, 10 * 1000);
			return;
		}
		this.state.currentPlayer = currentPlayer == 1 ? 2 : 1;
	}

	private updateBoard(x: number, y: number, player: number) {
		this.state.board.set(`${x}-${y}`, new Board(x, y, player));
	}

	private checkWinner(x: number, y: number) {
		let count = 0;
		for (let i = 0; i <= 2; i++) {
			const key = `${i}-${y}`;
			if (!this.checkBoxOwner(key)) {
				continue;
			}
			count++;
		}
		if (count == 3) return true;
		count = 0;
		for (let i = 0; i <= 2; i++) {
			const key = `${x}-${i}`;
			if (!this.checkBoxOwner(key)) {
				continue;
			}
			count++;
		}
		if (count == 3) return true;
		count = 0;
		for (let i = 0; i <= 2; i++) {
			const key1 = `${i}-${i}`;
			if (!this.checkBoxOwner(key1)) {
				continue;
			}
			count++;
		}
		if (count == 3) return true;
		count = 0;
		for (let i = 0; i <= 2; i++) {
			let j = 2 - i;
			const key1 = `${j}-${i}`;
			if (!this.checkBoxOwner(key1)) {
				continue;
			}
			count++;
		}
		if (count == 3) return true;
		return false;
	}

	private checkBoxOwner(key: string) {
		const box = this.state.board.get(key);
		return box && box.whichPlayer == this.state.currentPlayer;
	}

	onDispose(): void | Promise<any> {
		clearInterval(this.timeoutId);
	}

	private autoCloseRoomAfterTimeout() {
		this.timeoutId = setInterval(() => {
			if (this.clients.length == 0) this.disconnect();
		}, 1000 * 60);
	}
}
