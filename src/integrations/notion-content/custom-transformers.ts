export const customEmbedTransformer = async (block: any) => {
    const { embed } = block as any
    if (!embed?.url) return ''
    return `import CodepenEmbed from 'src/integrations/notion-content/components/CodepenEmbed.astro'

<CodepenEmbed url="${embed?.url}" />`
}
