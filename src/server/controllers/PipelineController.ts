import { Pipeline } from '@prisma/client'
import { Controller } from '../lib/controller'
import { PipelineService } from '../services/PipelineService'
import type express from 'express'

export class PipelineController extends Controller {
    constructor(app: express.Application, pipelineService: PipelineService) {
        super(app, '/pipeline')

        super.getMany<Pipeline[]>(async (_, res) => {
            const pipelines = await pipelineService.getPipelines()
            res.send(pipelines)
        })
    }
}
