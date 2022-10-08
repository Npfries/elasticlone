import { Button, Group, Select, Space, Text } from '@mantine/core'
import { Host } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { MigrationTypes } from '../../../lib/enums'

interface IIndexCreateModal {
    host: Host
    existingIndices: string[]
    onSubmit: Function
}

export default function IndexCreateModal(props: IIndexCreateModal) {
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
            name: `create_index_${name}`,
            type: MigrationTypes.CREATE_INDEX,
            data: {
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
                label="Name"
                data={indices}
                value={name}
                onChange={(value) => {
                    if (value) setName(value)
                }}
                error={error}
            ></Select>
            {name && !error ? (
                <Text mt="sm" mb="sm">
                    This will create a migration for creating <b>{name}</b>
                </Text>
            ) : (
                <Space h="md"></Space>
            )}
            {() => {
                if (name !== '' && error !== '') {
                    return
                }
            }}
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
