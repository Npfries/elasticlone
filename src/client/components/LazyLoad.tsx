import { Center, Loader } from '@mantine/core'
import { Suspense } from 'react'

interface IProps {
    children: any
}

export default function Loading(props: IProps) {
    return (
        <Suspense
            fallback={
                <Center style={{ height: '100%' }}>
                    <Loader />
                </Center>
            }
        >
            {props.children}
        </Suspense>
    )
}
