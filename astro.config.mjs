// https://astro.build/config
import { defineConfig } from 'astro/config'
import notionContentImporter from './src/integrations/notion-content'

import mdx from '@astrojs/mdx'

export default defineConfig({
    integrations: [mdx(), notionContentImporter()],
    experimental: {
        assets: true,
    },
    scopedStyleStrategy: 'class',
    markdown: {
        shikiConfig: {
            theme: 'dracula-soft',
            wrap: true,
        },
    },
})
