import { PrismaClient } from "@prisma/client";
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
					createdat: new Date(),
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
		});

		if (!doc) return null;
		else return doc;
	}

	static async find(data: any) {
		const docs = await prisma.users.findMany({
			where: data,
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
		image: string,
		plugins: any
	) {
		try {
			await prisma.posts.create({
				data: {
					userid: userid,
					caption: caption,
                    type: type,
					image: image,
					plugins: plugins,
					createdat: new Date(),
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
		});

		let Comments: Post["comments"] = [];

		if (post) {
			let user = await Users.get({ userid: post.userid });

			if (user) {
				for (const comment of post.comments) {
					let user = await Users.get({
						userid: comment.user.userid,
					});

					if (user) Comments.push(comment);
					else continue;
				}

				post.comments = Comments;

				let data = {
					user: user,
					post: post,
				};

				return data;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	static async find(data: object) {
		let posts: object[] = [];

		const docs = await prisma.posts.findMany({
			where: {
				...data,
			},
		});

		for (const post of docs) {
			let Comments: Post["comments"] = [];

			let user = await Users.get({ userid: post.userid });

			for (const comment of post.comments) {
				let user = await Users.get({
					userid: comment.user.userid,
				});

				if (user) Comments.push(comment);
				else continue;
			}

			if (!user) continue;
			else {
				post.comments = Comments;

				posts.push({
					post: post,
					user: user,
				});
			}
		}

		return posts;
	}

	static async listAllPosts() {
		let posts: object[] = [];

		const docs = await prisma.posts.findMany();

		for (let post of docs) {
			let Comments: Post["comments"] = [];

			let user = await Users.get({ userid: post.userid });

			for (const comment of post.comments) {
				let user = await Users.get({
					userid: comment.user.userid,
				});

				if (user) Comments.push(comment);
				else continue;
			}

			if (!user) continue;
			else {
				post.comments = Comments;

				posts.push({
					post: post,
					user: user,
				});
			}
		}

		return posts;
	}

	static async updatePost(id: string, data: any) {
		try {
			await prisma.posts.update(data, {
				where: {
					postid: id,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async getAllUserPosts(UserID: string) {
		let posts: Post[] = [];

		const docs = await prisma.posts.findMany({
			where: { userid: UserID },
		});

		for (let post of docs) {
			let Comments: Post["comments"] = [];

			let user = await Users.get({ userid: post.userid });

			for (const comment of post.comments) {
				let user = await Users.get({
					userid: comment.user.userid,
				});

				if (user) Comments.push(comment);
				else continue;
			}

			if (!user) continue;
			else {
				post.comments = Comments;

				posts.push(post);
			}
		}

		return posts;
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
			post.post.upvotes.push(UserID);

			const result = await Posts.updatePost(PostID, {
				upvotes: post.post.upvotes,
			});
			return result;
		} catch (err) {
			return err;
		}
	}

	static async downvote(PostID: string, UserID: string) {
		try {
			let post = await Posts.get(PostID);
			post.post.downvotes.push(UserID);

			const result = await Posts.updatePost(PostID, {
				downvotes: post.post.downvotes,
			});
			return result;
		} catch (err) {
			return err;
		}
	}

	static async comment(
		PostID: string,
		User: User,
		Caption: string,
		Image: string
	) {
		try {
			let post = await Posts.get(PostID);

			if (post) {
				post.post.comments.push({
					user: User,
					comment: {
						caption: Caption,
						image: Image,
					},
				});

				const result = await Posts.updatePost(PostID, {
					comments: post.post.comments,
				});
				return result;
			} else return false;
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
					createdat: new Date(),
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
export default prisma;
export { Users, Posts, Applications };
