import { getAuth } from "@clerk/nextjs/server";

import { createPost } from '../../../lib/posts';

export default async function handler(req, res) {
    const { blocks } = JSON.parse(req.body);

    const { userId, getToken } = getAuth(req);
    const token = await getToken({
        template: 'grafbase'
    });

    console.log('userId', userId)
    console.log('token', token)
    
    try {
        const results = await createPost({
            content: JSON.stringify(blocks),
            token,
            userId
        });
        console.log('results', results)
        res.status(200).json({ results })
    } catch(e) {
        console.log('e.message', e.message)
        res.status(500).json({ error: e.message })
    }
}