const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to database');

  // Drop all existing tables first
  await client.query(`
    DO $$ DECLARE r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);
  console.log('Dropped existing tables');

  // Drop views
  await client.query(`
    DO $$ DECLARE r RECORD;
    BEGIN
      FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  // Apply schema as single query
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await client.query(schema);
  console.log('Schema applied');

  // Apply seed
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  await client.query(seed);
  console.log('Seed data applied');

  // Verify
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('\nTables created:');
  res.rows.forEach(r => console.log('  -', r.table_name));

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
