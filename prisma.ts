import { PrismaClient, commentPlugins } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Users
class Users {
	static async createUser(
		name: string,
		userid: string,
		usertag: string,
		bio: string,
		avatar: string
	) {
		try {
			await prisma.users.create({
				data: {
					name: name,
					userid: userid,
					usertag: usertag,
					bio: bio,
					avatar: avatar,
					followers: [],
					following: [],
					badges: [],
					coins: 200,
				},
			});

			return true;
		} catch (error) {
			return error;
		}
	}

	static async get(data: any) {
		const doc = await prisma.users.findUnique({
			where: data,
			include: {
				posts: true,
				applications: false,
			},
		});

		if (!doc) return null;
		else return doc;
	}

	static async find(data: any) {
		const docs = await prisma.users.findMany({
			where: data,
			include: {
				posts: true,
				applications: false,
			},
		});

		return docs;
	}

	static async updateUser(id: string, data: object) {
		try {
			await prisma.users.update({
				where: {
					userid: id,
				},
				data: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async delete(data: any) {
		try {
			await prisma.users.delete({
				where: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async follow(UserID: string, Target: string) {
		try {
			const user = await prisma.users.findUnique({
				where: {
					userid: UserID,
				},
			});

			const target = await prisma.users.findUnique({
				where: {
					userid: Target,
				},
			});

			let following = user.following;
			following.push(Target);

			let followers = target.followers;
			followers.push(UserID);

			await prisma.users.update({
				where: {
					userid: UserID,
				},
				data: {
					following: following,
				},
			});

			await prisma.users.update({
				where: {
					userid: Target,
				},
				data: {
					followers: followers,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async unfollow(UserID: string, Target: string) {
		try {
			const user = await prisma.users.findUnique({
				where: {
					userid: UserID,
				},
			});

			const target = await prisma.users.findUnique({
				where: {
					userid: Target,
				},
			});

			let following = user.following;
			following = following.filter((p) => p !== Target);

			let followers = target.followers;
			followers = followers.filter((p) => p !== UserID);

			await prisma.users.update({
				where: {
					userid: UserID,
				},
				data: {
					following: following,
				},
			});

			await prisma.users.update({
				where: {
					userid: Target,
				},
				data: {
					followers: followers,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}
}

// Posts
class Posts {
	static async createPost(
		userid: string,
		caption: string,
		type: number,
		image: string
	) {
		try {
			await prisma.posts.create({
				data: {
					userid: userid,
					caption: caption,
					type: type,
					image: image,
					postid: crypto.randomUUID(),
					upvotes: [],
					downvotes: [],
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async get(PostID: string) {
		let post = await prisma.posts.findUnique({
			where: {
				postid: PostID,
			},
			include: {
				user: true,
				comments: {
                    include: {
                        user: true,
                        plugins: true
                    }
                },
				plugins: true,
			},
		});

		if (post) return post;
		else return null;
	}

	static async find(data: object) {
		const docs = await prisma.posts.findMany({
			where: {
				...data,
			},
			include: {
				user: true,
				comments: true,
				plugins: true,
			},
		});

		return docs;
	}

	static async listAllPosts() {
		const docs = await prisma.posts.findMany({
			include: {
				user: true,
				comments: true,
				plugins: true,
			},
		});
		return docs;
	}

	static async updatePost(id: string, data: any) {
		try {
			await prisma.posts.update({
				where: {
					postid: id,
				},
				data: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async getAllUserPosts(UserID: string) {
		const docs = await prisma.posts.findMany({
			where: { userid: UserID },
			include: {
				user: true,
				comments: true,
				plugins: true,
			},
		});
		return docs;
	}

	static async delete(PostID: string) {
		try {
			await prisma.posts.delete({
				where: {
					postid: PostID,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async upvote(PostID: string, UserID: string) {
		try {
			let post = await Posts.get(PostID);
			post.upvotes.push(UserID);

			const result = await Posts.updatePost(PostID, {
				upvotes: post.upvotes,
			});
			return result;
		} catch (err) {
			return err;
		}
	}

	static async downvote(PostID: string, UserID: string) {
		try {
			let post = await Posts.get(PostID);
			post.downvotes.push(UserID);

			const result = await Posts.updatePost(PostID, {
				downvotes: post.downvotes,
			});
			return result;
		} catch (err) {
			return err;
		}
	}

	static async comment(
		PostID: string,
		UserID: string,
		Caption: string,
		Image: string,
        Plugins: Array<commentPlugins>
	) {
		try {
			await prisma.comments.create({
                data: {
                    postid: PostID,
                    commentid: crypto.randomUUID().toString(),
                    creatorid: UserID,
                    caption: Caption,
                    image: Image,
                },
            });
		} catch (err) {
			return err;
		}
	}
}

// Developer Applications
class Applications {
	static async createApp(creator_id: string, name: string, logo: string) {
		try {
			const token: string = crypto
				.createHash("sha256")
				.update(
					`${crypto.randomUUID()}_${crypto.randomUUID()}`.replace(
						/-/g,
						""
					)
				)
				.digest("hex");

			await prisma.applications.create({
				data: {
					creatorid: creator_id,
					name: name,
					logo: logo,
					token: token,
					active: true,
					permissions: ["global.*"],
				},
			});

			return token;
		} catch (err) {
			return err;
		}
	}

	static async updateApp(token: string, data: any) {
		try {
			await prisma.applications.update({
				data: data,
				where: {
					token: token,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async get(token: string) {
		const tokenData = await prisma.applications.findUnique({
			where: {
				token: token,
			},
			include: {
				owner: true,
			},
		});

		if (tokenData) return tokenData;
		else return null;
	}

	static async getAllApplications(creatorid: string) {
		try {
			const doc = await prisma.applications.findMany({
				where: {
					creatorid: creatorid,
				},
				include: {
					owner: true,
				},
			});

			return doc;
		} catch (error) {
			return error;
		}
	}

	static async delete(data: any) {
		try {
			await prisma.applications.delete({
				where: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}
}

// Export the classes
export { prisma, Users, Posts, Applications };
