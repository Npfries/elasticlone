import { Badge, Group, Paper, SimpleGrid, Title } from '@mantine/core'
import { Host } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IndexTable from '../components/IndexTable'
import MigrationsTable from '../components/MigrationsTable'

interface IHostPageProps {}

interface Info {
    type: string
    version: {
        number: string
    }
}

export default function HostPage(props: IHostPageProps) {
    const { slug } = useParams()

    const [info, setInfo] = useState<Info>()
    const [host, setHost] = useState<Host>()

    useEffect(() => {
        const loadInfo = async () => {
            const { data } = await axios.get<Info>(`/api/info/${slug}`)
            setInfo(data)
        }
        const loadHost = async () => {
            const { data } = await axios.get(`/api/host/${slug}`)
            setHost(data)
        }
        loadInfo()
        loadHost()
    }, [])

    return (
        <>
            <Paper p="sm">
                <Group position="apart">
                    <Title order={3}>{host?.name}</Title>
                    {host?.url}
                </Group>
                <Group position="apart" mt="xs">
                    <Badge color="gray">
                        {info !== undefined
                            ? `${info.type}@${info.version?.number}`
                            : null}
                    </Badge>
                    {info?.version !== undefined ? (
                        <Badge color="teal">Connected</Badge>
                    ) : (
                        <Badge color="red">Disconnected</Badge>
                    )}
                </Group>
            </Paper>
            <SimpleGrid mt="sm" cols={2}>
                <div>
                    <IndexTable host={host}></IndexTable>
                </div>
                <MigrationsTable host={host}></MigrationsTable>
            </SimpleGrid>
        </>
    )
}
