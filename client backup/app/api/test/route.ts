import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    
    const [rows] = await connection.query('SELECT * FROM table_name');
    
    await connection.end();

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.error('Internal Server Error');
  }
}