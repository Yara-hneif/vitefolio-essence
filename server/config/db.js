import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

// initializes a PostgreSQL database connection using the 'pg' library.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,          
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWOR,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

export default pool;

