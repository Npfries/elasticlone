import { Host, Migration } from '@prisma/client'
import { Umzug } from 'umzug'
import { MigraitonActions, MigrationSteps } from '../../lib/constants'
import { MigrationTypes, SocketEvents } from '../../lib/enums'
import { CustomUmzugStorage } from '../lib/CustomUmzugStorage'
import { DatabaseService } from './DatabaseService'
import { ElasticdumpService } from './ElasticdumpService'
import { ElasticsearchService } from './ElasticsearchService'
import { HostService } from './HostService'
import { SocketService } from './SocketService'

export class MigrationService {
    private _databaseService: DatabaseService
    private _elasticsearchService: ElasticsearchService
    private _elasticdumpService: ElasticdumpService
    private _hostService: HostService
    private _socketService

    constructor(
        databaseService: DatabaseService,
        elasticsearchService: ElasticsearchService,
        elasticdumpService: ElasticdumpService,
        hostService: HostService,
        socketService: SocketService
    ) {
        this._databaseService = databaseService
        this._elasticsearchService = elasticsearchService
        this._elasticdumpService = elasticdumpService
        this._hostService = hostService
        this._socketService = socketService
    }

    private async _getUmzug(id: number) {
        return await this._initUmzug(id)
    }

    private async _initUmzug(id: number) {
        const migrations = await this._getExecutableMigrations(id)
        const umzug = new Umzug({
            migrations: migrations,
            storage: new CustomUmzugStorage(
                this._elasticsearchService,
                id,
                (name: string) => {
                    this._socketService.sendToAll(SocketEvents.MIGRATION_LOGGED, name)
                },
                (name: string) => {
                    this._socketService.sendToAll(SocketEvents.MIGRATION_UNLOGGED, name)
                }
            ), // finish setup storage, pass in client
            logger: console,
        })
        return umzug
    }

    private async _getMigrationsFromDb(hostId: number) {
        const jsonMigraitons = await this._databaseService.db.migration.findMany({
            where: {
                hostId: hostId,
            },
        })
        const parsedMigrations = jsonMigraitons.map((migration) => {
            try {
                const data = JSON.parse(migration.data)
                return { ...migration, data }
            } catch (e) {
                console.error(e)
                return { ...migration, data: {} }
            }
        })
        return parsedMigrations
    }

    private _getMigrationFunction(host: Host, migration: Migration) {
        const steps = MigrationSteps[migration.type as MigrationTypes]
        const upActions = steps.UP.map((step) => MigraitonActions[step])
        const downActions = steps.DOWN.map((step) => MigraitonActions[step])
        const context = {
            elasticsearchService: this._elasticsearchService,
            elasticdumpService: this._elasticdumpService,
            host,
            migration,
        }
        const upSteps = async () => {
            for (const step of upActions) {
                await step(context)
            }
        }

        const downSteps = async () => {
            for (const step of downActions) {
                await step(context)
            }
        }
        return {
            up: upSteps,
            down: downSteps,
        }
    }

    private async _getExecutableMigrations(hostId: number) {
        const migrations = await this._getMigrationsFromDb(hostId)
        const host = (await this._hostService.getHost(hostId)) as Host
        const result = migrations.map((migration) => {
            const m = this._getMigrationFunction(host, migration)
            return {
                name: migration.name,
                up: m.up,
                down: m.down,
            }
        })
        return result
    }

    public async getMigrations(hostId: number) {
        const migrations = await this._getMigrationsFromDb(hostId)
        const executed = await this.executed(hostId)
        const result = migrations.map((migration) => {
            return {
                ...migration,
                executed: executed.some((ex) => ex.name === migration.name),
            }
        })
        return result
    }

    public async addMigration(hostId: number, name: string, type: MigrationTypes, data: any) {
        const stringData = JSON.stringify(data)
        const result = await this._databaseService.db.migration.create({
            data: {
                hostId,
                name,
                data: stringData,
                type,
            },
        })
        this._socketService.sendToAll(SocketEvents.MIGRATION_CREATED)
        return result
    }

    public async up(id: number) {
        const umzug = await this._getUmzug(id)
        await umzug.up()
        this._socketService.sendToAll(SocketEvents.MIGRATIONS_COMPLETED)
        return
    }

    public async down(id: number) {
        const umzug = await this._getUmzug(id)
        await umzug.down({
            to: 0,
        })
        this._socketService.sendToAll(SocketEvents.MIGRATIONS_COMPLETED)
        return
    }

    public async pending(hostId: number) {
        const umzug = await this._getUmzug(hostId)
        const pending = await umzug.pending()
        return pending
    }

    public async executed(hostId: number) {
        const umzug = await this._getUmzug(hostId)
        const executed = await umzug.executed()
        return executed
    }
}
