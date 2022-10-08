import { Paper, Timeline, Text, Accordion, Tabs, List, ThemeIcon, ActionIcon, Group } from '@mantine/core'
import { Host } from '@prisma/client'
import { IconCircleCheck, IconList, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { MigrationSteps } from '../../lib/constants'
import { MigrationTypes, SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'
import ServerLogs from './ServerLogs'

interface IMigrationsTableProps {
    host?: Host
}

export default function MigrationsTable(props: IMigrationsTableProps) {
    const [migrations, setMigrations] = useState<any[]>([])
    const [executedCount, setExecutedCount] = useState(0)
    const socket = useContext(SocketContext)

    const loadMigrations = async () => {
        if (props.host?.id) {
            const { data, status } = await axios.get(`/api/migration/${props.host.id}`)
            setMigrations(data)
        }
    }

    useEffect(() => {
        setExecutedCount(migrations.reduce((acc, val) => (val.executed ? acc + 1 : acc), 0))
    }, [migrations])

    useEffect(() => {
        if (props.host?.id) loadMigrations()
    }, [props.host])

    socket?.on(SocketEvents.MIGRATION_CREATED, () => {
        loadMigrations()
    })

    socket?.on(SocketEvents.MIGRATIONS_COMPLETED, () => {
        loadMigrations()
    })

    socket?.on(SocketEvents.MIGRATION_LOGGED, () => {
        setExecutedCount(executedCount + 1)
    })

    socket?.on(SocketEvents.MIGRATION_UNLOGGED, () => {
        setExecutedCount(executedCount - 1)
    })

    const migrationStepList = (type: MigrationTypes) => {
        return MigrationSteps[type].UP.map((val, i) => <List.Item key={i}>{val}</List.Item>)
    }

    const handleUpMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/up/${props.host?.id}`)
    }

    const handleDownMigrationClicked = async () => {
        const { data, status } = await axios.post(`/api/down/${props.host?.id}`)
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
                                    <ThemeIcon color="teal" size={24} radius="xl">
                                        <IconCircleCheck size={16} />
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
        <Paper p="sm">
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
                            variant="light"
                            onClick={() => {
                                handleDownMigrationClicked()
                            }}
                        >
                            <IconPlayerSkipBack size={18} />
                        </ActionIcon>
                        <ActionIcon
                            variant="light"
                            onClick={() => {
                                handleUpMigrationClicked()
                            }}
                        >
                            <IconPlayerSkipForward size={18} />
                        </ActionIcon>
                    </Group>
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
