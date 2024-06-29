/*
  Warnings:

  - You are about to drop the column `parent_id` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,parent_folder_id]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parent_folder_id` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parent_id_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parent_id",
ADD COLUMN     "is_root" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_folder_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "parent_folder_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_parent_folder_id_key" ON "Folder"("name", "parent_folder_id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
