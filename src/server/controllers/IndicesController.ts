import { Controller } from '../lib/controller'
import { ElasticsearchService } from '../services/ElasticsearchService'
import type express from 'express'

interface GetIndicesResponse {}

export class IndicesController extends Controller {
    constructor(app: express.Application, elasticsearchService: ElasticsearchService) {
        super(app, '/indices')

        super.getOne<GetIndicesResponse>(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await elasticsearchService.catIndices(id)
            res.send(result)
        })

        super.getOneWithSubId(async (req: any, res) => {
            const hostId = parseInt(req.params.id)
            const index = req.params.subId
            const result = await elasticsearchService.getIndex(hostId, index)
            res.send(result)
        })

        super.deleteWithSubId(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const index = req.params.subId
            await elasticsearchService.deleteIndex(id, index)
            // TODO: this should create a migration instead
            // that requires being able to recreate arbitrary indices for the down migration
            res.send(index)
        })
    }
}
