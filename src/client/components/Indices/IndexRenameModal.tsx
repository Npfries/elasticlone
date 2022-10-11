import { Button, Group, Select, Space, Text } from '@mantine/core'
import { Host } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { MigrationTypes } from '../../../lib/enums'

interface IIndexRenameModal {
    currentName: string
    host: Host
    existingIndices: string[]
    onSubmit: Function
}

export default function IndexRenameModal(props: IIndexRenameModal) {
    const [name, setName] = useState('')
    const [indices, setIndices] = useState(props.existingIndices)
    const [error, setError] = useState('')

    useEffect(() => {
        if (props.existingIndices.some((index) => index === name)) {
            setError('That index already exists')
        } else {
            setError('')
        }
    }, [name])

    const handleSumbitClicked = async () => {
        const migration = {
            hostId: props.host?.id,
            name: `rename_${props.currentName}_to_${name}`,
            type: MigrationTypes.RENAME_INDEX,
            data: {
                source: props.currentName,
                destination: name,
            },
        }
        await axios.post('/api/migration', migration)
        props.onSubmit()
    }

    return (
        <>
            <Select
                searchable
                creatable={true}
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                    setIndices([...indices, query])
                    return query
                }}
                label="New name"
                data={indices}
                value={name}
                onChange={(value) => {
                    if (value) setName(value)
                }}
                error={error}
            ></Select>
            {name && !error ? (
                <Text mt="sm" mb="sm">
                    This will create a migration for renaming <b>{props.currentName}</b> to <b>{name}</b>
                </Text>
            ) : (
                <Space h="md"></Space>
            )}
            <Group position="right">
                <Button
                    variant="light"
                    disabled={error !== '' || name === ''}
                    onClick={() => {
                        handleSumbitClicked()
                    }}
                >
                    Create Migration
                </Button>
            </Group>
        </>
    )
}
