import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import type { AstroIntegration } from 'astro'
// import { loadEnv } from 'vite'
import { getPages, generateMarkdownPages } from './utils'
import dotenv from 'dotenv'

// We must use dotenv or Vite loadEnv as Astro evaluates configs before loading .env files - https://docs.astro.build/en/guides/configuring-astro/#environment-variables

dotenv.config()

const NOTION_INTERNAL_INTEGRATION_TOKEN =
    process.env.NOTION_INTERNAL_INTEGRATION_TOKEN

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

const notionClient = new Client({
    auth: NOTION_INTERNAL_INTEGRATION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient })

export default function (): AstroIntegration {
    return {
        name: 'notionContentImporter',
        hooks: {
            'astro:server:setup': async () => {
                console.log('integration running')
                if (NOTION_DATABASE_ID) {
                    const pages = await getPages(
                        NOTION_DATABASE_ID,
                        notionClient
                    )

                    generateMarkdownPages(pages, n2m)
                } else {
                    throw new Error('NOTION_DATABASE_IS is undefined')
                }
            },
        },
    }
}
