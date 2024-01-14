-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "creatorid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "permissions" JSON DEFAULT '["global.*"]',
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "creatorid" VARCHAR(255),
    "caption" VARCHAR(255),
    "image" VARCHAR(255),
    "plugins" JSON,
    "postId" INTEGER,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "userid" VARCHAR(255),
    "caption" VARCHAR(255),
    "image" VARCHAR(255),
    "plugins" JSON,
    "type" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "postid" VARCHAR(255),
    "upvotes" JSON,
    "downvotes" JSON,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "userid" VARCHAR(255),
    "usertag" VARCHAR(255),
    "bio" VARCHAR(255),
    "avatar" VARCHAR(255),
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "followers" JSON,
    "following" JSON,
    "badges" JSON,
    "coins" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_token_key" ON "applications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "posts_postid_key" ON "posts"("postid");

-- CreateIndex
CREATE UNIQUE INDEX "users_userid_key" ON "users"("userid");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_creatorid_fkey" FOREIGN KEY ("creatorid") REFERENCES "users"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_creatorid_fkey" FOREIGN KEY ("creatorid") REFERENCES "users"("userid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE SET NULL ON UPDATE CASCADE;

