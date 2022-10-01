import fastify from 'fastify'
import { HostController } from './server/controllers/HostController'
import { InfoController } from './server/controllers/InfoController'
import { DatabaseService } from './server/services/DatabaseService'
import { ElasticsearchService } from './server/services/ElasticsearchService'
import { HostService } from './server/services/HostService'

const PORT = 3000

const start = async () => {
    const app = fastify()

    const db = new DatabaseService()
    await db.initialize()

    const hostsService = new HostService(db)
    const elasticsearchService = new ElasticsearchService(hostsService)

    new HostController(app, hostsService)
    new InfoController(app, elasticsearchService)

    app.listen({ port: PORT })
    console.log(`Server listening on port: ${PORT}`)
}

start()
