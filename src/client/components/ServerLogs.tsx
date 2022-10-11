import { Group, Code } from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../lib/SocketContext'

interface IServerLogs {
    jobId: string
}

export default function ServerLogs(props: IServerLogs) {
    const [logs, setLogs] = useState('')
    const socket = useContext(SocketContext)

    const messageHandler = (message: any) => {
        setLogs(`${logs}${message}`)
    }

    const socketSubscriptions = [{ event: props.jobId, handler: messageHandler }]

    useEffect(() => {
        socketSubscriptions.forEach((sub) => {
            socket?.on(sub.event, sub.handler)
        })
        return () => {
            socketSubscriptions.forEach((sub) => {
                socket?.off(sub.event, sub.handler)
            })
        }
    }, [])

    return (
        <Group mt="md" grow>
            <Code block>{logs}</Code>
        </Group>
    )
}
