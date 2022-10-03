import type { Host } from '@prisma/client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Center, Group, Loader, TextInput } from '@mantine/core'
import DashboardHost from '../components/DashboardHost'

interface NewHost {
    name?: string
    url?: string
}

export default function Dashboard() {
    const [hosts, updateHosts] = useState<Host[]>([])
    const [newHost, updateNewHost] = useState<NewHost>({})

    useEffect(() => {
        const getHosts = async () => {
            const { data } = await axios.get<Host[]>('/api/host')
            updateHosts(data)
        }
        getHosts()
    }, [])

    const handleNewHost = async () => {
        const { data, status } = await axios.post('/api/host', {
            name: newHost.name,
            url: newHost.url,
        })
        if (status === 200) updateHosts([...hosts, data])
    }

    return (
        <>
            <Group grow>
                <TextInput
                    placeholder="Name"
                    type="text"
                    autoComplete="false"
                    onChange={(event) =>
                        updateNewHost({
                            ...newHost,
                            name: event.currentTarget.value,
                        })
                    }
                />
                <TextInput
                    placeholder="URL"
                    type="url"
                    onChange={(event) =>
                        updateNewHost({
                            ...newHost,
                            url: event.currentTarget.value,
                        })
                    }
                />
                <Button
                    onClick={handleNewHost}
                    disabled={
                        newHost.name === undefined || newHost.url === undefined
                    }
                >
                    New Host
                </Button>
            </Group>
            {hosts.length === 0 ? (
                <Center style={{ height: '80vh' }}>
                    <Loader />
                </Center>
            ) : (
                <></>
            )}
            {hosts.map((host, i) => (
                <DashboardHost host={host} key={i}></DashboardHost>
            ))}
        </>
    )
}
