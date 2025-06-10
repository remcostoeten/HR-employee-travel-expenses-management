CREATE TABLE `travel_cost_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`travel_type` text NOT NULL,
	`euro_cents_per_km` integer NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`home_address` text NOT NULL,
	`travel_type` text NOT NULL,
	`office_days` text NOT NULL,
	`distance_km` integer NOT NULL,
	`euro_per_km` integer DEFAULT 21 NOT NULL,
	`custom_euro_per_km` integer,
	`custom_agreement_notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
