import { Paper, Table, ActionIcon, Tabs, Menu, Modal } from '@mantine/core'
import { Host } from '@prisma/client'
import { IconCopy, IconList, IconMessageCircle, IconSettings, IconTextCaption, IconTrash } from '@tabler/icons'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { SocketEvents } from '../../lib/enums'
import { SocketContext } from '../lib/SocketContext'
import IndexRenameModal from './Indices/IndexRenameModal'

interface IIndexTableProps {
    host?: Host
}

interface ITabs {
    name: string
    children: JSX.Element
}

export default function IndexTable(props: IIndexTableProps) {
    const [indices, setIndices] = useState<string[]>([])
    const socket = useContext(SocketContext)
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')

    const loadIndices = async () => {
        if (!props?.host?.id) return
        const { data } = await axios.get<string[]>(`/api/indices/${props.host.id}`)
        setIndices(data)
    }

    useEffect(() => {
        loadIndices()
    }, [props.host])

    socket?.on(SocketEvents.MIGRATIONS_COMPLETED, () => {
        loadIndices()
    })

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

        // const newName = `${index}_copy`
        // const migration = {
        //     hostId: props.host?.id,
        //     name: `rename_${index}_to_${newName}`,
        //     type: MigrationTypes.RENAME_INDEX,
        //     data: {
        //         source: index,
        //         destination: newName,
        //     },
        // }
        // await axios.post('/api/migration', migration)
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
                            <Menu.Item icon={<IconSettings size={14} />}>Edit Mapping</Menu.Item>
                            <Menu.Item icon={<IconMessageCircle size={14} />}>Edit Analyzer</Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    handleRenameIndexClicked(index)
                                }}
                                icon={<IconTextCaption size={14} />}
                            >
                                Rename
                            </Menu.Item>
                            <Menu.Item icon={<IconCopy size={14} />}>Copy Index</Menu.Item>
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
        <Paper p="sm">
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
                <Tabs.Panel value="indices" pt="xs">
                    <Table captionSide="bottom">
                        <caption>Excludes internal indices</caption>
                        <thead>
                            <tr>
                                <th>Index Name</th>
                                <th></th>
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
