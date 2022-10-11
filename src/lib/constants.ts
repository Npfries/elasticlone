import { Host } from '@prisma/client'
import { DatabaseService } from '../server/services/DatabaseService'
import { ElasticdumpService } from '../server/services/ElasticdumpService'
import { ElasticsearchService } from '../server/services/ElasticsearchService'
import { MigrationStepDefinitions, MigrationTypes } from './enums'

export const MIGRATIONS_INDEX = '.elasticlone_migrations'
export const MIGRATIONS_BACKUP_INDEX = '.elasticlone_backups'

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
    [MigrationTypes.EDIT_INDEX]: {
        UP: [
            MigrationStepDefinitions.CREATE_INDEX_DESTINATION,
            MigrationStepDefinitions.COPY_DATA_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.UPDATE_ALIAS_FROM_SOURCE_TO_DESTINATION,
            MigrationStepDefinitions.DELETE_INDEX_SOURCE,
            MigrationStepDefinitions.CREATE_INDEX_SOURCE,
            MigrationStepDefinitions.COPY_DATA_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.UPDATE_ALIAS_FROM_DESTINATION_TO_SOURCE,
            MigrationStepDefinitions.DELETE_INDEX_DESTINATION,
        ],
        DOWN: [MigrationStepDefinitions.RESTORE_INDEX_PARAMS_SOURCE],
    },
}
