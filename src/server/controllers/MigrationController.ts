import { Controller } from '../lib/controller'
import type express from 'express'
import { MigrationService } from '../services/MigrationService'

export class MigrationController extends Controller {
    constructor(app: express.Application, migrationService: MigrationService) {
        super(app, '/migration')

        super.getOne(async (req: any, res) => {
            const hostId = parseInt(req.params.id)
            const result = await migrationService.getMigrations(hostId)
            res.send(result)
        })

        super.post(async (req: any, res) => {
            const hostId = parseInt(req.body.hostId)
            const migration = await migrationService.addMigration(hostId, req.body.name, req.body.type, req.body.data)
            res.send(migration)
        })
    }
}
