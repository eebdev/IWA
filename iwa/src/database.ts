import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Fr3nn$!3',
  database: 'iwa',
});

export async function query<T = any>(sql: string, values: any[] = []): Promise<any> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, values);
    return rows;
  } finally {
    connection.release();
  }
}
