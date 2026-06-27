import sequelize from '../config/database';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Add new columns to users table
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN status ENUM('pending', 'active') DEFAULT 'active',
      ADD COLUMN permissions JSON,
      ADD COLUMN activation_token VARCHAR(255) DEFAULT NULL;
    `);

    // Ensure the default admin gets all permissions (if needed) or at least sets empty array safely
    await sequelize.query(`
      UPDATE users SET permissions = JSON_ARRAY() WHERE permissions IS NULL;
    `);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
