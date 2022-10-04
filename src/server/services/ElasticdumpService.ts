import { spawn } from 'child_process'
import { SocketService } from './SocketService'

type ITypes = 'analyzer' | 'mapping' | 'data'

export class ElasticdumpService {
    private _socketService

    constructor(socketService: SocketService) {
        this._socketService = socketService
    }

    public async run(from: string, to: string, type: ITypes) {
        return new Promise((resolve, reject) => {
            const child = spawn(
                'npx',
                [
                    `elasticdump`,
                    `--input=${from}`,
                    `--output=${to}`,
                    `--type=${type}`,
                ],
                { shell: true }
            )
            child.on('error', (e) => {
                reject(e)
            })
            child.on('exit', (code) => {
                if (code === 0) {
                    resolve('job') /// id?
                } else {
                    reject(code)
                }
            })

            child.stdout.on('data', (chunk) => {
                this._socketService.sendToAll<string>('job', chunk.toString())
            })
        })
    }
}
