import { Client } from '@elastic/elasticsearch'
import { Host } from '@prisma/client'
import { ElasticdumpService } from './ElasticdumpService'
import { HostService } from './HostService'

export class ElasticsearchService {
    private _clients = new Map<number, Client>()
    private _hostService: HostService
    constructor(hostService: HostService) {
        this._hostService = hostService
    }

    private async _getClient(id: number) {
        const client = this._clients.get(id)
        if (!client) return await this._initClient(id)
        return client
    }

    private async _initClient(id: number) {
        const host = await this._hostService.getHost(id)
        const client = new Client({
            node: host?.url,
        })
        this._clients.set(id, client)
        return client
    }

    public async getInfo(id: number) {
        const client = await this._getClient(id)
        const info = await client.info()
        return info
    }
}
