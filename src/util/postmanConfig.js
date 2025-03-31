export const postmanConfig = {
    info: {
        name: "Hakim Livs",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [],
    variable: [
        {key: 'base_url', value: 'https://webshop-2025-be-g1-blush.vercel.app'}
    ]
}

/**
 * @typedef PostmanConfigRouteOptions
 * @property {string} name
 * @property {string} method
 * @property {string} url 
 * @property {Record<string, string>} body
 */

/**
 * @param {PostmanConfigRouteOptions} options 
 */
export const documentRoute = (options) => {
    const route = {
        name: options.name,
        request: {
            method: options.method,
            url: {
                raw: `{{base_url}}${options.url}`,
                host: ["{{base_url}}"],
                path: options.url.slice(1)
            },
            header: [
                {key: 'Content-Type', value: 'application/json'},
                {key: 'x-dev-api-key', value: 'jonatan'}
            ],
        }
    }

    if (options.body) {
        route.request.body = {
            mode: "raw",
            raw: JSON.stringify(option.body, null, 2)
        }
    }

    postmanConfig.item.push(route)
}