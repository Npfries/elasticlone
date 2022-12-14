import { Paper, Table, ActionIcon, Tabs, Menu, Modal, LoadingOverlay } from '@mantine/core'
import { Host } from '@prisma/client'
import { IconCopy, IconList, IconMessageCircle, IconPlaylistAdd, IconSettings, IconTextCaption, IconTrash } from '@tabler/icons'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'
import IndexCopyModal from './Indices/IndexCopyModal'
import IndexCreateModal from './Indices/IndexCreateModal'
import IndexEditModal from './Indices/IndexEditModal'
import IndexRenameModal from './Indices/IndexRenameModal'

interface IIndexTableProps {
    host?: Host
    info?: {
        type: string
        version: {
            number: string
        }
    }
}

export default function IndexTable(props: IIndexTableProps) {
    const [indices, setIndices] = useState<string[]>([])
    const socket = useContext(SocketContext)
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [inProgress, setInProgress] = useState(false)

    const loadIndices = async () => {
        if (!props?.host?.id) return
        const { data } = await axios.get<string[]>(`/api/indices/${props.host.id}`)
        setIndices(data)
    }

    const migrationStartedHandler = () => {
        setInProgress(true)
    }

    const migrationCompletedHandler = async () => {
        await loadIndices()
        setInProgress(false)
    }

    const socketSubscriptions = [
        { event: SocketEvents.MIGRATIONS_STARTED, handler: migrationStartedHandler },
        {
            event: SocketEvents.MIGRATIONS_COMPLETED,
            handler: migrationCompletedHandler,
        },
    ]

    useEffect(() => {
        loadIndices()
        socketSubscriptions.forEach((sub) => {
            socket?.on(sub.event, sub.handler)
        })
        return () => {
            socketSubscriptions.forEach((sub) => {
                socket?.off(sub.event, sub.handler)
            })
        }
    }, [])

    const handleDeleteIndexClicked = async (index: string) => {
        await axios.delete(`/api/indices/${props.host?.id}/${index}`)
        loadIndices()
    }

    const handleRenameIndexClicked = async (index: string) => {
        setModalTitle('Rename Index')
        setModalContent(
            <IndexRenameModal
                host={props.host as Host}
                existingIndices={indices}
                currentName={index}
                onSubmit={() => {
                    setModalOpen(false)
                }}
            ></IndexRenameModal>
        )
        setModalOpen(true)
    }

    const handleCopyIndexClicked = async (index: string) => {
        setModalTitle('Copy Index')
        setModalContent(
            <IndexCopyModal
                host={props.host as Host}
                existingIndices={indices}
                index={index}
                onSubmit={() => {
                    setModalOpen(false)
                }}
            ></IndexCopyModal>
        )
        setModalOpen(true)
    }

    const handleCreateIndexClicked = async () => {
        setModalTitle('Create Index')
        setModalContent(
            <IndexCreateModal
                host={props.host as Host}
                info={props.info}
                existingIndices={indices}
                onSubmit={() => {
                    setModalOpen(false)
                }}
            ></IndexCreateModal>
        )
        setModalOpen(true)
    }

    const handleEditIndexClicked = async (index: string) => {
        setModalTitle('Edit Index')
        setModalContent(
            <IndexEditModal
                host={props.host as Host}
                index={index}
                existingIndices={indices}
                onSubmit={() => {
                    setModalOpen(false)
                }}
            ></IndexEditModal>
        )
        setModalOpen(true)
    }

    const indicesRows = indices.map((index, i) => {
        return (
            <tr key={i}>
                <td>{index}</td>
                <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon>
                                <IconSettings></IconSettings>
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Index</Menu.Label>
                            <Menu.Item
                                onClick={() => {
                                    handleEditIndexClicked(index)
                                }}
                                icon={<IconSettings size={14} />}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    handleRenameIndexClicked(index)
                                }}
                                icon={<IconTextCaption size={14} />}
                            >
                                Rename
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    handleCopyIndexClicked(index)
                                }}
                                icon={<IconCopy size={14} />}
                            >
                                Copy Index
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                                color="red"
                                icon={<IconTrash size={14} />}
                                onClick={() => {
                                    handleDeleteIndexClicked(index)
                                }}
                            >
                                Delete Index
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </td>
            </tr>
        )
    })

    return (
        <Paper p="sm" style={{ overflowY: 'auto', height: '100%' }}>
            <Tabs defaultValue="indices">
                <Tabs.List>
                    <Tabs.Tab value="indices" icon={<IconList size={14} />}>
                        <b>Indices</b>
                    </Tabs.Tab>
                    <Tabs.Tab value="aliases" icon={<IconList size={14} />}>
                        <b>Aliases</b>
                    </Tabs.Tab>
                    <Tabs.Tab value="search_templates" icon={<IconList size={14} />}>
                        <b>Search Templates</b>
                    </Tabs.Tab>
                    <Tabs.Tab value="index_templates" icon={<IconList size={14} />}>
                        <b>Index Templates</b>
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="indices" pt="xs" style={{ position: 'relative' }}>
                    <LoadingOverlay visible={inProgress} overlayBlur={2} />
                    <Table captionSide="bottom">
                        <caption>Excludes internal indices</caption>
                        <thead>
                            <tr>
                                <th>Index Name</th>
                                <th style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <ActionIcon>
                                        <IconPlaylistAdd onClick={() => handleCreateIndexClicked()}></IconPlaylistAdd>
                                    </ActionIcon>
                                </th>
                            </tr>
                        </thead>
                        <tbody>{indicesRows}</tbody>
                    </Table>
                </Tabs.Panel>
                <Tabs.Panel value="aliases" pt="xs">
                    Aliases
                </Tabs.Panel>
                <Tabs.Panel value="search_templates" pt="xs">
                    Search Templates
                </Tabs.Panel>
                <Tabs.Panel value="index_templates" pt="xs">
                    Index Templates
                </Tabs.Panel>
            </Tabs>
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
                {modalContent}
            </Modal>
        </Paper>
    )
}
