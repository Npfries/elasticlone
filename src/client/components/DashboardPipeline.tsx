import {
    Paper,
    Group,
    Select,
    MultiSelect,
    Button,
    Loader,
} from '@mantine/core'
import { Host, Pipeline } from '@prisma/client'
import { IconCheck, IconPlayerPlay, IconX } from '@tabler/icons'
import axios from 'axios'
import { useEffect, useState } from 'react'

type ITypes = 'Analyzer' | 'Mapping' | 'Data'

export default function DashboardPipeline(props: {
    pipeline: Pipeline
    hosts: Host[]
}) {
    const [inputHostId, setInputHostId] = useState(props.pipeline.inputHostId)
    const [inputIndices, setInputIndices] = useState<string[]>([])
    const [inputIndex, setInputIndex] = useState<string>()
    const [outputHostId, setOutputHostId] = useState(
        props.pipeline.outputHostId
    )
    const [outputIndex, setOutputIndex] = useState<string>()
    const [outputIndices, setOutputIndices] = useState<string[]>([])
    const [types, setTypes] = useState<ITypes[]>(['Data'])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)

    const getInputHostIndices = async (id: number) => {
        const { data } = await axios.get<string[]>(`/api/indices/${id}`)
        setInputIndices(data)
        if (data.some((index) => index === props.pipeline.inputIndex)) {
            setInputIndex(props.pipeline.inputIndex)
        }
    }

    const getOutputHostIndices = async (id: number) => {
        const { data } = await axios.get(`/api/indices/${id}`)
        setOutputIndices(data)
    }

    const handleInputHostChange = (id: number) => {
        setInputHostId(id)
        getInputHostIndices(id)
    }

    const handleOutputHostChange = (id: number) => {
        setOutputHostId(id)
        getOutputHostIndices(id)
    }

    const handleRunButtonClicked = async () => {
        // post to ??? controller, run pipeline
        setLoading(true)
        setSuccess(false)
        setFailed(false)
        try {
            const { data, status } = await axios.post('/api/job', {
                inputHost: inputHostId,
                inputIndex: inputIndex,
                outputHost: outputHostId,
                outputIndex: outputIndex,
                types,
            })
            if (status === 200) {
                setSuccess(true)
            }
        } catch (e) {
            setFailed(true)
        }
        setLoading(false)
    }

    useEffect(() => {
        getInputHostIndices(inputHostId)
        getOutputHostIndices(outputHostId)
    }, [])

    const validatePipeline = (): boolean => {
        return inputHostId &&
            inputIndex &&
            outputHostId &&
            outputIndex &&
            types?.length
            ? true
            : false
    }

    return (
        <Paper p="sm" m="sm">
            <Group grow>
                <Select
                    label="Input Host"
                    data={props.hosts.map((host) => ({
                        label: host.name || host.url,
                        value: `${host.id}`,
                    }))}
                    value={`${inputHostId}`}
                    onChange={(value) => {
                        if (value) handleInputHostChange(parseInt(value))
                    }}
                ></Select>
                <Select
                    label="Input Index"
                    data={inputIndices}
                    value={inputIndex}
                    onChange={(value) => {
                        if (value) setInputIndex(value)
                    }}
                ></Select>
                <Select
                    label="Output Host"
                    data={props.hosts.map((host) => ({
                        label: host.name || host.url,
                        value: `${host.id}`,
                    }))}
                    value={`${outputHostId}`}
                    onChange={(value) => {
                        if (value) handleOutputHostChange(parseInt(value))
                    }}
                ></Select>
                <Select
                    searchable
                    creatable={true}
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={(query) => {
                        setOutputIndices([...outputIndices, query])
                        return query
                    }}
                    label="Output Index"
                    data={outputIndices}
                    value={outputIndex}
                    onChange={(value) => {
                        if (value) setOutputIndex(value)
                    }}
                ></Select>
                <MultiSelect
                    label="Types"
                    data={['Analyzer', 'Mapping', 'Data']}
                    value={types}
                    onChange={(value) => {
                        setTypes(value as unknown as any)
                    }}
                ></MultiSelect>
            </Group>
            <Group mt="md">
                <Button
                    size="sm"
                    compact
                    disabled={!validatePipeline()}
                    onClick={() => {
                        handleRunButtonClicked()
                    }}
                >
                    <IconPlayerPlay size={18}></IconPlayerPlay> Run
                </Button>
                {loading ? <Loader size="sm" /> : null}
                {success ? <IconCheck /> : null}
                {failed ? <IconX color="red"></IconX> : null}
            </Group>
        </Paper>
    )
}
