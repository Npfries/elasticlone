import { FastifyInstance } from "fastify";
import { IHosts } from "../../lib/interfaces/hosts";
import { Controller } from "../lib/controller";

export class HostsController extends Controller  {
    constructor(app: FastifyInstance) {
        super(app, '/hosts')
        super.get<IHosts>((_, res) => {
            res.send({hosts: ['Hi there']})
        })

        super.post<IHosts, void>((req, res) => {
             
        })
    }
}