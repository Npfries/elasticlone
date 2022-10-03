import { Host } from '@prisma/client'
import { DatabaseService } from './DatabaseService'

export class HostService {
    private _databaseService: DatabaseService
    constructor(database: DatabaseService) {
        this._databaseService = database
    }

    async addHost(host: Host) {
        return await this._databaseService.db.host.create({
            data: host,
        })
    }

    async getHost(id: number) {
        return await this._databaseService.db.host.findUnique({
            where: { id: id },
        })
    }

    async getHosts() {
        return await this._databaseService.db.host.findMany()
    }

    async deleteHost(id: number) {
        return await this._databaseService.db.host.delete({
            where: {
                id: id,
            },
        })
    }
}
