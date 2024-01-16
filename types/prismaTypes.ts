// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT




export interface applications {
    creatorid: string,
    owner: users,
    name: string,
    logo: string,
    token: string,
    active: boolean,
    permissions: string[],
}

export interface plugins {
    id: number,
    postid: string,
    post: posts,
    type: string,
    href: string,
}

export interface commentPlugins {
    id: number,
    commentid: string,
    comment: comments,
    type: string,
    href: string,
}

export interface comments {
    creatorid: string,
    user: users,
    caption?: string,
    image: string,
    plugins: commentPlugins[],
    post: posts,
    postid: string,
    commentid: string,
}

export interface posts {
    userid: string,
    user: users,
    caption: string,
    image?: string,
    plugins: plugins[],
    type: number,
    postid: string,
    upvotes: string[],
    downvotes: string[],
    comments: comments[],
}

export interface users {
    name?: string,
    userid: string,
    usertag: string,
    bio: string,
    avatar: string,
    followers: string[],
    following: string[],
    badges: string[],
    coins: number,
    posts: posts[],
    applications: applications[],
    comments: comments[],
}