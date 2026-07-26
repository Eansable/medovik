CREATE TABLE `cake_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cake_id` int NOT NULL,
	`weight` double NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `cake_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cakes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`image` varchar(500),
	`color` varchar(20),
	`max_weight` double,
	`min_weight` double,
	CONSTRAINT `cakes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`phone` varchar(20),
	`role` varchar(20) NOT NULL DEFAULT 'customer',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `cake_prices` ADD CONSTRAINT `cake_prices_cake_id_cakes_id_fk` FOREIGN KEY (`cake_id`) REFERENCES `cakes`(`id`) ON DELETE cascade ON UPDATE no action;