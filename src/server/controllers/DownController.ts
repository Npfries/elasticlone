import { Controller } from '../lib/controller'
import express from 'express'
import { MigrationService } from '../services/MigrationService'

export class DownController extends Controller {
    constructor(app: express.Application, migrationService: MigrationService) {
        super(app, '/down')

        super.postWithId(async (req: any, res) => {
            const hostId = parseInt(req.params.id)
            const result = await migrationService.down(hostId)
            res.send(result)
        })
    }
}
