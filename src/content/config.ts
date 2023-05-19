import { z, defineCollection } from 'astro:content'

const projectsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        priority: z.number(),
        maxCols: z.number().optional(),
        customColour: z.string().optional(),
        categories: z.array(z.string()),
        date: z.string(),
        liveUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
    }),
})
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    projects: projectsCollection,
}
