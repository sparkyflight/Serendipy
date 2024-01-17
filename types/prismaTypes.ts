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

export interface comments {
    creatorid: string,
    user: users,
    caption: string,
    image?: string,
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

export interface connections {
    id: string,
    userid: string,
    user: users,
    service: string,
    serviceid: string,
    servicetoken?: string,
    servicerefresh?: string,
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
    staff_perms: string[],
    connections: connections[],
    posts: posts[],
    applications: applications[],
    comments: comments[],
}
