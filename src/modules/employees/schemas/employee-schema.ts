import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const TravelType = {
  CAR: 'car',
  BIKE: 'bike',
  PUBLIC: 'public',
} as const;

export type TTravelType = (typeof TravelType)[keyof typeof TravelType];

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(), // FK if needed
  name: text('name').notNull(),
  homeAddress: text('home_address').notNull(),
  travelType: text('travel_type', { enum: Object.values(TravelType) }).notNull(),
  officeDays: text('office_days').notNull(), // stored as JSON string
  distanceKm: integer('distance_km').notNull(),
  euroPerKm: integer('euro_per_km').notNull().default(21), // eurocents
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

