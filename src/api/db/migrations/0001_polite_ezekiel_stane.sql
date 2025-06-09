CREATE TABLE `system_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`site_name` text DEFAULT 'Notr' NOT NULL,
	`site_description` text DEFAULT 'Note taking, without the fluff' NOT NULL,
	`maintenance_mode` integer DEFAULT false NOT NULL,
	`allow_registration` integer DEFAULT true NOT NULL,
	`require_email_verification` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
