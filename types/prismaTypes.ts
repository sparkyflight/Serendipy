// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export enum botstatus {
	ONLINE = "ONLINE",
	IDLE = "IDLE",
	DND = "DND",
	OFFLINE = "OFFLINE",
}

export enum botstate {
	APPROVED = "APPROVED",
	DENIED = "DENIED",
	PENDING = "PENDING",
	BANNED = "BANNED",
}

export enum botaction {
	APPROVE = "APPROVE",
	DENY = "DENY",
	BAN = "BAN",
	VOTE_BAN = "VOTE_BAN",
	OTHER = "OTHER",
}

export interface applications {
	creatorid: string;
	owner: users;
	name: string;
	logo: string;
	token: string;
	active: boolean;
	permissions: string[];
}

export interface plugins {
	id: number;
	postid: string;
	post: posts;
	type: string;
	href: string;
}

export interface comments {
	creatorid: string;
	user: users;
	caption: string;
	image?: string;
	post: posts;
	postid: string;
	commentid: string;
}

export interface posts {
	userid: string;
	user: users;
	caption: string;
	image?: string;
	plugins: plugins[];
	type: number;
	postid: string;
	upvotes: string[];
	downvotes: string[];
	comments: comments[];
}

export interface botaudits {
	id: number;
	botid: string;
	bot: discordbots;
	staffid: string;
	action: botaction;
	reason: string;
}

export interface botcomments {
	commentid: string;
	creatorid: string;
	user: users;
	bot: discordbots;
	botid: string;
	caption: string;
	image?: string;
}

export interface discordbots {
	botid: string;
	name: string;
	description: string;
	longdescription: string;
	status: botstatus;
	state: botstate;
	auditlogs: botaudits[];
	upvotes: string[];
	downvotes: string[];
	comments: botcomments[];
	ownerid: string;
	owner: users;
}

export interface connections {
	id: string;
	userid: string;
	user: users;
	service: string;
	serviceid: string;
	servicetoken?: string;
	servicerefresh?: string;
}

export interface users {
	name?: string;
	userid: string;
	usertag: string;
	bio: string;
	avatar: string;
	followers: string[];
	following: string[];
	badges: string[];
	staff_perms: string[];
	discordbots: discordbots[];
	botcomments: botcomments[];
	connections: connections[];
	applications: applications[];
	posts: posts[];
	comments: comments[];
}
