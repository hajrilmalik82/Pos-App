-- AlterTable
ALTER TABLE `user` ADD COLUMN `canAccessMaster` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canAccessReport` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canAccessTransaksi` BOOLEAN NOT NULL DEFAULT false;
