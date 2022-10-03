import { FastifyInstance } from 'fastify'
import { Controller } from '../lib/controller'
import { JobService } from '../services/JobService'

export class JobController extends Controller {
    constructor(app: FastifyInstance, jobService: JobService) {
        super(app, '/job')

        super.post(async (req: any, res) => {
            const body = req.body
            const result = await jobService.run(req.body)
        })
    }
}
