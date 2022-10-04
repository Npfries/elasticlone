import { Host, Pipeline } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import IndexPipeline from '../components/IndexPipeline'
import { io } from 'socket.io-client'

export default function Pipelines() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([])
    const [hosts, setHosts] = useState<Host[]>([])
    const [socket, setSocket] = useState<any>()

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

        if (!socket) {
            const socket = io('http://localhost:3000')
            console.log(socket)
            setSocket(socket)
        }
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
