import type { UmzugStorage } from 'umzug'
import { MIGRATIONS_INDEX } from '../../lib/constants'
import { ElasticsearchService } from '../services/ElasticsearchService'

interface MigrationDoc {
    name: string
    timestamp?: string
}

export class CustomUmzugStorage implements UmzugStorage {
    private _hostId: number
    constructor(
        private _elasticsearchService: ElasticsearchService,
        hostId: number,
        private logMigrationCallback?: Function,
        private unlogMigrationCallback?: Function
    ) {
        this._hostId = hostId
    }

    private _createMigrationDoc(name: string): MigrationDoc {
        return {
            name: name,
            timestamp: new Date().toISOString(),
        }
    }

    public async logMigration(params: any) {
        const migration = this._createMigrationDoc(params.name)
        await this._elasticsearchService.index(this._hostId, MIGRATIONS_INDEX, migration)
        if (this.logMigrationCallback) this.logMigrationCallback(params.name)
    }

    public async unlogMigration(params: any) {
        await this._elasticsearchService.deleteDocument(this._hostId, MIGRATIONS_INDEX, { name: params.name })
        if (this.unlogMigrationCallback) this.unlogMigrationCallback(params.name)
    }

    public async executed(): Promise<string[]> {
        const exists = await this._elasticsearchService.indexExists(this._hostId, MIGRATIONS_INDEX)
        if (!exists) {
            await this._elasticsearchService.createIndex(this._hostId, MIGRATIONS_INDEX)
        }
        const migrations = await this._elasticsearchService.getMigrations(this._hostId)
        const result = migrations.map((migration: any) => migration.name)
        return result
    }
}
