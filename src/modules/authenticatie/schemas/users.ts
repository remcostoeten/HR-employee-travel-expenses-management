import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const UserRole = {
	ADMIN: 'admin',
	USER: 'user',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),
	password: text('password'),
	role: text('role', { enum: ['admin', 'user'] })
		.notNull()
		.default('user'),
	name: text('name'),
	avatar: text('avatar'),
	emailVerified: integer('email_verified_at', { mode: 'timestamp' }),
	lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
});
