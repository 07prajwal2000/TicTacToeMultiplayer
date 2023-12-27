import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
	@type("string") name: string = "";
	@type("string") id: string = "";
	@type("string") color: string = "red";
	@type("boolean") active: boolean = false;
}

export class Board extends Schema {
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

export default GameState;