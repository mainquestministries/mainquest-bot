-- CreateTable
CREATE TABLE `guildconfig` (
    `id` VARCHAR(191) NOT NULL,
    `p_channel` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `repetitions` INTEGER NOT NULL DEFAULT 2,
    `modulo` INTEGER NOT NULL DEFAULT 4,
    `disabled` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Embed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NULL,
    `swallowedId` VARCHAR(191) NOT NULL,
    `sended` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Swallowed` (
    `id` VARCHAR(191) NOT NULL,
    `channel_id` VARCHAR(191) NOT NULL,
    `message_content` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `author_avatar_url` VARCHAR(191) NOT NULL,
    `color` INTEGER NOT NULL DEFAULT 0,
    `author_id` VARCHAR(191) NOT NULL,
    `guild` VARCHAR(191) NOT NULL,
    `new_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Swallowed_new_id_key`(`new_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Embed` ADD CONSTRAINT `Embed_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Embed` ADD CONSTRAINT `Embed_swallowedId_fkey` FOREIGN KEY (`swallowedId`) REFERENCES `Swallowed`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
