import { Host } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { Controller } from '../lib/controller'
import { HostService } from '../services/HostService'

interface NewHost extends Host {
    id: never
}

export class HostController extends Controller {
    constructor(app: FastifyInstance, hostsService: HostService) {
        super(app, '/host')

        super.getMany<Host[]>(async (_, res) => {
            const result = await hostsService.getHosts()
            res.send(result)
        })

        super.post<NewHost, Host>(async (req, res) => {
            const result = await hostsService.addHost(req.body)
            res.send(result)
        })

        super.delete<Host>(async (req: any, res) => {
            const id = parseInt(req.params.id)
            const result = await hostsService.deleteHost(id)
            res.send(result)
        })
    }
}
