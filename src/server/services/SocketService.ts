import { Server as httpServer } from 'http'
import { Socket, Server } from 'socket.io'

export class SocketService {
    public socket: Socket | null = null
    private _sockets
    constructor(app: httpServer) {
        this._sockets = new Map<string, Socket>()
        const io = new Server(app, {
            cors: {
                origin: '*',
            },
        })
        io.on('connection', (socket) => {
            console.log('Socket Connected')
            this._sockets.set(socket.id, socket)
            this.socket = socket
        })
    }

    public sendToAll<T>(id: string, message?: T) {
        // should specifically only send to clients who care about this
        this._sockets.forEach((socket) => socket.emit(id, message))
    }
}
