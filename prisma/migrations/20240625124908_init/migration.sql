-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);
