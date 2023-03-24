// Importeer de benodigde mysql2/promise module
import mysql from 'mysql2/promise';

/**
 * Creëer een MySQL-verbinding pool met behulp van de configuratie uit
 * de omgevingsvariabelen.
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

/**
 * Voert een MySQL-query uit met behulp van de opgegeven SQL-string en waarden, en retourneert de resultaten.
 * @param {string} sql - De SQL-query string.
 * @param {any[]} [values=[]] - Een optionele array met waarden die in de query moeten worden ingevoegd.
 * @returns {Promise<any>} - Een Promise die resulteert in de queryresultaten.
 */
export async function query<T = any>(sql: string, values: any[] = []): Promise<any> {
  // Verkrijg een verbinding uit de pool
  const connection = await pool.getConnection();
  try {
    // Voer de query uit met behulp van de opgegeven SQL-string en waarden
    const [rows] = await connection.query<T>(sql, values);
    // Retourneer de queryresultaten
    return rows;
  } catch (error) {
    // Log de fout en gooi de fout opnieuw om te worden afgehandeld door de aanroepende functie
    console.error('Database query error:', error);
    throw error;
  } finally {
    // Geef de verbinding terug aan de pool
    connection.release();
  }
}
