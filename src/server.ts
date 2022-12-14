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
import { SocketService } from './server/services/SocketService'
import http from 'http'
import express from 'express'
import { MigrationController } from './server/controllers/MigrationController'
import { MigrationService } from './server/services/MigrationService'
import { UpController } from './server/controllers/UpController'
import { DownController } from './server/controllers/DownController'
import { IndicesExistsController } from './server/controllers/IndicesExistsController'

const apm = require('elastic-apm-node').start({
    serviceName: 'elasticlone api',
    // secretToken: '',
    serverUrl: 'https://apm.local.dispiro.com',
})

const PORT = 3000

const start = async () => {
    const app = express()
    const server = http.createServer(app)
    app.use(express.json())
    app.use(express.urlencoded())

    const db = new DatabaseService()
    await db.initialize()

    const socketService = new SocketService(server)
    const hostsService = new HostService(db)
    const elasticsearchService = new ElasticsearchService(hostsService)
    const pipelineService = new PipelineService(db)
    const elasticdumpService = new ElasticdumpService(socketService)
    const jobService = new JobService(elasticdumpService, hostsService)
    const migrationService = new MigrationService(db, elasticsearchService, elasticdumpService, hostsService, socketService)

    new HostController(app, hostsService)
    new InfoController(app, elasticsearchService)
    new PipelineController(app, pipelineService)
    new IndicesController(app, elasticsearchService)
    new IndicesExistsController(app, elasticsearchService)
    new JobController(app, jobService)
    new MigrationController(app, migrationService)
    new UpController(app, migrationService)
    new DownController(app, migrationService)

    server.listen({ port: PORT })
    console.log(`Server listening on port: ${PORT}`)
}

start()
