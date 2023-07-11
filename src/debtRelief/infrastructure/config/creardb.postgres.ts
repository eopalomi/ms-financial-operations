import { Pool } from 'pg';

export class crearDbPostgresDatabase {
  private static connection: Pool;

  static getConnection() {
    if (!this.connection) {
      return new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    }

    return this.connection;
  }
}