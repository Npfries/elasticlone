import { Paper, Timeline, Text, Accordion, Tabs, List, ThemeIcon, ActionIcon, Group, Progress, Loader } from '@mantine/core'
import { Host } from '@prisma/client'
import { IconCircle, IconCircleCheck, IconList, IconPlayerSkipBack, IconPlayerSkipForward, IconPlayerTrackNext } from '@tabler/icons'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { MigrationSteps } from '../../lib/constants'
import { MigrationTypes, MigrationValues, SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'
import ServerLogs from './ServerLogs'

interface IMigrationsTableProps {
    host?: Host
}

export default function MigrationsTable(props: IMigrationsTableProps) {
    const [migrations, setMigrations] = useState<any[]>([])
    const [executedCount, setExecutedCount] = useState(0)
    const [inProgress, setInProgress] = useState(false)
    const socket = useContext(SocketContext)

    const loadMigrations = async () => {
        if (props.host?.id) {
            const { data, status } = await axios.get(`/api/migration/${props.host.id}`)
            setMigrations(data)
        }
    }

    const incrementCount = () => {
        setExecutedCount(executedCount + 1)
    }

    const decrementCount = () => {
        setExecutedCount(executedCount - 1)
    }

    const setInProgressTrue = () => {
        setInProgress(true)
    }

    const setInProgressFalse = () => {
        setInProgress(false)
    }

    const socketSubscriptions = [
        {
            event: SocketEvents.MIGRATION_CREATED,
            handler: loadMigrations,
        },
        {
            event: SocketEvents.MIGRATIONS_COMPLETED,
            handler: loadMigrations,
        },
        {
            event: SocketEvents.MIGRATION_LOGGED,
            handler: incrementCount,
        },
        {
            event: SocketEvents.MIGRATION_UNLOGGED,
            handler: decrementCount,
        },
        {
            event: SocketEvents.MIGRATIONS_STARTED,
            handler: setInProgressTrue,
        },
        {
            event: SocketEvents.MIGRATIONS_COMPLETED,
            handler: setInProgressFalse,
        },
    ]

    useEffect(() => {
        const m = [...migrations]
        setExecutedCount(m.reduce((acc, val) => (val.executed ? acc + 1 : acc), 0))
    }, [migrations])

    useEffect(() => {
        if (props.host?.id) loadMigrations()
        socketSubscriptions.forEach((sub) => {
            socket?.on(sub.event, sub.handler)
        })
        return () => {
            socketSubscriptions.forEach((sub) => {
                socket?.off(sub.event, sub.handler)
            })
        }
    }, [])

    const migrationStepList = (type: MigrationTypes) => {
        return MigrationSteps[type].UP.map((val, i) => <List.Item key={i}>{val}</List.Item>)
    }

    const handleUpAllMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/up/${props.host?.id}`, {
            value: MigrationValues.ALL,
        })
    }

    const handleUpOneMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/up/${props.host?.id}`, {
            value: MigrationValues.ONE,
        })
    }

    const handleDownAllMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/down/${props.host?.id}`, {
            value: MigrationValues.ALL,
        })
    }

    const handleDownOneMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/down/${props.host?.id}`, {
            value: MigrationValues.ONE,
        })
    }

    const rows = migrations.map((migration, i) => (
        <Timeline.Item
            key={i}
            title={
                <Accordion>
                    <Accordion.Item value="steps">
                        <Accordion.Control style={{ height: '24px', position: 'relative', bottom: '3px' }}>
                            {migration.name} ({migrationStepList(migration.type).length} steps)
                        </Accordion.Control>
                        <Accordion.Panel>
                            <List
                                mt="sm"
                                spacing="xs"
                                size="sm"
                                center
                                icon={
                                    <ThemeIcon variant="light" color={migration.executed ? 'teal' : 'gray'} size={24} radius="xl">
                                        {migration.executed ? <IconCircleCheck size={16} /> : <IconCircle size={16}></IconCircle>}
                                    </ThemeIcon>
                                }
                            >
                                {migrationStepList(migration.type)}
                            </List>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            }
            ml="xs"
        >
            <Text size="xs" mt={4} color="dimmed">
                Created {migration.createdAt}
            </Text>
        </Timeline.Item>
    ))

    return (
        <Paper p="sm" style={{ overflowY: 'auto', height: '100%' }}>
            <Tabs defaultValue="migrations" mb="sm">
                <Tabs.List>
                    <Tabs.Tab value="migrations" icon={<IconList size={14} />}>
                        <b>Migrations</b>
                    </Tabs.Tab>
                    <Tabs.Tab value="logs" icon={<IconList size={14} />}>
                        <b>Logs</b>
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="migrations" pt="sm">
                    <Group>
                        <ActionIcon
                            disabled={inProgress || executedCount === 0}
                            variant="light"
                            onClick={() => {
                                handleDownAllMigrationClicked()
                            }}
                        >
                            <IconPlayerSkipBack size={20} />
                        </ActionIcon>

                        <ActionIcon
                            disabled={inProgress || executedCount === 0}
                            variant="light"
                            onClick={() => {
                                handleDownOneMigrationClicked()
                            }}
                        >
                            <IconPlayerSkipBack size={20} />
                        </ActionIcon>
                        <ActionIcon
                            disabled={inProgress || executedCount === migrations.length}
                            variant="light"
                            onClick={() => {
                                handleUpOneMigrationClicked()
                            }}
                        >
                            <IconPlayerSkipForward size={20} />
                        </ActionIcon>
                        <ActionIcon
                            disabled={inProgress || executedCount === migrations.length}
                            variant="light"
                            onClick={() => {
                                handleUpAllMigrationClicked()
                            }}
                        >
                            <IconPlayerTrackNext size={20}></IconPlayerTrackNext>
                        </ActionIcon>
                        {inProgress ? <Loader size={24}></Loader> : <></>}
                    </Group>
                    <Progress value={Math.floor(executedCount ? (executedCount / migrations.length) * 100 : 0)} mt="sm"></Progress>
                    <Timeline mt="lg" active={executedCount ? executedCount - 1 : undefined} bulletSize={24} lineWidth={4}>
                        {rows}
                    </Timeline>
                </Tabs.Panel>
                <Tabs.Panel value="logs" pt="sm">
                    <ServerLogs jobId="job"></ServerLogs>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    )
}
