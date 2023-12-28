const domain = import.meta.env.VITE_BASEURL;

export type CreateRoomResponse = {
  id: string;
  name: string;
}

export async function createRoom(roomName: string, password: string): Promise<CreateRoomResponse> {
  const req = await fetch(domain + "/api/create-room", {
    body: JSON.stringify({roomName, password}),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  const data = await req.json();
  return data;
}