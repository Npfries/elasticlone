import { Navbar, NavLink } from '@mantine/core'
import {
    IconArrowsCross,
    IconGps,
    IconPlayerTrackNext,
    IconZoomCode,
} from '@tabler/icons'
import { Link } from 'react-router-dom'

export default function AppNavbar() {
    return (
        <>
            <Navbar.Section>
                <Link to="/">
                    <NavLink
                        label="Elasticlone"
                        icon={<IconZoomCode size={36} stroke={2} />}
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
                        icon={
                            <IconPlayerTrackNext
                                size={24}
                                stroke={1.5}
                            ></IconPlayerTrackNext>
                        }
                        onClick={() => {
                            // handle new host
                        }}
                        variant="subtle"
                    />
                </Link>
                <Link to="/compare">
                    <NavLink
                        label="Compare"
                        icon={
                            <IconArrowsCross
                                size={24}
                                stroke={1.5}
                            ></IconArrowsCross>
                        }
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
