// https://astro.build/config
import { defineConfig } from 'astro/config'
import notionContentImporter from './src/integrations/notion-content'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
    site: 'https://bengam.in',
    integrations: [
        notionContentImporter(),
        sitemap({
            filter: (page) =>
                page !== 'https://bengam.in/projects/oktoberfestgeelong/',
        }),
        mdx(),
    ],
    scopedStyleStrategy: 'class',
    markdown: {
        shikiConfig: {
            theme: 'dracula-soft',
        },
    },
})
