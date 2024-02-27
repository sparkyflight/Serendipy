// Packages
import { hasPerm } from "../perms.js";
import { EmbedBuilder, WebhookClient } from "discord.js";
import * as database from "./prisma.js";
import * as fs from "node:fs";
import * as path from "path";

// Custom RPC Error Constructor
class RPCError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RPCError";
	}
}

// Create RPC Entities Map
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

const requiredParams: {
	name: string;
	description: string;
}[] = [
	{
		name: "user_id",
		description: "Who is the target for this query?",
	},
	{
		name: "staff_id",
		description: "Who is the staff member executing this query?",
	},
	{
		name: "reason",
		description: "The reason for this action.",
	},
];

const entities: {
	namespace: string;
	actions: {
		name: string;
		description: string;
		params: {
			name: string;
			description: string;
		}[];
		permissionRequired: string;
		execute: (data: any) => Promise<boolean | RPCError>;
	}[];
}[] = [];
const entityFiles = getFilesInDirectory(
	"./dist/v2-database/rpc_entities"
).filter((file) => file.endsWith(".js"));

for (const file of entityFiles) {
	import(`../${file}`)
		.then(async (module) => {
			const { name, description, params, permissionRequired, execute } =
				module.default;
			const namespace = file.split("/")[0];

			if (!entities.find((entity) => entity.namespace === namespace))
				entities.push({
					namespace,
					actions: [],
				});
			else {
				const entity = entities.find(
					(entity) => entity.namespace === namespace
				);
				entity.actions.push({
					name,
					description,
					params: [...requiredParams, ...params],
					permissionRequired,
					execute,
				});
			}
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Check staff perms
const checkPerms = async (userid: string, perm: string) => {
	const user = await database.Users.get({
		userid: userid,
	});

	if (!user) return false;
	else return hasPerm(user?.staff_perms, perm);
};

// RPCQL Action Log
const logAction = async (
	action: string,
	reason: string,
	userid: string,
	staffid: string
): Promise<boolean | RPCError> => {
	try {
		const webhookClient = new WebhookClient({
			id: process.env.DISCORD_LOG_CHANNEL,
			token: process.env.DISCORD_LOG_CHANNEL_TOKEN,
		});

		const user = await database.Users.get({
			userid: userid,
		});

		const staffMember = await database.Users.get({
			userid: staffid,
		});

		await webhookClient.send({
			embeds: [
				new EmbedBuilder()
					.setTitle(action.toLowerCase())
					.setColor("Random")
					.setURL(`https://sparkyflight.xyz/@${user.usertag}`)
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setAuthor({
						name: `${user.name} (@${user.usertag})`,
						url: user.avatar,
						iconURL: user.avatar,
					})
					.addFields(
						{
							name: "Action",
							value: action.toLowerCase(),
							inline: true,
						},
						{
							name: "Reason",
							value: reason,
							inline: true,
						},
						{
							name: "Staff Member",
							value: `${staffMember.name} (@${staffMember.usertag})`,
							inline: true,
						}
					)
					.setTimestamp()
					.setFooter({
						text: `This is an automated message from Sparkyflight!`,
						iconURL: "https://sparkyflight.xyz/logo.png",
					}),
			],
		});

		return true;
	} catch (error) {
		throw new RPCError(`Failed to log action. Error: ${error}`);
	}
};

// RPC Query Layer
const Query = async (
	action: string,
	data: any
): Promise<boolean | RPCError> => {
	const entity = entities.find((p) => p.namespace === action.split(".")[0]);
	const entityAction = entity.actions.find(
		(p) => p.name === action.split(".")[1]
	);

	if (entityAction) {
		if (checkPerms(data.staff_id, entityAction.permissionRequired)) {
			const ActionParams = entityAction.params.map((p) => p.name);

			if (
				JSON.stringify(Object.keys(data)) ===
				JSON.stringify(ActionParams)
			) {
				try {
					const lopi = await entityAction?.execute(data);

					if (lopi) {
						const capitalizeFirstLetter = (str: string) =>
							str.charAt(0).toUpperCase() + str.slice(1);

						await logAction(
							`${capitalizeFirstLetter(
								action.split(".")[0].slice(0, -1)
							)} ${capitalizeFirstLetter(entityAction.name)}`,
							data.reason,
							data.user_id,
							data.staff_id
						);

						return true;
					} else
						return new RPCError(
							"Oops! This action has unexpectedly failed. Please try again later."
						);
				} catch (error) {
					return new RPCError(
						"Oops! This action has unexpectedly failed. Error: " +
							error.message
					);
				}
			} else
				return new RPCError(
					"Oops! You requested this action with Invalid Parameters. Please fix, and try again."
				);
		} else
			return new RPCError(
				"Sorry! You do not have permission to perform this action."
			);
	}
};

// Export needed stuff.
export { Query, entities };
