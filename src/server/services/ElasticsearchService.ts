import { Client } from '@elastic/elasticsearch'
import { MIGRATIONS_INDEX } from '../../lib/constants'
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
        try {
            const client = await this._getClient(id)
            const data = (await client.info()) as any
            const info = data.body
            if (typeof info === 'string') return

            info.type = info.tagline === 'You Know, for Search' ? 'Elasticsearch' : 'OpenSearch'
            return info
        } catch (e) {
            return {}
        }
    }

    public async catIndices(id: number) {
        try {
            const client = await this._getClient(id)
            const data = await client.cat.indices()
            const result = data.body
                .split('\n')
                .map((row: string) => row.split('open ')[1])
                .filter((row: string) => row !== undefined && row[0] !== '.')
                .map((row: string) => row.split(' ')[0])
            return result
        } catch (e) {
            return []
        }
    }

    public async getAliases(id: number) {
        try {
            const client = await this._getClient(id)
            const data = await client.indices.getAlias()
            const aliases = Object.keys(data.body).filter((key) => key[0] !== '.')
            return aliases
        } catch (e) {
            return []
        }
    }

    public async getIndex(hostId: number, index: string) {
        const client = await this._getClient(hostId)
        const result = await client.indices.get({
            index,
        })
        return result
    }

    public async deleteIndex(id: number, index: string) {
        const client = await this._getClient(id)
        const result = await client.indices.delete({
            index,
        })
        return result
    }

    public async createIndex(id: number, name: string, params: any) {
        const client = await this._getClient(id)
        try {
            const result = await client.indices.create({
                index: name,
                body: params,
            })
            return result
        } catch (e) {
            console.log('ERROR: ', JSON.stringify(e, null, 4))
            throw new Error()
        }
    }

    public async getMigrations(hostId: number) {
        try {
            const client = await this._getClient(hostId)
            const exists = await this.indexExists(hostId, MIGRATIONS_INDEX)
            if (!exists) return []
            const searchResults = await client.search({
                index: MIGRATIONS_INDEX,
                size: 1000, // probably should implement scrolling search here
            })
            const result = searchResults.body.hits.hits.map((migration: any) => migration._source)
            return result
        } catch (e) {
            return []
        }
    }

    public async indexExists(hostId: number, name: string) {
        try {
            const client = await this._getClient(hostId)
            const result = await client.indices.exists({
                index: name,
            })
            return result.body
        } catch (e) {
            console.error(e)
        }
    }

    public async index(hostId: number, index: string, doc: { [key: string]: any }) {
        try {
            const client = await this._getClient(hostId)
            const result = await client.index({
                index,
                refresh: 'true',
                body: doc,
            })
            return result
        } catch (e) {
            console.error(e)
        }
    }

    public async deleteDocument(hostId: number, index: string, where: { [key: string]: any }) {
        try {
            const client = await this._getClient(hostId)
            const result = await client.deleteByQuery({
                index: index,
                refresh: true,
                body: {
                    query: {
                        bool: {
                            filter: [
                                Object.keys(where).map((key) => {
                                    return {
                                        term: {
                                            [key]: where[key],
                                        },
                                    }
                                }),
                            ],
                        },
                    },
                },
            })
            return result
        } catch (e) {
            console.error(e)
        }
    }

    public async getFirstDocument(hostId: number, index: string, query: any) {
        try {
            const client = await this._getClient(hostId)
            const result = await client.search({
                index: index,
                body: {
                    query,
                },
            })
            console.log(result)
            const firstDocument = result.body.hits?.hits[0]?._source
            return firstDocument
        } catch (e) {
            console.error(e)
        }
    }
}
