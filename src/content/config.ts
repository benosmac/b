import { z, defineCollection } from 'astro:content'
import { projectSchema, articleSchema } from 'src/lib/schema'

const projectsCollection = defineCollection({
    schema: projectSchema,
})
const articlesCollection = defineCollection({
    schema: articleSchema,
})

export const collections = {
    projects: projectsCollection,
    articles: articlesCollection,
}
