import fastify from "fastify";
import { HostsController } from "./server/controllers/hostsController";

const PORT = 3000

const app = fastify()
new HostsController(app)

app.listen({port: PORT})
console.log(`Server listening on port: ${PORT}`)