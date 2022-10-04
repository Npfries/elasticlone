import { Controller } from '../lib/controller'
import { ElasticsearchService } from '../services/ElasticsearchService'
import type express from 'express'

interface GetIndicesResponse {}

export class IndicesController extends Controller {
    constructor(
        app: express.Application,
        elasticsearchService: ElasticsearchService
    ) {
        super(app, '/indices')

        super.getOne<GetIndicesResponse>(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await elasticsearchService.catIndices(id)
            res.send(result)
        })
    }
}
