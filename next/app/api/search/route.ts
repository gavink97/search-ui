import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from 'mysql2/promise'
import { revalidateTag } from 'next/cache'
 import { getServerSession } from "next-auth/next"
 import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const REVALIDATE_TAG = 'my-api-data';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log('Session data in API route:', session);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' });
  }

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
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_austin
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_houston
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_san_antonio
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_dallas
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_abilene
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_beaumont
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_brownsville
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_college_station
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_corpus_christi
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_deep_east
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_del_rio
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_east_texas
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_galveston
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_killeen
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_lafayette
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_lake_charles
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_laredo
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_lawton
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_mcallen
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_odessa
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_oklahoma_city
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_san_angelo
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_san_marcos
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_shreveport
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_texarkana
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_texoma
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_victoria
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_waco
      UNION
      SELECT id, title, price, source, post_timestamp, location, post_url, image_path, data_pid
      FROM cl_wichita_falls
    `;

    const [rows] = await connection.query(query);

    await connection.end();

    return NextResponse.json({ results: rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}