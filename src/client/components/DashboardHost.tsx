import { Paper, Group, ActionIcon, Badge } from '@mantine/core'
import { Host } from '@prisma/client'
import { IconRefresh, IconTrash } from '@tabler/icons'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Info {
    type: string
    version: {
        number: string
    }
}

export default function DashboardHost(params: { host: Host }) {
    const [info, setInfo] = useState<Info>()

    useEffect(() => {
        const loadInfo = async () => {
            const { data } = await axios.get<Info>(
                `/api/info/${params.host.id}`
            )
            setInfo(data)
        }
        loadInfo()
    }, [])

    const handleDeleteHost = async (id: number) => {
        const { data } = await axios.delete(`/api/host/${id}`)
    }
    const handleSyncHost = async (id: number) => {
        const { data } = await axios.get(`/api/info/${id}`)
    }

    return (
        <Paper p="sm" m="sm">
            <Group position="apart">
                <div>
                    <Group>
                        <ActionIcon
                            color="blue"
                            onClick={() => handleSyncHost(params.host.id)}
                        >
                            <IconRefresh></IconRefresh>
                        </ActionIcon>
                        <b>{params.host.name}</b>
                    </Group>
                </div>
                <div>
                    <Group>
                        {params.host.url}
                        <ActionIcon
                            color="red"
                            onClick={() => handleDeleteHost(params.host.id)}
                        >
                            <IconTrash></IconTrash>
                        </ActionIcon>
                    </Group>
                </div>
            </Group>
            <Group position="apart" pt="sm">
                {info?.version !== undefined ? (
                    <div>
                        <Badge color="teal">Connected</Badge>
                        <Badge color="gray">
                            {info?.type}@{info?.version.number}
                        </Badge>
                    </div>
                ) : (
                    <Badge color="red">Disconnected</Badge>
                )}
            </Group>
        </Paper>
    )
}
