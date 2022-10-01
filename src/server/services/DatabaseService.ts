import { PrismaClient } from '@prisma/client'

export class DatabaseService {
    // @ts-ignore
    public db: PrismaClient
    constructor() {}

    async initialize() {
        this.db = await new PrismaClient()
    }
}
