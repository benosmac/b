import { z, defineCollection } from 'astro:content'

const projectsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        priority: z.number(),
        maxCols: z.number().optional().default(2),
        customColour: z.string().optional().default('rgb(211, 235, 224)'),
        categories: z.array(z.string()),
        date: z.string(),
        liveUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        videos: z.array(z.string()).optional(),
    }),
})
const articlesCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        date: z.string(),
        last_edited_time: z.string(),
        published: z.boolean(),
        description: z.string(),
        created_by: z.string(),
        image: z.string().default('no-image'),
    }),
})

export const collections = {
    projects: projectsCollection,
    articles: articlesCollection,
}
