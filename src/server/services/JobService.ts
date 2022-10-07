import { ElasticdumpService } from './ElasticdumpService'
import { HostService } from './HostService'

interface IRunParams {
    inputHost: number
    inputIndex: string
    outputHost: number
    outputIndex: string
    types: string[]
}

export class JobService {
    private _elasticdumpService: ElasticdumpService
    private _hostService: HostService
    constructor(elasticdumpService: ElasticdumpService, hostService: HostService) {
        this._elasticdumpService = elasticdumpService
        this._hostService = hostService
    }

    public async run(params: IRunParams) {
        const inputUrl = await this._hostService.getHost(params.inputHost)
        const outputUrl = await this._hostService.getHost(params.outputHost)
        return await this._elasticdumpService.run(
            `${inputUrl?.url}/${params.inputIndex}`,
            `${outputUrl?.url}/${params.outputIndex}`,
            'data'
        )
    }
}
