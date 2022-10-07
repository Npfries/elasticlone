interface IMigrationProps {
    migration: {
        name: string
    }
}

export default function Migration(props: IMigrationProps) {
    return <>{props.migration.name}</>
}
