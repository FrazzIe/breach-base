export { IUserSchema } from "./schema";
export { IUserFindQuery, BuildUserFindQuery } from "./find";
export { IUserUpdateFilter, IUserUpdateQuery, BuildUserUpdateQuery } from "./update";

const userCollection: string = "users";

export const UserCollection: string = userCollection;