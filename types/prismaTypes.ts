// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT




export interface partnerLinks {
    id: string,
    partnerName: string,
    partner: partners,
    name: string,
    emoji: string,
    link: string,
}

export interface partners {
    id: string,
    name: string,
    logo: string,
    category: string,
    owner: string,
    ownerImage: string,
    ownerLink?: string,
    description: string,
    long_description: string,
    links: partnerLinks[],
}

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
    href?: string,
    jsonData?: any,
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
    applications: applications[],
    posts: posts[],
    comments: comments[],
}
