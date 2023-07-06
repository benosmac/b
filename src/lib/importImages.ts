import type { ImageMetadata } from 'astro'

// Params
// folder : name of the folder within assets/images directory
// fileName : name of the file to import (without extension)
//Note: File must be a .jpg image
//Returns an ImageMetadata object for use in Astro <Image> and getImage()
export async function ImportImage(folder: string, fileName: string) {
    const img: ImageMetadata = (
        await import(`./../assets/images/${folder}/${fileName}.jpg`)
    ).default
    return img
}

// Params
// folder : name of the folder within assets/images directory
// exclude : optionally exclude any files with a specified string in the path
//Returns an array of ImageMetadata objects for use in Astro <Image> and getImage()
export async function ImportAllImages(folder: string, exclude?: string) {
    const filterSrcString = `/images/${folder}`

    // Use Vite's import.meta.glob() to get all the .jpg images in the assets. We need to get them all, then filter them later, as import.meta.glob() does not support variables in the query string.
    const allImages: Array<string> = Object.keys(
        import.meta.glob('/src/assets/images/**/*.jpg', {
            as: 'url',
        })
    )
    // Filter the allImages array returned by import.meta.glob() to get only the images in given folder
    // Then we trim everything except the folder and file name (including the extension)
    const filteredImages: Array<string> = allImages
        .filter((imagePath) =>
            exclude
                ? imagePath.includes(filterSrcString) &&
                  !imagePath.includes(exclude)
                : imagePath.includes(filterSrcString)
        )
        .map((imagePath) =>
            imagePath.replace('.jpg', '').replace('/src/assets/images/', '')
        )
    // Import all the images as ImageMetadata objects and return them in a new array
    // Split up the path to get around dynamic import limitations
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    const imageImports: Array<ImageMetadata> = await Promise.all(
        filteredImages.map(async (image: string) => {
            const pathSegments = image.split('/')
            const img = await import(
                `../assets/images/${pathSegments[0]}/${pathSegments[1]}.jpg`
            )
            return img.default
        })
    )
    return imageImports
}
