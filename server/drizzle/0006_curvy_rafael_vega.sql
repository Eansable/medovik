CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`cake_name` varchar(255) NOT NULL,
	`weight` double NOT NULL,
	`unit_price` double NOT NULL,
	`final_price` double NOT NULL,
	`cake_id` int,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`delivery_type` varchar(20) NOT NULL,
	`pickup_place` varchar(255),
	`address` varchar(500),
	`delivery_date` varchar(20) NOT NULL,
	`delivery_time` varchar(50) NOT NULL,
	`total_price` double NOT NULL,
	`delivery_multiplier` double NOT NULL DEFAULT 1,
	`status` varchar(20) NOT NULL DEFAULT 'new',
	`source` varchar(50) DEFAULT 'mobile',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_cake_id_cakes_id_fk` FOREIGN KEY (`cake_id`) REFERENCES `cakes`(`id`) ON DELETE set null ON UPDATE no action;