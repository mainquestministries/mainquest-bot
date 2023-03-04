-- CreateTable
CREATE TABLE `Swallowed` (
    `id` VARCHAR(191) NOT NULL,
    `message_content` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `guild` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
