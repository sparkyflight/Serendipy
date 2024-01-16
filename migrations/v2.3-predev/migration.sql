-- CreateTable
CREATE TABLE "applications" (
    "creatorid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL DEFAULT '/logo.png',
    "token" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "permissions" TEXT[] DEFAULT ARRAY['global.*']::TEXT[]
);

-- CreateTable
CREATE TABLE "plugins" (
    "id" SERIAL NOT NULL,
    "postid" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "href" VARCHAR(255) NOT NULL,

    CONSTRAINT "plugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentPlugins" (
    "id" SERIAL NOT NULL,
    "commentid" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "href" VARCHAR(255) NOT NULL,

    CONSTRAINT "commentPlugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "creatorid" VARCHAR(255) NOT NULL,
    "caption" VARCHAR(255),
    "image" VARCHAR(255) NOT NULL,
    "postid" VARCHAR(255) NOT NULL,
    "commentid" VARCHAR(255) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("commentid")
);

-- CreateTable
CREATE TABLE "posts" (
    "userid" VARCHAR(255) NOT NULL,
    "caption" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "type" INTEGER NOT NULL,
    "postid" VARCHAR(255) NOT NULL,
    "upvotes" TEXT[],
    "downvotes" TEXT[],

    CONSTRAINT "posts_pkey" PRIMARY KEY ("postid")
);

-- CreateTable
CREATE TABLE "users" (
    "name" VARCHAR(255),
    "userid" VARCHAR(255) NOT NULL,
    "usertag" VARCHAR(255) NOT NULL,
    "bio" VARCHAR(255) NOT NULL DEFAULT 'None',
    "avatar" VARCHAR(255) NOT NULL DEFAULT '/logo.png',
    "followers" TEXT[],
    "following" TEXT[],
    "badges" TEXT[],
    "coins" INTEGER NOT NULL DEFAULT 200,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_token_key" ON "applications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "comments_commentid_key" ON "comments"("commentid");

-- CreateIndex
CREATE UNIQUE INDEX "posts_postid_key" ON "posts"("postid");

-- CreateIndex
CREATE UNIQUE INDEX "users_userid_key" ON "users"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "users_usertag_key" ON "users"("usertag");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_creatorid_fkey" FOREIGN KEY ("creatorid") REFERENCES "users"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugins" ADD CONSTRAINT "plugins_postid_fkey" FOREIGN KEY ("postid") REFERENCES "posts"("postid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentPlugins" ADD CONSTRAINT "commentPlugins_commentid_fkey" FOREIGN KEY ("commentid") REFERENCES "comments"("commentid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_creatorid_fkey" FOREIGN KEY ("creatorid") REFERENCES "users"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postid_fkey" FOREIGN KEY ("postid") REFERENCES "posts"("postid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

