import { Container, Group, Notification } from '@mantine/core'
import { useContext, useState } from 'react'
import { SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'

export default function Notifications() {
    const [inProgress, setInProgress] = useState(false)
    const socket = useContext(SocketContext)

    socket?.on(SocketEvents.MIGRATIONS_STARTED, () => {
        setInProgress(true)
    })

    socket?.on(SocketEvents.MIGRATIONS_COMPLETED, () => {
        setInProgress(false)
    })

    return (
        <Container style={{ position: 'fixed', bottom: '0px', right: '0px', width: '360px' }} pb="md">
            <Group grow>{inProgress ? <Notification loading>Migration in progress</Notification> : <></>}</Group>
        </Container>
    )
}
