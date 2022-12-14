export enum PipelineTypes {
    DATA,
    MAPPING,
    ANALYZER,
}

/**
 * This list is additive only, because they are stored in the db by value
 */
export enum MigrationTypes {
    RENAME_INDEX,
    COPY_INDEX,
    CREATE_INDEX,
    EDIT_INDEX,
}

export enum MigrationValues {
    ALL,
    ONE,
    TO,
}

export enum SocketEvents {
    MIGRATIONS_STARTED = 'MIGRATIONS_STARTED',
    MIGRATIONS_COMPLETED = 'MIGRATIONS_COMPLETED',
    MIGRATION_CREATED = 'MIGRATION_CREATED',
    MIGRATION_LOGGED = 'MIGRATION_LOGGED',
    MIGRATION_UNLOGGED = 'MIGRATION_UNLOGGED',
}

export enum MigrationStepDefinitions {
    CREATE_INDEX_SOURCE = 'Create source index',
    CREATE_INDEX_DESTINATION = 'Create destination index',

    DELETE_INDEX_SOURCE = 'Delete source index',
    DELETE_INDEX_DESTINATION = 'Delete destination index',

    ADD_ALIAS_SOURCE = 'Add source index alias',
    ADD_ALIAS_DESTINATION = 'Add destination index alias',

    UPDATE_ALIAS_FROM_SOURCE_TO_DESTINATION = 'Set destination index alias',
    UPDATE_ALIAS_FROM_DESTINATION_TO_SOURCE = 'Set source index alias',

    COPY_SETTINGS_FROM_SOURCE_TO_DESTINATION = 'Copy settings to destination',
    COPY_SETTINGS_FROM_DESTINATION_TO_SOURCE = 'Copy settings to source',

    COPY_MAPPINGS_FROM_SOURCE_TO_DESTINATION = 'Copy mappings to destination',
    COPY_MAPPINGS_FROM_DESTINATION_TO_SOURCE = 'Copy mappings to source',

    COPY_DATA_FROM_SOURCE_TO_DESTINATION = 'Copy data to destination',
    COPY_DATA_FROM_DESTINATION_TO_SOURCE = 'Copy data to source',

    CHECK_ALIAS_EXISTS_SOURCE = 'Verify source alias exists',
    CHECK_ALIAS_EXISTS_DESTINATION = 'Verify destination alias exists',

    CHECK_INDEX_DOES_NOT_EXIST_SOURCE = 'Verify source index does not exist',
    CHECK_INDEX_DOES_NOT_EXIST_DESTINATION = 'Verify destination index does not exist',

    CHECK_INDEX_EXISTS_SOURCE = 'Verify source index exists',
    CHECK_INDEX_EXISTS_DESTINATION = 'Verify destination index exists',

    BACKUP_INDEX_PARAMS_SOURCE = 'Backup source index settings, aliases, and mappings',
    BACKUP_INDEX_PARAMS_DESTINATION = 'Backup destination index settings, aliases, and mappings',

    RESTORE_INDEX_PARAMS_SOURCE = 'Restore source index settings, aliases, and mappings',
    RESTORE_INDEX_PARAMS_DESTINATION = 'Restore destination index settings, aliases, and mappings',
}
