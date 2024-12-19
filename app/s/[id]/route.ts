import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation'


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const sql = neon(`${process.env.DATABASE_URL}`);
  const result = await sql`SELECT original_url FROM url WHERE id = ${id}`;

  const originalUrl = result[0].original_url;

  if (originalUrl) {
    redirect(originalUrl)
  } else {
    redirect('/')
  }
}