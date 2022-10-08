import { Controller } from '../lib/controller'
import express from 'express'
import { MigrationService } from '../services/MigrationService'
import { MigrationValues } from '../../lib/enums'

export class DownController extends Controller {
    constructor(app: express.Application, migrationService: MigrationService) {
        super(app, '/down')

        super.postWithId(async (req: any, res) => {
            const hostId = parseInt(req.params.id)
            const result = await migrationService.down(hostId, req.body.value as MigrationValues)
            res.send(result)
        })
    }
}
