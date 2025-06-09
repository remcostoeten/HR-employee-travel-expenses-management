import { exec as execCallback } from 'child_process';
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@libsql/client';
import readline from 'readline';
import { promisify } from 'util';
import { env } from 'env';

// Promisify exec
const exec = promisify(execCallback);

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function pushChangesToDatabase() {
	try {
		console.log('\nGenerating schema changes...');
		const { stdout: genOutput } = await exec('pnpm drizzle-kit generate');
		console.log(genOutput);

		console.log('\nPushing changes to database...');
		const { stdout: pushOutput } = await exec('pnpm drizzle-kit push');
		console.log(pushOutput);

		console.log('\n✅ Successfully updated database schema');
	} catch (error: any) {
		console.error('\n❌ Failed to update database schema:', error.message);
		throw error;
	}
}

async function clearTables() {
	console.log('Connecting to database...');
	// Create a client connection to Turso
	const client = createClient({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	});

	try {
		console.log('WARNING: This script will drop ALL tables in your database.');

		// Ask for confirmation
		const answer = await new Promise((resolve) => {
			rl.question('Are you absolutely sure you want to proceed? (yes/no): ', resolve);
		});

		if ((answer as string).toLowerCase() !== 'yes') {
			console.log('Operation cancelled.');
			return;
		}

		console.log('Fetching table names...');
		// Get all table names from SQLite
		try {
			const result = await client.execute(`
		SELECT name FROM sqlite_master 
		WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'drizzle_%'
		`);

			const tables = result.rows.map((row) => row.name as string);
			console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);

			if (tables.length === 0) {
				console.log('No tables found in the database.');
				return;
			}

			// Drop tables without transaction for simplicity
			console.log('Dropping tables...');
			for (const table of tables) {
				console.log(`Dropping table: ${table}...`);
				await client.execute(`DROP TABLE IF EXISTS "${table}"`);
				console.log(`Dropped table: ${table}`);
			}

			console.log('\n✅ Successfully cleared all tables from the database.');

			// Ask if they want to push the schema changes
			const pushAnswer = await new Promise((resolve) => {
				rl.question('\nDo you want to recreate the database schema? (yes/no): ', resolve);
			});

			if ((pushAnswer as string).toLowerCase() === 'yes') {
				await pushChangesToDatabase();
			} else {
				console.log('\nSkipping schema recreation. Your database is now empty.');
			}
		} catch (queryError) {
			console.error('Error executing query:', queryError);
			throw queryError;
		}
	} catch (error) {
		console.error('Error clearing tables:', error);
		process.exit(1);
	} finally {
		console.log('Closing database connection...');
		await client.close();
		rl.close();
	}
}

// Run the script
clearTables().catch((error) => {
	console.error('Failed to clear tables:', error);
	process.exit(1);
});
