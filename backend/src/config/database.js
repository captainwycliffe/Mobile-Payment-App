const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { logger } = require('../utils/logger');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../database.sqlite');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Database connection failed:', err);
        throw err;
      }
      logger.info('Connected to SQLite database');
      // Enable foreign keys
      this.db.run('PRAGMA foreign_keys = ON');
      this.initializeTables();
    });
  }

  initializeTables() {
    // Create tables in sequence to handle dependencies
    this.createUsersTable()
      .then(() => this.createTransactionsTable())
      .then(() => this.seedInitialData())
      .catch(err => {
        logger.error('Error initializing tables:', err);
      });
  }

  createUsersTable() {
    return new Promise((resolve, reject) => {
      const createUsersSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT CHECK(role IN ('psp', 'dev')) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createUsersSQL, (err) => {
        if (err) {
          logger.error('Error creating users table:', err);
          reject(err);
        } else {
          logger.info('Users table created/verified');
          resolve();
        }
      });
    });
  }

  createTransactionsTable() {
    return new Promise((resolve, reject) => {
      const createTransactionsSQL = `
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          recipient TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          currency TEXT NOT NULL DEFAULT 'USD',
          status TEXT DEFAULT 'completed',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `;

      this.db.run(createTransactionsSQL, (err) => {
        if (err) {
          logger.error('Error creating transactions table:', err);
          reject(err);
        } else {
          logger.info('Transactions table created/verified');
          resolve();
        }
      });
    });
  }

  seedInitialData() {
    const self = this; // Store reference to this
    
    return new Promise((resolve, reject) => {
      // Check if users exist
      this.db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
          logger.error('Error checking users:', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          logger.info('Seeding initial data...');
          
          // Create sample users with hashed passwords
          const pspPassword = bcrypt.hashSync('password123', 10);
          const devPassword = bcrypt.hashSync('password123', 10);

          const insertUsersSQL = `
            INSERT INTO users (email, password, role) VALUES 
            (?, ?, 'psp'),
            (?, ?, 'dev')
          `;

          self.db.run(insertUsersSQL, [
            'psp@example.com', pspPassword,
            'dev@example.com', devPassword
          ], function(err) {
            if (err) {
              logger.error('Error seeding users:', err);
              reject(err);
              return;
            }
            
            logger.info('Demo users created successfully');
            
            // Add sample transactions
            const transactions = [
              [1, 'Alice Johnson', 250.00, 'USD'],
              [1, 'Bob Smith', 150.75, 'USD'],
              [1, 'Carol Davis', 320.50, 'USD'],
              [2, 'API Gateway', 50.00, 'USD'],
              [2, 'Cloud Services', 125.99, 'USD']
            ];

            const insertTransactionSQL = `
              INSERT INTO transactions (user_id, recipient, amount, currency) 
              VALUES (?, ?, ?, ?)
            `;

            let completed = 0;
            const totalTransactions = transactions.length;

            if (totalTransactions === 0) {
              logger.info('No transactions to seed');
              resolve();
              return;
            }

            transactions.forEach((transaction, index) => {
              self.db.run(insertTransactionSQL, transaction, function(transactionErr) {
                if (transactionErr) {
                  logger.error(`Error inserting transaction ${index}:`, transactionErr);
                } else {
                  logger.info(`Transaction ${index + 1} created successfully`);
                }
                
                completed++;
                if (completed === totalTransactions) {
                  logger.info('Sample transactions created successfully');
                  logger.info('Database seeded with initial data');
                  resolve();
                }
              });
            });
          });
        } else {
          logger.info('Database already contains data, skipping seed');
          resolve();
        }
      });
    });
  }

  getDb() {
    return this.db;
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
        } else {
          logger.info('Database connection closed');
        }
        resolve();
      });
    });
  }
}

const database = new Database();
const db = database.getDb();

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Closing database connection...');
  database.close().then(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Closing database connection...');
  database.close().then(() => {
    process.exit(0);
  });
});

module.exports = { db, database };