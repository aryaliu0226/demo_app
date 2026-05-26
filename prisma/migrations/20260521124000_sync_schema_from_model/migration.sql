-- Sync User with current Prisma model.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "nickname" TEXT,
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "avatar" TEXT;

UPDATE "User"
SET "nickname" = 'user-' || "id"
WHERE "nickname" IS NULL;

UPDATE "User"
SET "phone" = 'phone-' || "id"
WHERE "phone" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_nickname_key" ON "User"("nickname");
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

-- Sync Post with current Prisma model.
ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "pictures" TEXT[],
ADD COLUMN IF NOT EXISTS "video" TEXT,
ADD COLUMN IF NOT EXISTS "stars" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "Post"
SET "pictures" = ARRAY[]::TEXT[]
WHERE "pictures" IS NULL;

UPDATE "Post"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;

ALTER TABLE "Post"
ALTER COLUMN "pictures" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- Sync Comment with current Prisma model.
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Comment_postId_fkey'
    ) THEN
        ALTER TABLE "Comment"
        ADD CONSTRAINT "Comment_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "Post"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Sync PetCategory with current Prisma model.
CREATE TABLE IF NOT EXISTS "PetCategory" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "PetCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PetCategory_label_key" ON "PetCategory"("label");

-- Sync Pet with current Prisma model.
CREATE TABLE IF NOT EXISTS "Pet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "avatar" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Pet_categoryId_fkey'
    ) THEN
        ALTER TABLE "Pet"
        ADD CONSTRAINT "Pet_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES "PetCategory"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Pet_userId_fkey'
    ) THEN
        ALTER TABLE "Pet"
        ADD CONSTRAINT "Pet_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
