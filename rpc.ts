import { hasPerm } from "../perms.js";
import * as database from "./prisma.js";

// Custom RPC Error Constructor
class RPCError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RPCError";
	}
}

// Check staff perms
const checkPerms = async (userid: string, perm: string) => {
	const user = await database.Users.get({
		userid: userid,
	});

	if (!user) return false;
	else return hasPerm(user?.staff_perms, perm);
};

// RPC Entities
const availableEntities: {
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

// RPC Query Layer
const Query = async (
	action: string,
	data: any
): Promise<boolean | RPCError> => {
	const entity = availableEntities.find(
		(p) => p.namespace === action.split(".")[0]
	);
	const entityAction = entity.actions.find(
		(p) => p.name === action.split(".")[1]
	);

	if (entityAction) {
		if (checkPerms(data.staff_id, entityAction.permissionRequired)) {
			const ActionParams = entityAction.params.map((p) => p.name);

			if (
				JSON.stringify(Object.keys(data)) ===
				JSON.stringify(ActionParams)
			)
				return await entityAction?.execute(data);
			else return new RPCError("Invalid Parameters.");
		} else
			return new RPCError(
				"You do not have permission to do this action."
			);
	}
};

// Export needed stuff.
export { Query, availableEntities };
