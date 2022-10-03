import { Host, Pipeline } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DashboardPipeline from '../components/DashboardPipeline'

export default function Pipelines() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([])
    const [hosts, setHosts] = useState<Host[]>([])
    const [inputIndices, setInputIndices] = useState<string[]>([])

    useEffect(() => {
        const getPipelines = async () => {
            const { data } = await axios.get<Pipeline[]>('/api/pipeline')
            setPipelines(data)
        }
        const getHosts = async () => {
            const { data } = await axios.get<Host[]>('/api/host')
            setHosts(data)
        }
        getPipelines()
        getHosts()
    }, [])
    return (
        <>
            {pipelines.map((pipeline, i) => (
                <DashboardPipeline
                    pipeline={pipeline}
                    hosts={hosts}
                    key={i}
                ></DashboardPipeline>
            ))}
        </>
    )
}
