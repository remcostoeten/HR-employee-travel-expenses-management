import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const EntryType = {
  OFFICE: 'office',
  REMOTE: 'remote',
  SICK: 'sick',
  VACATION: 'vacation',
  HOLIDAY: 'holiday',
} as const;

export type TEntryType = (typeof EntryType)[keyof typeof EntryType];

export const dailyEntries = sqliteTable('daily_entries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  employeeId: text('employee_id').notNull(), // FK to employees table
  userId: text('user_id').notNull(), // FK to users table for quick access
  date: text('date').notNull(), // YYYY-MM-DD format
  entryType: text('entry_type', { enum: Object.values(EntryType) }).notNull(),
  startTime: text('start_time'), // HH:MM format (optional)
  endTime: text('end_time'), // HH:MM format (optional)
  breakMinutes: integer('break_minutes').default(0), // break time in minutes
  notes: text('notes'), // optional notes for the day
  travelCostCents: integer('travel_cost_cents').default(0), // calculated travel cost for office days
  isApproved: integer('is_approved', { mode: 'boolean' }).default(false), // for approval workflow
  approvedBy: text('approved_by'), // user ID who approved
  approvedAt: integer('approved_at', { mode: 'timestamp' }), // when approved
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Index for faster queries
export const dailyEntriesIndexes = {
  userDateIndex: 'idx_daily_entries_user_date',
  employeeDateIndex: 'idx_daily_entries_employee_date',
  dateIndex: 'idx_daily_entries_date',
};
