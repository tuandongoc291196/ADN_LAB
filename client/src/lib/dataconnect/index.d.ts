import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface GetUserByEmailData {
  users: ({
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
    email: string;
    accountStatus: string;
    authProvider: string;
    phone?: string | null;
    addressShipping?: string | null;
    role: boolean;
    roleString: string;
    createdAt: TimestampString;
    lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface GetUserData {
  user?: {
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
    email: string;
    accountStatus: string;
    authProvider: string;
    phone?: string | null;
    addressShipping?: string | null;
    role: boolean;
    roleString: string;
    createdAt: TimestampString;
    lastLogin?: TimestampString | null;
  } & User_Key;
}

export interface ListUsersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    roleString: string;
    createdAt: TimestampString;
    lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface UpdateAccountStatusData {
  user_update?: User_Key | null;
}

export interface UpdateAccountStatusVariables {
  userId: string;
  accountStatus: string;
}

export interface UpdateLastLoginData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileVariables {
  fullname?: string | null;
  gender?: string | null;
  phone?: string | null;
  addressShipping?: string | null;
}

export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}

export interface UpdateUserRoleVariables {
  userId: string;
  roleString: string;
  role: boolean;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  fullname: string;
  email: string;
  authProvider: string;
  gender?: string | null;
  avatar?: string | null;
  phone?: string | null;
  addressShipping?: string | null;
  role?: boolean | null;
  roleString?: string | null;
}

export interface UserExistsData {
  user?: {
    id: string;
  } & User_Key;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpdateLastLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateLastLoginData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateLastLoginData, undefined>;
  operationName: string;
}
export const updateLastLoginRef: UpdateLastLoginRef;

export function updateLastLogin(): MutationPromise<UpdateLastLoginData, undefined>;
export function updateLastLogin(dc: DataConnect): MutationPromise<UpdateLastLoginData, undefined>;

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  operationName: string;
}
export const updateUserRoleRef: UpdateUserRoleRef;

export function updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;
export function updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateAccountStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAccountStatusVariables): MutationRef<UpdateAccountStatusData, UpdateAccountStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAccountStatusVariables): MutationRef<UpdateAccountStatusData, UpdateAccountStatusVariables>;
  operationName: string;
}
export const updateAccountStatusRef: UpdateAccountStatusRef;

export function updateAccountStatus(vars: UpdateAccountStatusVariables): MutationPromise<UpdateAccountStatusData, UpdateAccountStatusVariables>;
export function updateAccountStatus(dc: DataConnect, vars: UpdateAccountStatusVariables): MutationPromise<UpdateAccountStatusData, UpdateAccountStatusVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface UserExistsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<UserExistsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<UserExistsData, undefined>;
  operationName: string;
}
export const userExistsRef: UserExistsRef;

export function userExists(): QueryPromise<UserExistsData, undefined>;
export function userExists(dc: DataConnect): QueryPromise<UserExistsData, undefined>;

