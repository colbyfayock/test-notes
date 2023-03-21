import { getClient } from "./grafbase";
import { gql } from '@urql/core';

export async function getPosts({ token }) {
    let data;

    try {
        const client = await getClient({ token });

        data = await client.query(gql`
            query postsByUser {
                user(by:{email:"fayock@gmail.com"}){
                id
                posts(first: 5) {
                    edges {
                        node {
                            id
                            title
                            slug
                            content
                            createdAt
                            updatedAt
                        }
                    }
                }
            }}`)
            .toPromise();
    } catch(e) {
        throw new Error(`Failed to get posts: ${e.message}`);
    }

    console.log('posts data', data)

    return data?.data?.user.posts.edges.map(({ node }) => node) || [];
}

export async function createPost({ content, token, userId }) {
    let data;

    try {
        const client = await getClient({ token });

        data = await client.mutation(gql`
            mutation create($content: String!, $userId: ID!) {
                postCreate(input: {
                    title: "My Note",
                    slug: "my-note-${Date.now()}",
                    content: $content,
                    user: {
                        link: $userId
                    }
                }) {
                    post {
                        title
                        user {
                            id
                        }
                        content
                    }
                }
            }`, {
                content: JSON.stringify(content),
                userId
            })
            .toPromise();
        if ( data.error ) {
            console.log(data.error)
            throw data.error;
        }
    } catch(e) {
        throw new Error(`Failed to create post: ${e.message}`);
    }

    console.log('data', data);

    return data?.data?.postCreate.post;
}