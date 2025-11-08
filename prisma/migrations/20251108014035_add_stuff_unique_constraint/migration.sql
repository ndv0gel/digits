/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,owner]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner]` on the table `Stuff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_firstName_lastName_owner_key" ON "Contact"("firstName", "lastName", "owner");

-- CreateIndex
CREATE UNIQUE INDEX "Stuff_name_owner_key" ON "Stuff"("name", "owner");
