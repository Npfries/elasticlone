import { Controller } from '../lib/controller'
import { ElasticsearchService } from '../services/ElasticsearchService'
import type express from 'express'

interface InfoResponse {}

export class InfoController extends Controller {
    constructor(app: express.Application, elasticsearchService: ElasticsearchService) {
        super(app, '/info')

        super.getOne<InfoResponse>(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await elasticsearchService.getInfo(id)
            res.send(result)
        })
    }
}
