import { nanoid } from 'nanoid';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
    try {
        const { url } = await req.json()
        
        if (!url) {
          return new Response(JSON.stringify({ error: 'URL is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
    
        try {
          new URL(url)
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid URL' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
    
        const id = nanoid(8)
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/s/${id}`

        const sql = neon(`${process.env.DATABASE_URL}`);

        await sql('INSERT INTO url (id, original_url) VALUES ($1, $2)', [id, url]);
        
        return new Response(JSON.stringify({ shortUrl }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (error) {
        console.error('Error in POST /api/shorten:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
}