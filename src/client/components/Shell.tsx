import { AppShell, Navbar, useMantineTheme } from '@mantine/core'
import { Outlet, useNavigate } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import Notifications from './Notifications'

export default function Shell() {
    const navigate = useNavigate()
    const theme = useMantineTheme()

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    maxHeight: '100vh',
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }} height="100%">
                    <AppNavbar></AppNavbar>
                </Navbar>
            }
        >
            <Outlet></Outlet>
            <Notifications></Notifications>
        </AppShell>
    )
}
