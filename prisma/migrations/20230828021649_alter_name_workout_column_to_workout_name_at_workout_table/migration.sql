/*
  Warnings:

  - You are about to drop the column `name_workout` on the `workouts` table. All the data in the column will be lost.
  - Added the required column `workout_name` to the `workouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workouts" DROP COLUMN "name_workout",
ADD COLUMN     "workout_name" TEXT NOT NULL;
