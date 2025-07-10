import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"

@WebSocketGateway(3026, { transports: ['websocket'] })
export class SearchGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(`New Connection To The Socket With ID : ${socket.id}`)
        });
    }

    @SubscribeMessage('search')
    onSearchEvent(@MessageBody() query: string) {
        this.server.emit('STFZDGSA', {
            message: `Searching For Query: ${query}.`
        })
    }

}