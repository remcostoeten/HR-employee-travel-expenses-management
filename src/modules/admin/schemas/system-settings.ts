import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const travelCostSettings = sqliteTable('travel_cost_settings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	travelType: text('travel_type', { enum: ['car', 'public', 'bike'] }).notNull(),
	euroCentsPerKm: integer('euro_cents_per_km').notNull(),
	description: text('description'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const systemSettings = sqliteTable('system_settings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	siteName: text('site_name').notNull().default('Notr'),
	siteDescription: text('site_description').notNull().default('Note taking, without the fluff'),
	maintenanceMode: integer('maintenance_mode', { mode: 'boolean' }).notNull().default(false),
	allowRegistration: integer('allow_registration', { mode: 'boolean' }).notNull().default(true),
	requireEmailVerification: integer('require_email_verification', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
});
