import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import LazyLoad from './client/components/LazyLoad'
import { SocketContext } from './client/lib/SocketContext'
import Compare from './client/pages/Compare'
import Dashboard from './client/pages/Dashboard'
import HostPage from './client/pages/Host'
import Pipelines from './client/pages/Pipelines'
// import Editor from './client/components/Editor';
// import Shell from './client/components/Shell';
// import NotFound from './client/pages/404';

const Shell = React.lazy(() => import('./client/components/Shell'))
const NotFound = React.lazy(() => import('./client/pages/404'))

export default function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

    const themeOverrides = {
        // fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif'
    }

    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const socket = io('http://localhost:3000')
        setSocket(socket)
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider theme={{ colorScheme, ...themeOverrides }} withNormalizeCSS withGlobalStyles withCSSVariables>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <LazyLoad>
                                        <Shell />
                                    </LazyLoad>
                                }
                            >
                                <Route
                                    path="/"
                                    element={
                                        <LazyLoad>
                                            <Dashboard></Dashboard>
                                        </LazyLoad>
                                    }
                                />
                                <Route
                                    path="/pipelines"
                                    element={
                                        <LazyLoad>
                                            <Pipelines></Pipelines>
                                        </LazyLoad>
                                    }
                                />
                                <Route
                                    path="/compare"
                                    element={
                                        <LazyLoad>
                                            <Compare></Compare>
                                        </LazyLoad>
                                    }
                                ></Route>
                                <Route
                                    path="/host/:slug"
                                    element={
                                        <LazyLoad>
                                            <HostPage />
                                        </LazyLoad>
                                    }
                                />
                                <Route
                                    path="/404"
                                    element={
                                        <LazyLoad>
                                            <NotFound />
                                        </LazyLoad>
                                    }
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </MantineProvider>
            </ColorSchemeProvider>
        </SocketContext.Provider>
    )
}
