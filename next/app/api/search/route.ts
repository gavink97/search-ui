import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from 'mysql2/promise'
import { revalidateTag } from 'next/cache'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/components/auth/auth-config'

const REVALIDATE_TAG = 'my-api-data';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log('Session data in API route:', session);
// remove !session when working on mobile
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' });
  }

  try {

    const isRevalidateRequest = request.headers.get('x-revalidate') === 'true';

    if (isRevalidateRequest) {
      revalidateTag(REVALIDATE_TAG);
    }

    const connection = await createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT): 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const query = `
    SELECT
    l.id,
    l.time_added,
    l.title,
    l.price,
    l.post_timestamp,
    l.location,
    l.post_url,
    l.data_pid,
    l.is_new,
    c.cloudinary_link,
    GROUP_CONCAT(s.source) AS sources
    FROM
    listings l
    LEFT JOIN
    cloudinary c ON l.id = c.data_pid_id
    LEFT JOIN
    data_sources ds ON l.id = ds.data_pid_id
    LEFT JOIN
    sources s ON ds.source_id = s.id
    GROUP BY
    l.id,  l.time_added, l.title, l.price, l.post_timestamp, l.location, l.post_url, l.data_pid, l.is_new
    `;

    const [rows] = await connection.query(query);

    await connection.end();

    return NextResponse.json({ results: rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
