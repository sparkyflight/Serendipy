-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "creatorid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "permissions" JSON DEFAULT '["global.*"]',
    "createdat" TIMESTAMPTZ(6),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onlyfoodz_posts" (
    "id" SERIAL NOT NULL,
    "userid" VARCHAR(255),
    "caption" VARCHAR(255),
    "image" VARCHAR(255),
    "plugins" JSON,
    "createdat" TIMESTAMPTZ(6),
    "postid" VARCHAR(255),
    "upvotes" JSON,
    "downvotes" JSON,
    "comments" JSON,

    CONSTRAINT "onlyfoodz_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "userid" VARCHAR(255),
    "caption" VARCHAR(255),
    "image" VARCHAR(255),
    "plugins" JSON,
    "createdat" TIMESTAMPTZ(6),
    "postid" VARCHAR(255),
    "upvotes" JSON,
    "downvotes" JSON,
    "comments" JSON,

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
    "createdat" TIMESTAMPTZ(6),
    "followers" JSON,
    "following" JSON,
    "badges" JSON,
    "coins" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_token_key" ON "applications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "onlyfoodz_posts_postid_key" ON "onlyfoodz_posts"("postid");

-- CreateIndex
CREATE UNIQUE INDEX "posts_postid_key" ON "posts"("postid");

