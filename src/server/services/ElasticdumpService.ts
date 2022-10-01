import util from 'util'

import { exec as syncExec } from 'child_process'
const exec = util.promisify(syncExec)

type ITypes = 'analyzer' | 'mapping' | 'data'

export class ElasticdumpService {
    public async run(from: string, to: string, type: ITypes) {
        const result = exec(
            `npx elasticdump --input=${from} --output=${to} --type=${type}`
        )
        return result
    }
}
