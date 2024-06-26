-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('changePassword', 'confirmEmail');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "is_confirmed" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Actions" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "action_type" "ActionType" NOT NULL,
    "token" TEXT NOT NULL,
    "exp_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Actions" ADD CONSTRAINT "Actions_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
