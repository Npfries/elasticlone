import { Button, Center, Kbd, Text } from '@mantine/core'

export default function NotFound() {
    return (
        <Center style={{ height: '80vh' }}>
            <Text color="dimmed">
                <Center>
                    <h2>Oops! Couldn't find what you were looking for...</h2>
                </Center>

                <Center>
                    <Kbd mr="xs">⌘</Kbd> +{' '}
                    <Kbd ml="xs" mr="xs">
                        Enter
                    </Kbd>{' '}
                    or{' '}
                    <Button variant="light" ml="" mr="xs">
                        click here
                    </Button>{' '}
                    to add a new host.
                </Center>
            </Text>
        </Center>
    )
}
