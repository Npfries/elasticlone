import fastify from 'fastify'
import { HostController } from './server/controllers/HostController'
import { IndicesController } from './server/controllers/IndicesController'
import { InfoController } from './server/controllers/InfoController'
import { JobController } from './server/controllers/JobController'
import { PipelineController } from './server/controllers/PipelineController'
import { DatabaseService } from './server/services/DatabaseService'
import { ElasticdumpService } from './server/services/ElasticdumpService'
import { ElasticsearchService } from './server/services/ElasticsearchService'
import { HostService } from './server/services/HostService'
import { JobService } from './server/services/JobService'
import { PipelineService } from './server/services/PipelineService'

const PORT = 3000

const start = async () => {
    const app = fastify()

    const db = new DatabaseService()
    await db.initialize()

    const hostsService = new HostService(db)
    const elasticsearchService = new ElasticsearchService(hostsService)
    const pipelineService = new PipelineService(db)
    const elasticdumpService = new ElasticdumpService()
    const jobService = new JobService(elasticdumpService, hostsService)

    new HostController(app, hostsService)
    new InfoController(app, elasticsearchService)
    new PipelineController(app, pipelineService)
    new IndicesController(app, elasticsearchService)
    new JobController(app, jobService)

    app.listen({ port: PORT })
    console.log(`Server listening on port: ${PORT}`)
}

start()
