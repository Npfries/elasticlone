import { Pipeline } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { Controller } from '../lib/controller'
import { PipelineService } from '../services/PipelineService'

export class PipelineController extends Controller {
    constructor(app: FastifyInstance, pipelineService: PipelineService) {
        super(app, '/pipeline')

        super.getMany<Pipeline[]>(async (_, res) => {
            const pipelines = await pipelineService.getPipelines()
            res.send(pipelines)
        })
    }
}
