-- AlterTable
ALTER TABLE "User"
ADD COLUMN "nickname" TEXT NOT NULL DEFAULT 'user';

-- AddCheck
ALTER TABLE "User"
ADD CONSTRAINT "User_nickname_min_length_check"
CHECK (char_length("nickname") >= 2);
