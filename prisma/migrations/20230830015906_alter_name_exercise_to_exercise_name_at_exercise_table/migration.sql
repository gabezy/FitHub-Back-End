/*
  Warnings:

  - You are about to drop the column `name_exercise` on the `exercises` table. All the data in the column will be lost.
  - Added the required column `exercise_name` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "name_exercise",
ADD COLUMN     "exercise_name" TEXT NOT NULL;
