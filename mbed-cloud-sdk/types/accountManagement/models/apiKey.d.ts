import { CallbackFn } from "../../common/interfaces";
import { UpdateApiKeyObject, ApiKeyStatusEnum } from "../types";
import { AccountManagementApi } from "../accountManagementApi";
import { User } from "./user";
import { Group } from "./group";
/**
 * API Key
 */
export declare class ApiKey {
    private _api;
    /**
     * A list of group IDs this API key belongs to.
     */
    readonly groups?: string[];
    /**
     * The status of the API key.
     */
    readonly status?: ApiKeyStatusEnum;
    /**
     * The API key.
     */
    readonly key: string;
    /**
     * Creation UTC time RFC3339.
     */
    readonly createdAt?: string;
    /**
     * The timestamp of the API key creation in the storage, in milliseconds.
     */
    readonly creationTime?: number;
    /**
     * The timestamp of the latest API key usage, in milliseconds.
     */
    readonly lastLoginTime?: number;
    constructor(init: Partial<ApiKey>, _api?: AccountManagementApi);
    /**
     * List the groups this API key belongs to
     * @returns Promise containing groups
     */
    listGroups(): Promise<Array<Group>>;
    /**
     * List the groups this API key belongs to
     * @param callback A function that is passed the return arguments (error, groups)
     */
    listGroups(callback: CallbackFn<Array<Group>>): void;
    /**
     * Get details of the key owner
     * @returns Promise containing the user
     */
    getOwner(): Promise<User>;
    /**
     * Get details of the key owner
     * @param callback A function that is passed the return arguments (error, user)
     */
    getOwner(callback: CallbackFn<User>): void;
    /**
     * Updates an API key
     * @returns Promise containing API key
     */
    update(): Promise<ApiKey>;
    /**
     * Updates an API key
     * @param options.name The display name for the API key
     * @param options.owner The owner of this API key
     * @param callback A function that is passed the return arguments (error, API key)
     */
    update(callback: CallbackFn<ApiKey>): void;
    /**
     * Delete the API key
     * @returns Promise containing any error
     */
    delete(): Promise<void>;
    /**
     * Delete the API key
     * @param callback A function that is passed any error
     */
    delete(callback: CallbackFn<void>): void;
}
export interface ApiKey extends UpdateApiKeyObject {
}