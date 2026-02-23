import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'navsa_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create a connection pool
let pool: mysql.Pool;

// Initialize the connection pool
function initializePool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    pool.getConnection()
      .then(connection => {
        console.log('✅ MySQL database connected successfully');
        connection.release();
      })
      .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
        process.exit(1);
      });
  }
  return pool;
}

// Export the pool instance
export const db = {
  // Initialize database connection
  init: () => initializePool(),
  
  // Get a connection from the pool
  getConnection: () => {
    const poolInstance = initializePool();
    return poolInstance.getConnection();
  },
  
  // Execute a query with parameters
  query: async <T = any>(sql: string, params?: any[]): Promise<T[]> => {
    const poolInstance = initializePool();
    try {
      const [rows] = await poolInstance.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  // Execute a query and return the first result
  queryOne: async <T = any>(sql: string, params?: any[]): Promise<T | null> => {
    const results = await db.query<T>(sql, params);
    return results[0] || null;
  },
  
  // Execute an INSERT query and return the insert ID
  insert: async (sql: string, params?: any[]): Promise<number> => {
    const poolInstance = initializePool();
    try {
      const [result] = await poolInstance.execute(sql, params);
      return (result as mysql.ResultSetHeader).insertId;
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },
  
  // Execute an UPDATE query and return affected rows
  update: async (sql: string, params?: any[]): Promise<number> => {
    const poolInstance = initializePool();
    try {
      const [result] = await poolInstance.execute(sql, params);
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  },
  
  // Execute a DELETE query and return affected rows
  delete: async (sql: string, params?: any[]): Promise<number> => {
    const poolInstance = initializePool();
    try {
      const [result] = await poolInstance.execute(sql, params);
      return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  },
  
  // Execute a transaction
  transaction: async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
    const poolInstance = initializePool();
    const connection = await poolInstance.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // Close the pool (for graceful shutdown)
  close: async () => {
    if (pool) {
      await pool.end();
      console.log('✅ MySQL connection pool closed');
    }
  },
};

// Initialize on import
db.init();

// Types for type safety
export interface QueryResult<T = any> {
  rows: T[];
  fields?: mysql.FieldPacket[];
}

export interface InsertResult {
  insertId: number;
  affectedRows: number;
}

export interface UpdateResult {
  affectedRows: number;
  changedRows: number;
}

export interface DeleteResult {
  affectedRows: number;
}