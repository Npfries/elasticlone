import { DatabaseService } from './DatabaseService'

export class PipelineService {
    private _databaseService: DatabaseService
    constructor(databaseService: DatabaseService) {
        this._databaseService = databaseService
    }

    async getPipelines() {
        return await this._databaseService.db.pipeline.findMany()
    }

    async getPipeline(id: number) {
        return await this._databaseService.db.pipeline.findUnique({
            where: {
                id: id,
            },
        })
    }

    async addPipeline(inputHostId: number, outputHostId: number) {
        return await this._databaseService.db.pipeline.create({
            data: {
                inputHostId,
                outputHostId,
            },
        })
    }

    async deletePipeline(id: number) {
        return await this._databaseService.db.pipeline.delete({
            where: {
                id,
            },
        })
    }
}
