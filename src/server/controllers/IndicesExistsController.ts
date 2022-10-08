import { Controller } from '../lib/controller'
import { ElasticsearchService } from '../services/ElasticsearchService'
import type express from 'express'

export class IndicesExistsController extends Controller {
    constructor(app: express.Application, elasticsearchService: ElasticsearchService) {
        super(app, '/indices/exists')

        super.getOneWithSubId(async (req: any, res) => {
            const hostId = parseInt(req.params.id)
            const index = req.params.subId
            const result = await elasticsearchService.indexExists(hostId, index)
            res.send(result)
        })
    }
}
