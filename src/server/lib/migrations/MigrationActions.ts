import { Host } from '@prisma/client'
import { MIGRATIONS_BACKUP_INDEX } from '../../../lib/constants'
import { MigrationStepDefinitions } from '../../../lib/enums'
import { DatabaseService } from '../../services/DatabaseService'
import { ElasticdumpService } from '../../services/ElasticdumpService'
import { ElasticsearchService } from '../../services/ElasticsearchService'

interface IContext {
    elasticsearchService: ElasticsearchService
    elasticdumpService: ElasticdumpService
    databaseService: DatabaseService
    host: Host
    migration: {
        id: number
        name: string
        data: {
            source: string
            destination: string
            params: any
        }
    }
}

export const MigraitonActions = {
    [MigrationStepDefinitions.CREATE_INDEX_SOURCE]: async (context: IContext) => {
        return await context.elasticsearchService.createIndex(context.host.id, context.migration.data.source, context.migration.data.params)
    },
    [MigrationStepDefinitions.CREATE_INDEX_DESTINATION]: async (context: IContext) => {
        return await context.elasticsearchService.createIndex(
            context.host.id,
            context.migration.data.destination,
            context.migration.data.params
        )
    },

    [MigrationStepDefinitions.DELETE_INDEX_SOURCE]: async (context: IContext) => {
        return await context.elasticsearchService.deleteIndex(context.host.id, context.migration.data.source)
    },
    [MigrationStepDefinitions.DELETE_INDEX_DESTINATION]: async (context: IContext) => {
        return await context.elasticsearchService.deleteIndex(context.host.id, context.migration.data.destination)
    },

    [MigrationStepDefinitions.ADD_ALIAS_SOURCE]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.ADD_ALIAS_DESTINATION]: async (context: IContext) => {
        return
    },

    [MigrationStepDefinitions.UPDATE_ALIAS_FROM_SOURCE_TO_DESTINATION]: async (context: IContext) => {
        return // TODO
    },
    [MigrationStepDefinitions.UPDATE_ALIAS_FROM_DESTINATION_TO_SOURCE]: async (context: IContext) => {
        return
    },

    [MigrationStepDefinitions.COPY_SETTINGS_FROM_SOURCE_TO_DESTINATION]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.source
        const to = context.host.url + '/' + context.migration.data.destination
        return await context.elasticdumpService.run(from, to, 'settings')
    },
    [MigrationStepDefinitions.COPY_SETTINGS_FROM_DESTINATION_TO_SOURCE]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.destination
        const to = context.host.url + '/' + context.migration.data.source
        return await context.elasticdumpService.run(from, to, 'settings')
    },

    [MigrationStepDefinitions.COPY_MAPPINGS_FROM_SOURCE_TO_DESTINATION]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.source
        const to = context.host.url + '/' + context.migration.data.destination
        return await context.elasticdumpService.run(from, to, 'mapping')
    },
    [MigrationStepDefinitions.COPY_MAPPINGS_FROM_DESTINATION_TO_SOURCE]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.destination
        const to = context.host.url + '/' + context.migration.data.source
        return await context.elasticdumpService.run(from, to, 'mapping')
    },

    [MigrationStepDefinitions.COPY_DATA_FROM_SOURCE_TO_DESTINATION]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.source
        const to = context.host.url + '/' + context.migration.data.destination
        return await context.elasticdumpService.run(from, to, 'data')
    },
    [MigrationStepDefinitions.COPY_DATA_FROM_DESTINATION_TO_SOURCE]: async (context: IContext) => {
        const from = context.host.url + '/' + context.migration.data.destination
        const to = context.host.url + '/' + context.migration.data.source
        return await context.elasticdumpService.run(from, to, 'data')
        // Consider using reindex API, but that won't work for cross host copying without remote reindex, which isn't always practical
    },

    [MigrationStepDefinitions.CHECK_ALIAS_EXISTS_SOURCE]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.CHECK_ALIAS_EXISTS_DESTINATION]: async (context: IContext) => {
        return
    },

    [MigrationStepDefinitions.CHECK_INDEX_DOES_NOT_EXIST_SOURCE]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.CHECK_INDEX_DOES_NOT_EXIST_DESTINATION]: async (context: IContext) => {
        return
    },

    [MigrationStepDefinitions.CHECK_INDEX_EXISTS_SOURCE]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.CHECK_INDEX_EXISTS_DESTINATION]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.BACKUP_INDEX_PARAMS_SOURCE]: async (context: IContext) => {
        const data = await context.elasticsearchService.getIndex(context.host.id, context.migration.data.source)
        const params = data.body[context.migration.data.source]

        // read only properties that are added by elasticsearch
        delete params.settings.index.creation_date
        delete params.settings.index.uuid
        delete params.settings.index.version
        delete params.settings.index.provided_name

        return await context.elasticsearchService.index(context.host.id, MIGRATIONS_BACKUP_INDEX, {
            migrationId: context.migration.id,
            migrationName: context.migration.name,
            indexType: 'source',
            data: params,
        })
    },
    [MigrationStepDefinitions.BACKUP_INDEX_PARAMS_DESTINATION]: async (context: IContext) => {
        const data = await context.elasticsearchService.getIndex(context.host.id, context.migration.data.destination)
        const params = data.body[context.migration.data.destination]

        // read only properties that are added by elasticsearch
        delete params.settings.index.creation_date
        delete params.settings.index.uuid
        delete params.settings.index.version
        delete params.settings.index.provided_name

        return await context.elasticsearchService.index(context.host.id, MIGRATIONS_BACKUP_INDEX, {
            migrationId: context.migration.id,
            migrationName: context.migration.name,
            indexType: 'destination',
            data: params,
        })
    },
    [MigrationStepDefinitions.RESTORE_INDEX_PARAMS_SOURCE]: async (context: IContext) => {
        const backup = await context.elasticsearchService.getFirstDocument(context.host.id, MIGRATIONS_BACKUP_INDEX, {
            bool: {
                must: [
                    {
                        match: {
                            migrationId: context.migration.id,
                        },
                    },
                    {
                        match: {
                            indexType: 'source',
                        },
                    },
                ],
            },
        })
        return await context.elasticsearchService.createIndex(context.host.id, backup.name, backup.data)
    },
    [MigrationStepDefinitions.RESTORE_INDEX_PARAMS_DESTINATION]: async (context: IContext) => {
        return
    },
}
