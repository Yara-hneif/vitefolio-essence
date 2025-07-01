import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

// initializes a PostgreSQL database connection using the 'pg' library.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

export default pool;

