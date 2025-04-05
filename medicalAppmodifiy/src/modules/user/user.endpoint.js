import { roleTypes } from "../../middleware/auth.middleware.js";
import { profile } from "./services/user.service.js";

export const endpoint = {
    profile: Object.values(roleTypes) // This correctly includes all roles in the array
};
