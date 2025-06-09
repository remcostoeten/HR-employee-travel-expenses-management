import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const oauthAccounts = sqliteTable(
	'oauth_accounts',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		accessToken: text('access_token').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [unique().on(table.provider, table.providerAccountId)]
);
