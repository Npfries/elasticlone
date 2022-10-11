import { useMantineColorScheme, useMantineTheme } from '@mantine/core'
import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'

type OnChange = (value: string | undefined) => void

interface IProps {
    onChange: OnChange
    language: string
    value: string
}

export default function CodeEditor(props: IProps) {
    const theme = useMantineTheme()
    const monaco = useMonaco()
    const { colorScheme } = useMantineColorScheme()

    const setTheme = (monaco: any) => {
        monaco.editor.defineTheme('dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': theme.colors.dark[7],
            },
        })
        monaco.editor.defineTheme('light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#FFFFFF',
            },
        })
    }

    useEffect(() => {
        if (monaco) monaco.editor.setTheme(colorScheme)
    }, [colorScheme])

    const onMount = () => {
        if (monaco) monaco.editor.setTheme(colorScheme)
    }

    return (
        <MonacoEditor
            height="300px"
            beforeMount={setTheme}
            onMount={onMount}
            language={props.language}
            options={{
                minimap: { enabled: false },
                overviewRulerBorder: false,
                automaticLayout: true,
                quickSuggestions: {
                    other: false,
                    comments: false,
                    strings: false,
                },
            }}
            value={props.value}
            onChange={props.onChange}
        />
    )
}
