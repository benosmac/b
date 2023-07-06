import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

/* 
These types are required because the PropertyItemObjectResponse & PropertyItemListResponse provided by the Notion client are for the objects returned by: 
notion.pages.properties.retrieve({ page_id: pageId, property_id: propertyId})   

This integration uses the page.properties object returned by notion.databases.query(), which omits the 'object' property
*/
export type PropertiesObjectInPageResponse = PageObjectResponse['properties']

export type PropertyInPropertiesObject =
    PropertiesObjectInPageResponse[keyof PropertiesObjectInPageResponse]
