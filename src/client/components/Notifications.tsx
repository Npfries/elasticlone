import { Container, Notification, Stack } from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { useContext, useState } from 'react'
import { SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'

export default function Notifications() {
    const [inProgress, setInProgress] = useState(false)
    const [complete, setComplete] = useState(false)
    const socket = useContext(SocketContext)
    const duration = 4000

    socket?.on(SocketEvents.MIGRATIONS_STARTED, () => {
        setInProgress(true)
    })

    socket?.on(SocketEvents.MIGRATIONS_COMPLETED, () => {
        setInProgress(false)
        setComplete(true)
        setTimeout(() => {
            setComplete(false)
        }, duration)
    })

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
