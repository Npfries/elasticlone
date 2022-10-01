import { Host } from '@prisma/client'
import { DatabaseService } from './DatabaseService'

export class HostService {
    private databaseService: DatabaseService
    constructor(database: DatabaseService) {
        this.databaseService = database
    }

    async addHost(host: Host) {
        return await this.databaseService.db.host.create({
            data: host,
        })
    }

    async getHost(id: number) {
        return await this.databaseService.db.host.findUnique({
            where: { id: id },
        })
    }

    async getHosts() {
        return await this.databaseService.db.host.findMany()
    }

    async deleteHost(id: number) {
        return await this.databaseService.db.host.delete({
            where: {
                id: id,
            },
        })
    }
}
