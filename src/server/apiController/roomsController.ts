import { matchMaker } from "colyseus";
import { Express, Request, Response } from "express";
import gameRoomNames from "../roomsController/gameRoomNames";
import CreateRoomType, { createRoomTypeSchema } from "../types/requests/roomType";

const roomNames = Object.values(gameRoomNames);

export default class HomeController {
	public Initialize(app: Express) {
		app.get("/api/rooms", getRooms);
		app.get("/api/room-names", getRoomNames);
		app.post("/api/create-room", createRoom);
	}
}

async function getRooms(request: Request, response: Response) {
	const rooms = (await matchMaker.controller.getAvailableRooms(gameRoomNames.DefaultGameRoom)).map(x => ({
		roomName: x.name,
		roomId: x.roomId,
		connectedClients: x.clients,
		availableToJoin: !x.locked
	}));
	response.status(200).json(rooms);
}

function getRoomNames(_: Request, response: Response) {
	response.status(200).json(roomNames);
}

async function createRoom(request: Request, response: Response) {
	const payload = request.body as CreateRoomType;
	if (!createRoomTypeSchema.safeParse(createRoom)) {
		response.status(400).json({
			message: "Invalid payload"
		});
		return;
	}
	if (payload.roomName != gameRoomNames.DefaultGameRoom) {
		response.status(400).json({
			message: "Room not available"
		});
		return;
	}
	const roomDetails = await matchMaker.createRoom(payload.roomName, payload.password && {password: payload.password, protected: true});
	response.json({
		id: roomDetails.roomId,
		name: roomDetails.name
	});
}