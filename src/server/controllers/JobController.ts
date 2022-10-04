import { Controller } from '../lib/controller'
import { JobService } from '../services/JobService'
import type express from 'express'

export class JobController extends Controller {
    constructor(app: express.Application, jobService: JobService) {
        super(app, '/job')

        super.post(async (req: any, res) => {
            const result = await jobService.run(req.body)
            res.send(result)
        })
    }
}
