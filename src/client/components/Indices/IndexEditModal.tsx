import { Button, Group, Select, Space, Text } from '@mantine/core'
import { Host } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { MigrationTypes } from '../../../lib/enums'
import CodeEditor from '../CodeEditor'

interface IIndexCreateModal {
    host: Host
    index: string
    existingIndices: string[]
    onSubmit: Function
}

export default function IndexEditModal(props: IIndexCreateModal) {
    const [error, setError] = useState('')
    const [json, setJson] = useState('{}')

    const loadIndex = async () => {
        const { data } = await axios.get(`/api/indices/${props.host.id}/${props.index}`)
        const params = data.body[props.index]

        // read only properties that are added by elasticsearch
        delete params.settings.index.creation_date
        delete params.settings.index.uuid
        delete params.settings.index.version
        delete params.settings.index.provided_name

        setJson(JSON.stringify(params, null, 4))
    }

    useEffect(() => {
        loadIndex()
    }, [])

    const handleSumbitClicked = async () => {
        const migration = {
            hostId: props.host?.id,
            name: `edit_index_${props.index}`,
            type: MigrationTypes.EDIT_INDEX,
            data: {
                source: props.index,
                destination: '.elasticlone_migration_tmp',
                params: json,
            },
        }
        await axios.post('/api/migration', migration)
        props.onSubmit()
    }

    return (
        <>
            {props.index && !error ? (
                <Text mt="sm" mb="sm">
                    This will create a migration for creating a new version of <b>{props.index}</b>
                </Text>
            ) : (
                <Space h="md"></Space>
            )}

            <CodeEditor
                value={json}
                onChange={(value) => {
                    value ? setJson(value) : '{}'
                }}
                language="json"
            ></CodeEditor>
            <a href={`https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html`} target="_blank">
                Elasticsearch documentation
            </a>
            <Group position="right" mt="sm">
                <Button
                    variant="light"
                    disabled={error !== '' || props.index === ''}
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
