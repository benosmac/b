import { Client, isFullPage } from '@notionhq/client'
import matter from 'gray-matter'
import * as fs from 'node:fs/promises'
import type {
    PageObjectResponse,
    PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type {
    PropertiesObjectInPageResponse,
    PropertyInPropertiesObject,
} from './types'
import type { NotionToMarkdown } from 'notion-to-md'
import { customEmbedTransformer } from './custom-transformers'

const POSTS_DIR = './src/content/articles'
/* 
Retrives all pages from a Notion database
    @params: 
        DbId - ID of the database
        notionClient - An instance of the Notion Client (created with New Client({auth: your-integration-secret}))
    @retuns: An array of PageObjectResponse or PartialPageObjectResponse objects
*/
export async function getPages(DbId: string, notionClient: Client) {
    const response = await notionClient.databases.query({
        database_id: DbId,
    })
    return response.results
}

/* 
Generates the full content of a Markdown page from the PageObjectResponse and writes it to the src/content/articles directory
TODO: Use DB name as folder name
TODO: Add check for existing file, if exists compare last_edited_time before overwriting
*/
export async function generateMarkdownPages(
    pages: PageObjectResponse[] | PartialPageObjectResponse[],
    n2m: NotionToMarkdown
) {
    for (const page of pages) {
        //console.log(page)
        if (!isFullPage(page)) {
            continue
        }
        const newOrUpdated = await isPageNewOrUpdated(page)
        if (!newOrUpdated) {
            console.log('skipping page')
            continue
        }
        // Get the slug to use in the file name
        const slug = await getPropertyValue(page.properties.slug)
        n2m.setCustomTransformer('embed', customEmbedTransformer)
        // Returns all blocks within the page in Markdown format
        const mdblocks = await n2m.pageToMarkdown(page.id)
        console.log(page)
        // Dump all markdown blocks into a single string
        const mdString = n2m.toMarkdownString(mdblocks)

        // Generate a object representing the frontmatter for the page
        // This will use the page.properties object as the source, so Zod types in content/config.ts need to match
        const frontmatter = await getFrontmatter(page)

        // const fmMdStr = [frontmatter, '---', mdString.parent].join('')
        const fmMdStr = matter.stringify(mdString.parent, frontmatter)
        const filename = `${POSTS_DIR}/${slug}.mdx`

        fs.writeFile(filename, fmMdStr)
    }
}

/* 
Checks whether page already exists. If it does, compare the last_edited_time timestamps to check whether local version should be updated
    @params: page
    @returns: boolean
TODO: cache result if page exists
 */
async function isPageNewOrUpdated(page: PageObjectResponse) {
    const slug = await getPropertyValue(page.properties.slug)
    const file = `${POSTS_DIR}/${slug}.mdx`
    console.log(file)

    try {
        await fs.access(file, fs.constants.F_OK)
        console.log('file exists')
        const last_edited_time = Date.parse(
            await getPropertyValue(page.properties.last_edited_time)
        )
        const local_last_edited_time = Date.parse(
            matter.read(file).data.last_edited_time
        )
        if (last_edited_time > local_last_edited_time) {
            console.log('newer version available')
            return true
        } else {
            console.log('no newer version available')
            return false
        }
    } catch {
        console.log('file does not exist')
        return true
    }
}

/* 
Gets the actual value of a Notion Page Property in a PageObjectResponse
    @params: 
        propertyObj: a single property object from PageObjectResponse.properties
    @returns: The value of the property
    @return type: string | array | number | bool
*/
async function getPropertyValue(propertyObj: PropertyInPropertiesObject) {
    const propertyType = propertyObj.type as keyof typeof propertyObj
    const propertyValue: any = propertyObj[propertyType]
    // TODO: Add more types
    switch (propertyObj.type) {
        case 'title':
            return propertyValue[0].plain_text
        case 'rich_text':
            return propertyValue[0].plain_text
        case 'multi_select':
            return propertyValue.map((item: any) => item.name)
        case 'created_time':
            return propertyValue
        case 'last_edited_time':
            return propertyValue
        case 'created_by':
            return propertyValue.name
        case 'checkbox':
            return propertyValue
    }
}

/* 
Generates a object containing frontmatter key: value pairs, based on the  PageObjectResponse.properties 
    @params
        pageObjectResponse: A full page object returned by notion.databases.query()
*/
async function getFrontmatter(page: PageObjectResponse) {
    //Typeguard to make sure we're dealing with a page from a database
    if (page.parent.type !== 'database_id') {
        return
    }

    const properties: PropertiesObjectInPageResponse = page.properties
    const frontmatter: any = {}

    for (const propertyKey in properties) {
        const propertyObj: PropertyInPropertiesObject = properties[propertyKey]
        const propertyName = propertyKey as keyof typeof frontmatter
        const propertyValue = await getPropertyValue(propertyObj)
        frontmatter[propertyName] = propertyValue
    }
    // const frontmatterYaml = matter.stringify(mdString, frontmatter)
    return frontmatter
}
