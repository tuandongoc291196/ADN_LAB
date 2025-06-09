import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface BulkAssignRoleData {
  user_updateMany: number;
}

export interface BulkAssignRoleVariables {
  userIds: string[];
  roleId: string;
}

export interface CountUsersByRoleData {
  customers: ({
    id: string;
  } & User_Key)[];
    staff: ({
      id: string;
    } & User_Key)[];
      managers: ({
        id: string;
      } & User_Key)[];
        admins: ({
          id: string;
        } & User_Key)[];
}

export interface CreateRoleData {
  role_insert: Role_Key;
}

export interface CreateRoleVariables {
  id: string;
  name: string;
  description?: string | null;
  permissions?: string | null;
}

export interface DeactivateRoleData {
  role_update?: Role_Key | null;
}

export interface DeactivateRoleVariables {
  roleId: string;
}

export interface GetRoleByIdData {
  role?: {
    id: string;
    name: string;
    description?: string | null;
    permissions?: string | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Role_Key;
}

export interface GetRoleByIdVariables {
  roleId: string;
}

export interface GetRoleByNameData {
  roles: ({
    id: string;
    name: string;
    description?: string | null;
    permissions?: string | null;
    isActive: boolean;
  } & Role_Key)[];
}

export interface GetRoleByNameVariables {
  roleName: string;
}

export interface GetRolesData {
  roles: ({
    id: string;
    name: string;
    description?: string | null;
    permissions?: string | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Role_Key)[];
}

export interface GetStaffMembersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    phone?: string | null;
    role: {
      name: string;
      description?: string | null;
    };
  } & User_Key)[];
}

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
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
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
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
      permissions?: string | null;
    } & Role_Key;
      isAdmin: boolean;
      roleString: string;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key;
}

export interface GetUsersByRoleData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    role: {
      name: string;
      description?: string | null;
    };
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface GetUsersByRoleNameData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    phone?: string | null;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface GetUsersByRoleNameVariables {
  roleName: string;
}

export interface GetUsersByRoleVariables {
  roleId: string;
}

export interface ListUsersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    roleId: string;
    role: {
      name: string;
      description?: string | null;
    };
      roleString: string;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key)[];
}

export interface Role_Key {
  id: string;
  __typename?: 'Role_Key';
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

export interface UpdateRoleData {
  role_update?: Role_Key | null;
}

export interface UpdateRoleVariables {
  roleId: string;
  name?: string | null;
  description?: string | null;
  permissions?: string | null;
  isActive?: boolean | null;
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

export interface UpdateUserRoleLegacyData {
  user_update?: User_Key | null;
}

export interface UpdateUserRoleLegacyVariables {
  userId: string;
  roleString: string;
  isAdmin: boolean;
}

export interface UpdateUserRoleVariables {
  userId: string;
  roleId: string;
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
  roleId?: string | null;
  isAdmin?: boolean | null;
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

interface CreateRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
  operationName: string;
}
export const createRoleRef: CreateRoleRef;

export function createRole(vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;
export function createRole(dc: DataConnect, vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;

interface UpdateRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
  operationName: string;
}
export const updateRoleRef: UpdateRoleRef;

export function updateRole(vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;
export function updateRole(dc: DataConnect, vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;

interface DeactivateRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateRoleVariables): MutationRef<DeactivateRoleData, DeactivateRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeactivateRoleVariables): MutationRef<DeactivateRoleData, DeactivateRoleVariables>;
  operationName: string;
}
export const deactivateRoleRef: DeactivateRoleRef;

export function deactivateRole(vars: DeactivateRoleVariables): MutationPromise<DeactivateRoleData, DeactivateRoleVariables>;
export function deactivateRole(dc: DataConnect, vars: DeactivateRoleVariables): MutationPromise<DeactivateRoleData, DeactivateRoleVariables>;

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

interface UpdateUserRoleLegacyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleLegacyVariables): MutationRef<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserRoleLegacyVariables): MutationRef<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;
  operationName: string;
}
export const updateUserRoleLegacyRef: UpdateUserRoleLegacyRef;

export function updateUserRoleLegacy(vars: UpdateUserRoleLegacyVariables): MutationPromise<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;
export function updateUserRoleLegacy(dc: DataConnect, vars: UpdateUserRoleLegacyVariables): MutationPromise<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;

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

interface BulkAssignRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BulkAssignRoleVariables): MutationRef<BulkAssignRoleData, BulkAssignRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BulkAssignRoleVariables): MutationRef<BulkAssignRoleData, BulkAssignRoleVariables>;
  operationName: string;
}
export const bulkAssignRoleRef: BulkAssignRoleRef;

export function bulkAssignRole(vars: BulkAssignRoleVariables): MutationPromise<BulkAssignRoleData, BulkAssignRoleVariables>;
export function bulkAssignRole(dc: DataConnect, vars: BulkAssignRoleVariables): MutationPromise<BulkAssignRoleData, BulkAssignRoleVariables>;

interface GetRolesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
  operationName: string;
}
export const getRolesRef: GetRolesRef;

export function getRoles(): QueryPromise<GetRolesData, undefined>;
export function getRoles(dc: DataConnect): QueryPromise<GetRolesData, undefined>;

interface GetRoleByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
  operationName: string;
}
export const getRoleByIdRef: GetRoleByIdRef;

export function getRoleById(vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;
export function getRoleById(dc: DataConnect, vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;

interface GetRoleByNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
  operationName: string;
}
export const getRoleByNameRef: GetRoleByNameRef;

export function getRoleByName(vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;
export function getRoleByName(dc: DataConnect, vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;

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

interface GetUsersByRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
  operationName: string;
}
export const getUsersByRoleRef: GetUsersByRoleRef;

export function getUsersByRole(vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;
export function getUsersByRole(dc: DataConnect, vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;

interface GetUsersByRoleNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsersByRoleNameVariables): QueryRef<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUsersByRoleNameVariables): QueryRef<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;
  operationName: string;
}
export const getUsersByRoleNameRef: GetUsersByRoleNameRef;

export function getUsersByRoleName(vars: GetUsersByRoleNameVariables): QueryPromise<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;
export function getUsersByRoleName(dc: DataConnect, vars: GetUsersByRoleNameVariables): QueryPromise<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;

interface GetStaffMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStaffMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetStaffMembersData, undefined>;
  operationName: string;
}
export const getStaffMembersRef: GetStaffMembersRef;

export function getStaffMembers(): QueryPromise<GetStaffMembersData, undefined>;
export function getStaffMembers(dc: DataConnect): QueryPromise<GetStaffMembersData, undefined>;

interface CountUsersByRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<CountUsersByRoleData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<CountUsersByRoleData, undefined>;
  operationName: string;
}
export const countUsersByRoleRef: CountUsersByRoleRef;

export function countUsersByRole(): QueryPromise<CountUsersByRoleData, undefined>;
export function countUsersByRole(dc: DataConnect): QueryPromise<CountUsersByRoleData, undefined>;

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

