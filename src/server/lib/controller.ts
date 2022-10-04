import { FastifyRequest, FastifyReply } from 'fastify'
import type express from 'express'

interface IRequest<T> extends FastifyRequest {
    body: T
}

// @ts-ignore
interface IReply<T> extends FastifyReply {
    send(data: T): void
}

type IHandler<Request, Reply> = (
    request: IRequest<Request>,
    reply: IReply<Reply>
) => void

export abstract class Controller {
    private _app: express.Application
    private _route: string = ''
    constructor(app: express.Application, route: string) {
        this._app = app
        this._route = '/api' + route
    }

    protected getOne<Reply>(cb: IHandler<void, Reply>) {
        // @ts-ignore
        this._app.get(this._route + '/:id', cb)
    }

    protected getMany<Reply>(cb: IHandler<void, Reply>) {
        // @ts-ignore
        this._app.get(this._route, cb)
    }

    async put<Request, Reply>(cb: IHandler<Request, Reply>) {
        // @ts-ignore
        this._app.put(this._route + '/:id', cb)
    }

    async post<Request, Reply>(cb: IHandler<Request, Reply>) {
        // @ts-ignore
        this._app.post(this._route, cb)
    }

    async delete<Reply>(cb: IHandler<void, Reply>) {
        // @ts-ignore
        this._app.delete(this._route + '/:id', cb)
    }
}
