import { PrismaClient } from "@prisma/client";
import type { User, Application, Post } from "./types.interface.js";

const prisma: PrismaClient = new PrismaClient();

// Users
class Users {
	static async createUser(
		name: string,
		userid: string,
		usertag: string,
		bio: string,
		avatar: string
	): Promise<boolean | Error> {
		try {
			await Users.create({
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
			});

			return true;
		} catch (error) {
			return error;
		}
	}

	static async get(data: any): Promise<User | null> {
		const doc = await Users.findOne({
			where: data,
		});

		if (!doc) return null;
		else return doc;
	}

	static async find(data: any): Promise<User[]> {
		const docs = await Users.findAll({
			where: data,
		});

		return docs;
	}

	static async updateUser(
		id: string,
		data: object
	): Promise<boolean | Error> {
		try {
			await Users.update(data, {
				where: {
					userid: id,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async delete(data: any): Promise<boolean | Error> {
		try {
			await Users.destroy({
				where: data,
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async follow(
		UserID: string,
		Target: string
	): Promise<boolean | Error> {
		try {
			const user = await Users.findOne({
				where: {
					userid: UserID,
				},
			});

			const target = await Users.findOne({
				where: {
					userid: Target,
				},
			});

			let following = user.following;
			following.push(Target);

			let followers = target.followers;
			followers.push(UserID);

			await Users.update(
				{
					followers: followers,
				},
				{
					where: {
						userid: Target,
					},
				}
			);

			await Users.update(
				{
					following: following,
				},
				{
					where: {
						userid: UserID,
					},
				}
			);

			return true;
		} catch (err) {
			return err;
		}
	}

	static async unfollow(
		UserID: string,
		Target: string
	): Promise<boolean | Error> {
		try {
			const user = await Users.findOne({
				where: {
					userid: UserID,
				},
			});

			const target = await Users.findOne({
				where: {
					userid: Target,
				},
			});

			let following = user.following;
			following = following.filter((p) => p !== Target);

			let followers = target.followers;
			followers = followers.filter((p) => p !== UserID);

			await Users.update(
				{
					followers: followers,
				},
				{
					where: {
						userid: Target,
					},
				}
			);

			await Users.update(
				{
					following: following,
				},
				{
					where: {
						userid: UserID,
					},
				}
			);

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
		image: string,
		plugins: Post["plugins"]
	): Promise<boolean | Error> {
		try {
			await Posts.create({
				userid: userid,
				caption: caption,
				image: image,
				plugins: plugins,
				createdat: new Date(),
				postid: crypto.randomUUID(),
				upvotes: [],
				downvotes: [],
				comments: [],
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async get(PostID: string): Promise<any | Error> {
		let post = await Posts.findOne({
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

	static async find(data: object): Promise<object[]> {
		let posts: object[] = [];

		const docs = await Posts.findAll({
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

	static async listAllPosts(): Promise<object[]> {
		let posts: object[] = [];

		const docs = await Posts.findAll();

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

	static async updatePost(id: string, data: any): Promise<boolean | Error> {
		try {
			await Posts.update(data, {
				where: {
					postid: id,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async getAllUserPosts(UserID: string): Promise<Post[]> {
		let posts: Post[] = [];

		const docs = await Posts.findAll({
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

	static async delete(PostID: string): Promise<boolean | Error> {
		try {
			await Posts.destroy({
				where: {
					postid: PostID,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async upvote(
		PostID: string,
		UserID: string
	): Promise<boolean | Error> {
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

	static async downvote(
		PostID: string,
		UserID: string
	): Promise<boolean | Error> {
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
	): Promise<boolean | Error> {
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
	id: number;
	creatorid: string;
	name: string;
	logo: string;
	token: string;
	active: boolean;
	permissions: string[];
	createdat: Date;

	static async createApp(
		creator_id: string,
		name: string,
		logo: string
	): Promise<string | Error> {
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

			await Applications.create({
				creatorid: creator_id,
				name: name,
				logo: logo,
				token: token,
				active: true,
				permissions: ["global.*"],
				createdat: new Date(),
			});

			return token;
		} catch (err) {
			return err;
		}
	}

	static async updateApp(token: string, data: any): Promise<boolean | Error> {
		try {
			await Applications.update(data, {
				where: {
					token: token,
				},
			});

			return true;
		} catch (err) {
			return err;
		}
	}

	static async get(token: string): Promise<Application | null> {
		const tokenData = await Applications.findOne({
			where: {
				token: token,
			},
		});

		if (tokenData) return tokenData;
		else return null;
	}

	static async getAllApplications(
		creatorid: string
	): Promise<Application[] | Error> {
		try {
			const doc = await Applications.findAll({
				where: {
					creatorid: creatorid,
				},
			});

			return doc;
		} catch (error) {
			return error;
		}
	}

	static async delete(data: any): Promise<boolean | Error> {
		try {
			await Applications.destroy({
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