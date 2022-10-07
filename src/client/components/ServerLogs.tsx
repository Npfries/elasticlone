import { Group, Code } from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../lib/SocketContext'

interface IServerLogs {
    jobId: string
}

export default function ServerLogs(props: IServerLogs) {
    const [logs, setLogs] = useState('')
    const socket = useContext(SocketContext)

    socket?.on(props.jobId, (message: any) => {
        setLogs(`${logs}${message}`)
    })

    return (
        <Group mt="md" grow>
            <Code block>{logs}</Code>
        </Group>
    )
}
