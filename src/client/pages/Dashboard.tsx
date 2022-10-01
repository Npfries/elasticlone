import { Host } from '@prisma/client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ActionIcon,
    Button,
    Center,
    Group,
    Loader,
    Paper,
    TextInput,
} from '@mantine/core'
import { IconRefresh, IconTrash } from '@tabler/icons'

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
        console.log(data)
    }

    const handleDeleteHost = async (id: number) => {
        const { data, status } = await axios.delete(`/api/host/${id}`)
        updateHosts(hosts.filter((host) => host.id !== data.id))
    }

    const handleSyncHost = async (id: number) => {
        const { data, status } = await axios.get(`/api/info/${id}`)
        console.log(data)
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
                <Paper p="sm" m="sm" key={i}>
                    <Group position="apart">
                        <div>
                            <Group>
                                <ActionIcon
                                    color="blue"
                                    onClick={() => handleSyncHost(host.id)}
                                >
                                    <IconRefresh></IconRefresh>
                                </ActionIcon>
                                {host.name}
                            </Group>
                        </div>
                        <div>
                            <Group>
                                {host.url}
                                <ActionIcon
                                    color="red"
                                    onClick={() => handleDeleteHost(host.id)}
                                >
                                    <IconTrash></IconTrash>
                                </ActionIcon>
                            </Group>
                        </div>
                    </Group>
                </Paper>
            ))}
        </>
    )
}
