import { Controller } from '../lib/controller'
import express from 'express'
import { MigrationService } from '../services/MigrationService'

export class UpController extends Controller {
    constructor(app: express.Application, migrationService: MigrationService) {
        super(app, '/up')

        super.postWithId(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await migrationService.up(id)
            res.send(result)
        })
    }
}
