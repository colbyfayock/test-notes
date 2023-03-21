import { createClient, dedupExchange, cacheExchange, fetchExchange } from '@urql/core';

let client;

export async function getClient({ token }) {
    if ( typeof token !== 'string' ) {
        throw new Error('Unauthorized');
    }

    if ( !client ) {
        client = createClient({
            // url: 'http://127.0.0.1:4000/graphql',
            url: 'https://test-notes-main-colbyfayock.grafbase.app/graphql',
            exchanges: [dedupExchange, cacheExchange, fetchExchange],
            fetchOptions: () => {
                return {
                    headers: { 
                        "content-type": "application/json",
                        "x-api-key": process.env.GRAFBASE_API_KEY,
                        authorization: `Bearer ${token}`
                    },
                };
            }
        });
    }
    return client;
}