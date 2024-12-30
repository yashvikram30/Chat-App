import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

// this is an empty array containing objects of the type User
let allClients: User[] = [];

wss.on("connection", (socket) => {
    // console.log("connected")
  socket.on("message", (e) => {
    // wss always sends a message as a string, so we will convert it back into the original object it was supposed to be

    const parsedMessage = JSON.parse(e.toString());
    // console.log("message parsed")

    // if the message sent by user is the type to join the room, then add him to the global array of users
    if (parsedMessage.type == "join") {
      allClients.push({
        socket: socket,
        room: parsedMessage.payload.roomId,
      });
    //   console.log("user sent joining request")
    }

    if (parsedMessage.type == "chat") {
      // we will first find the user who sent the message using their unique socket. Next, we will obtain their stored room number and use that to sent messages to everyone in that room.

      const currentUser = allClients.find((x) => x.socket == socket);
      if (!currentUser) {
        return;
      }
      const currentUserRoom = currentUser.room;
    //   console.log("user room found")

      // Broadcast the message to all users in the same room
      const clientsWithSameRoom = allClients.filter((x)=>(x.room)==currentUserRoom);
      clientsWithSameRoom.forEach((client)=>{
        socket.send(parsedMessage.payload.message);
      })
    //   console.log("message sent to all users in the room")
    }
  });
});

/*
------------------------------------SENT BY USER----------------------------------------------
#Join a room
{
   "type": "join",
   "payload": {
     "roomId": "123"
   }
}

#Send a message
{
	"type": "chat",
	"payload": {
		"message": "hi there"
	}
}
-----------------------------------SENT BY SERVER----------------------------------------------
{
	"type": "chat",
	"payload": {
		"message": "hi there"
	}
}

*/
