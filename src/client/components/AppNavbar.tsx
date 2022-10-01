import { Navbar, NavLink } from '@mantine/core'
import { IconChartDots3, IconGps } from '@tabler/icons'
import { Link } from 'react-router-dom'

export default function AppNavbar() {
    return (
        <>
            <Navbar.Section>
                <Link to="/">
                    <NavLink
                        label="Elasticlone"
                        icon={<IconChartDots3 size={36} stroke={2} />}
                    />
                </Link>
                <Link to="/">
                    <NavLink
                        label="Explore"
                        icon={<IconGps size={24} stroke={1.5}></IconGps>}
                        onClick={() => {
                            // handle new host
                        }}
                        variant="subtle"
                    />
                </Link>
                <Link to="/pipelines">
                    <NavLink
                        label="Pipelines"
                        icon={<IconGps size={24} stroke={1.5}></IconGps>}
                        onClick={() => {
                            // handle new host
                        }}
                        variant="subtle"
                    />
                </Link>
            </Navbar.Section>
            <Navbar.Section grow>
                <></>
            </Navbar.Section>
        </>
    )
}
