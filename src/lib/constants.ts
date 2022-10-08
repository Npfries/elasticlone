import { Host } from '@prisma/client'
import { ElasticdumpService } from '../server/services/ElasticdumpService'
import { ElasticsearchService } from '../server/services/ElasticsearchService'
import { MigrationStepDefinitions, MigrationTypes } from './enums'

export const MIGRATIONS_INDEX = '.elasticlone_migrations'

interface migration {
    source?: string
    destination?: string
    index?: {
        analyzers?: any
        mappings?: any
    }
}

/**
 * These must be in the same order as the keys are defined in @MigrationTypes
 */
export const MigrationSteps = {
    [MigrationTypes.RENAME_INDEX]: {
        UP: [
            // TODO: implement checks
            // MigrationStepDefinitions.CHECK_INDEX_EXISTS_SOURCE,
            // MigrationStepDefinitions.CHECK_ALIAS_EXISTS_SOURCE,
            // MigrationStepDefinitions.CHECK_INDEX_DOES_NOT_EXIST_DESTINATION,
            MigrationStepDefinitions.COPY_SETTINGS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.COPY_MAPPINGS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.COPY_DATA_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.UPDATE_ALIAS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.DELETE_INDEX_SOURCE,
        ],
        DOWN: [
            MigrationStepDefinitions.COPY_SETTINGS_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.COPY_MAPPINGS_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.COPY_DATA_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.UPDATE_ALIAS_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.DELETE_INDEX_DESTINATION,
        ],
    },
    [MigrationTypes.COPY_INDEX]: {
        UP: [
            MigrationStepDefinitions.COPY_SETTINGS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.COPY_MAPPINGS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.COPY_DATA_FROM_SOURCE_TO_DESTINATION,
        ],
        DOWN: [MigrationStepDefinitions.DELETE_INDEX_DESTINATION],
    },
    [MigrationTypes.CREATE_INDEX]: {
        UP: [MigrationStepDefinitions.CREATE_INDEX_DESTINATION],
        DOWN: [MigrationStepDefinitions.DELETE_INDEX_DESTINATION],
    },
}

interface IContext {
    elasticsearchService: ElasticsearchService
    elasticdumpService: ElasticdumpService
    host: Host
    migration: any
}

export const MigraitonActions = {
    [MigrationStepDefinitions.CREATE_INDEX_SOURCE]: async (context: IContext) => {
        return
    },
    [MigrationStepDefinitions.CREATE_INDEX_DESTINATION]: async (context: IContext) => {
        return await context.elasticsearchService.createIndex(context.host.id, context.migration.data.destination)
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
}
