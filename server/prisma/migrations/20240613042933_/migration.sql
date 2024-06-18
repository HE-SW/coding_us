-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
