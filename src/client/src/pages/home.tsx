import React from "react";
import { Routes, useGlobalStore } from "../store/global";
import { createRoom } from "../api/roomApi";

const HomePage = () => {
	const { setRoute, roomDetails } = useGlobalStore();

	function onJoinFormSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// @ts-ignore
		const roomId = e.currentTarget.elements["roomid"].value;
		// @ts-ignore
		const password = e.currentTarget.elements["password"].value;
		// @ts-ignore
		const username = e.currentTarget.elements["username"].value;
    roomDetails.setValue(roomId, password, username);
		setRoute(Routes.Game);
	}

	async function onCreateFormSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// @ts-ignore
		const roomName = e.currentTarget.elements["roomname"].value;
		// @ts-ignore
		const password = e.currentTarget.elements["password"].value;
    // @ts-ignore
		const username = e.currentTarget.elements["username"].value;
    try {
      const data = await createRoom(roomName, password);
      roomDetails.setValue(data.id, password, username);
    } catch (e) {
      alert("Failed to create room.");
      console.log(e);
    }
		setRoute(Routes.Game);
	}

	return (
		<div className="container-fluid row gap-3 w-75 mx-auto">
			<div className="py-4 col-5 border border-2 rounded-1">
				<h2 className="text-center fw-bold">Join room</h2>
				<hr />
				<form
					className="d-flex flex-column gap-3 mx-auto"
					onSubmit={onJoinFormSubmit}
				>
					<input
            required
						placeholder="Username"
						maxLength={10}
						minLength={2}
						type="text"
						name="username"
						className="form-control"
					/>
					<input
            required
						placeholder="Room ID *"
						maxLength={10}
						minLength={2}
						type="text"
						name="roomid"
						className="form-control"
					/>
					<input
						maxLength={10}
						placeholder="Room Password (if required)"
						minLength={2}
						type="password"
						name="password"
						min={2}
						max={8}
						className="form-control"
					/>
					<button className="btn btn-primary btn-lg" type="submit">
						Join
					</button>
				</form>
			</div>
			<div className="py-4 col-5 border border-2 rounded-1">
				<h2 className="text-center fw-bold">Create room</h2>
				<hr />
				<form
					className="d-flex flex-column gap-3 mx-auto"
					onSubmit={onCreateFormSubmit}
				>
          <input
            required
						placeholder="Username"
						maxLength={10}
						minLength={2}
						type="text"
						name="username"
						className="form-control"
					/>
					<label htmlFor="roomname">Room Name</label>
					<select
						name="roomname"
						className="form-select"
						id="roomname"
					>
						<option value="defaultGameRoom">Default</option>
					</select>
					<input
						maxLength={10}
						placeholder="Room Password (if required)"
						minLength={2}
						type="password"
						name="password"
						min={2}
						max={8}
						className="form-control"
					/>
          <div className="bg-warning p-2 rounded-2">
          After creating room, You will be automatically joined as a player.
          </div>
					<button className="btn btn-primary btn-lg" type="submit">
						Create
					</button>
				</form>
			</div>
		</div>
	);
};

export default HomePage;
