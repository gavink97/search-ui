import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from 'mysql2/promise'
import { revalidateTag } from 'next/cache'
// import { getServerSession } from "next-auth/next"
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const REVALIDATE_TAG = 'my-api-data';

export async function GET(request: NextRequest) {
//  const session = await getServerSession(authOptions)
//  console.log('Session data in API route:', session);

 // if (!session) {
 //   return NextResponse.json({ message: 'Unauthorized' });
 // }

  try {

    const isRevalidateRequest = request.headers.get('x-revalidate') === 'true';

    if (isRevalidateRequest) {
      revalidateTag(REVALIDATE_TAG);
    }

    const connection = await createConnection({
      host: process.env.MYSQL_IP,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT): 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    
    const query = `
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path 
      FROM cl_austin
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path 
      FROM cl_houston
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path 
      FROM cl_san_antonio
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path 
      FROM cl_dallas
    `;

    const [rows] = await connection.query(query);

    await connection.end();

    return NextResponse.json({ results: rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}