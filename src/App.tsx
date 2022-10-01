import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core'
import React from 'react'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LazyLoad from './client/components/LazyLoad'
import Dashboard from './client/pages/Dashboard'
import Pipelines from './client/pages/Pipelines'
// import Editor from './client/components/Editor';
// import Shell from './client/components/Shell';
// import NotFound from './client/pages/404';

const Shell = React.lazy(() => import('./client/components/Shell'))
const NotFound = React.lazy(() => import('./client/pages/404'))

export default function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

    const themeOverrides = {
        // fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif'
    }

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{ colorScheme, ...themeOverrides }}
                withNormalizeCSS
                withGlobalStyles
                withCSSVariables
            >
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
    )
}
