import { FastifyInstance } from 'fastify'
import { Controller } from '../lib/controller'
import { ElasticsearchService } from '../services/ElasticsearchService'

interface InfoResponse {}

export class InfoController extends Controller {
    constructor(
        app: FastifyInstance,
        elasticsearchService: ElasticsearchService
    ) {
        super(app, '/info')

        super.getOne<InfoResponse>(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await elasticsearchService.getInfo(id)
            res.send(result)
        })
    }
}
