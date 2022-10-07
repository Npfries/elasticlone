import { Host, Pipeline } from '@prisma/client'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import IndexPipeline from '../components/IndexPipeline'
import { SocketContext } from '../lib/SocketContext'

export default function Pipelines() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([])
    const [hosts, setHosts] = useState<Host[]>([])
    const socket = useContext(SocketContext)

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
                <IndexPipeline
                    pipeline={pipeline}
                    hosts={hosts}
                    key={i}
                    socket={socket}
                ></IndexPipeline>
            ))}
        </>
    )
}
