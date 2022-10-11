import { Container, Notification, Stack } from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import { SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'

export default function Notifications() {
    const [inProgress, setInProgress] = useState(false)
    const [complete, setComplete] = useState(false)
    const socket = useContext(SocketContext)
    const duration = 4000

    const setInProgressTrue = () => {
        setInProgress(true)
    }

    const migrationsCompletedHandler = () => {
        setInProgress(false)
        setComplete(true)
        setTimeout(() => {
            setComplete(false)
        }, duration)
    }

    const socketSubscriptions = [
        { event: SocketEvents.MIGRATIONS_STARTED, handler: setInProgressTrue },
        { event: SocketEvents.MIGRATIONS_COMPLETED, handler: migrationsCompletedHandler },
    ]

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
        <Container style={{ position: 'fixed', bottom: '0px', right: '0px', width: '360px' }} pb="md">
            <Stack>
                {complete && (
                    <Notification icon={<IconCheck size={18} />} color="teal">
                        Migration complete
                    </Notification>
                )}
                {inProgress && <Notification loading>Migration in progress</Notification>}
            </Stack>
        </Container>
    )
}
