# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetRoles*](#getroles)
  - [*GetRoleById*](#getrolebyid)
  - [*GetRoleByName*](#getrolebyname)
  - [*GetUser*](#getuser)
  - [*GetUserByEmail*](#getuserbyemail)
  - [*ListUsers*](#listusers)
  - [*GetUsersByRole*](#getusersbyrole)
  - [*GetUsersByRoleName*](#getusersbyrolename)
  - [*GetStaffMembers*](#getstaffmembers)
  - [*CountUsersByRole*](#countusersbyrole)
  - [*UserExists*](#userexists)
- [**Mutations**](#mutations)
  - [*CreateRole*](#createrole)
  - [*UpdateRole*](#updaterole)
  - [*DeactivateRole*](#deactivaterole)
  - [*UpsertUser*](#upsertuser)
  - [*UpdateLastLogin*](#updatelastlogin)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*UpdateUserRole*](#updateuserrole)
  - [*UpdateUserRoleLegacy*](#updateuserrolelegacy)
  - [*UpdateAccountStatus*](#updateaccountstatus)
  - [*BulkAssignRole*](#bulkassignrole)

# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/adnlab-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adnlab-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adnlab-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetRoles
You can execute the `GetRoles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getRoles(): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoles(dc: DataConnect): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRolesRef:
```typescript
const name = getRolesRef.operationName;
console.log(name);
```

### Variables
The `GetRoles` query has no variables.
### Return Type
Recall that executing the `GetRoles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRolesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetRoles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoles } from '@firebasegen/adnlab-connector';


// Call the `getRoles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoles(dataConnect);

console.log(data.roles);

// Or, you can use the `Promise` API.
getRoles().then((response) => {
  const data = response.data;
  console.log(data.roles);
});
```

### Using `GetRoles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRolesRef } from '@firebasegen/adnlab-connector';


// Call the `getRolesRef()` function to get a reference to the query.
const ref = getRolesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRolesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.roles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.roles);
});
```

## GetRoleById
You can execute the `GetRoleById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getRoleById(vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;

interface GetRoleByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
}
export const getRoleByIdRef: GetRoleByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoleById(dc: DataConnect, vars: GetRoleByIdVariables): QueryPromise<GetRoleByIdData, GetRoleByIdVariables>;

interface GetRoleByIdRef {
  ...
  (dc: DataConnect, vars: GetRoleByIdVariables): QueryRef<GetRoleByIdData, GetRoleByIdVariables>;
}
export const getRoleByIdRef: GetRoleByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRoleByIdRef:
```typescript
const name = getRoleByIdRef.operationName;
console.log(name);
```

### Variables
The `GetRoleById` query requires an argument of type `GetRoleByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRoleByIdVariables {
  roleId: string;
}
```
### Return Type
Recall that executing the `GetRoleById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRoleByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetRoleById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoleById, GetRoleByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetRoleById` query requires an argument of type `GetRoleByIdVariables`:
const getRoleByIdVars: GetRoleByIdVariables = {
  roleId: ..., 
};

// Call the `getRoleById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoleById(getRoleByIdVars);
// Variables can be defined inline as well.
const { data } = await getRoleById({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoleById(dataConnect, getRoleByIdVars);

console.log(data.role);

// Or, you can use the `Promise` API.
getRoleById(getRoleByIdVars).then((response) => {
  const data = response.data;
  console.log(data.role);
});
```

### Using `GetRoleById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRoleByIdRef, GetRoleByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetRoleById` query requires an argument of type `GetRoleByIdVariables`:
const getRoleByIdVars: GetRoleByIdVariables = {
  roleId: ..., 
};

// Call the `getRoleByIdRef()` function to get a reference to the query.
const ref = getRoleByIdRef(getRoleByIdVars);
// Variables can be defined inline as well.
const ref = getRoleByIdRef({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRoleByIdRef(dataConnect, getRoleByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.role);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.role);
});
```

## GetRoleByName
You can execute the `GetRoleByName` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getRoleByName(vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;

interface GetRoleByNameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
}
export const getRoleByNameRef: GetRoleByNameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoleByName(dc: DataConnect, vars: GetRoleByNameVariables): QueryPromise<GetRoleByNameData, GetRoleByNameVariables>;

interface GetRoleByNameRef {
  ...
  (dc: DataConnect, vars: GetRoleByNameVariables): QueryRef<GetRoleByNameData, GetRoleByNameVariables>;
}
export const getRoleByNameRef: GetRoleByNameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRoleByNameRef:
```typescript
const name = getRoleByNameRef.operationName;
console.log(name);
```

### Variables
The `GetRoleByName` query requires an argument of type `GetRoleByNameVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRoleByNameVariables {
  roleName: string;
}
```
### Return Type
Recall that executing the `GetRoleByName` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRoleByNameData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetRoleByNameData {
  roles: ({
    id: string;
    name: string;
    description?: string | null;
    permissions?: string | null;
    isActive: boolean;
  } & Role_Key)[];
}
```
### Using `GetRoleByName`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoleByName, GetRoleByNameVariables } from '@firebasegen/adnlab-connector';

// The `GetRoleByName` query requires an argument of type `GetRoleByNameVariables`:
const getRoleByNameVars: GetRoleByNameVariables = {
  roleName: ..., 
};

// Call the `getRoleByName()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoleByName(getRoleByNameVars);
// Variables can be defined inline as well.
const { data } = await getRoleByName({ roleName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoleByName(dataConnect, getRoleByNameVars);

console.log(data.roles);

// Or, you can use the `Promise` API.
getRoleByName(getRoleByNameVars).then((response) => {
  const data = response.data;
  console.log(data.roles);
});
```

### Using `GetRoleByName`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRoleByNameRef, GetRoleByNameVariables } from '@firebasegen/adnlab-connector';

// The `GetRoleByName` query requires an argument of type `GetRoleByNameVariables`:
const getRoleByNameVars: GetRoleByNameVariables = {
  roleName: ..., 
};

// Call the `getRoleByNameRef()` function to get a reference to the query.
const ref = getRoleByNameRef(getRoleByNameVars);
// Variables can be defined inline as well.
const ref = getRoleByNameRef({ roleName: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRoleByNameRef(dataConnect, getRoleByNameVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.roles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.roles);
});
```

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUser(): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@firebasegen/adnlab-connector';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@firebasegen/adnlab-connector';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserByEmail
You can execute the `GetUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@firebasegen/adnlab-connector';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@firebasegen/adnlab-connector';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listUsers(): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@firebasegen/adnlab-connector';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@firebasegen/adnlab-connector';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUsersByRole
You can execute the `GetUsersByRole` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUsersByRole(vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;

interface GetUsersByRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
}
export const getUsersByRoleRef: GetUsersByRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsersByRole(dc: DataConnect, vars: GetUsersByRoleVariables): QueryPromise<GetUsersByRoleData, GetUsersByRoleVariables>;

interface GetUsersByRoleRef {
  ...
  (dc: DataConnect, vars: GetUsersByRoleVariables): QueryRef<GetUsersByRoleData, GetUsersByRoleVariables>;
}
export const getUsersByRoleRef: GetUsersByRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsersByRoleRef:
```typescript
const name = getUsersByRoleRef.operationName;
console.log(name);
```

### Variables
The `GetUsersByRole` query requires an argument of type `GetUsersByRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUsersByRoleVariables {
  roleId: string;
}
```
### Return Type
Recall that executing the `GetUsersByRole` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsersByRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUsersByRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsersByRole, GetUsersByRoleVariables } from '@firebasegen/adnlab-connector';

// The `GetUsersByRole` query requires an argument of type `GetUsersByRoleVariables`:
const getUsersByRoleVars: GetUsersByRoleVariables = {
  roleId: ..., 
};

// Call the `getUsersByRole()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsersByRole(getUsersByRoleVars);
// Variables can be defined inline as well.
const { data } = await getUsersByRole({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsersByRole(dataConnect, getUsersByRoleVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUsersByRole(getUsersByRoleVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUsersByRole`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsersByRoleRef, GetUsersByRoleVariables } from '@firebasegen/adnlab-connector';

// The `GetUsersByRole` query requires an argument of type `GetUsersByRoleVariables`:
const getUsersByRoleVars: GetUsersByRoleVariables = {
  roleId: ..., 
};

// Call the `getUsersByRoleRef()` function to get a reference to the query.
const ref = getUsersByRoleRef(getUsersByRoleVars);
// Variables can be defined inline as well.
const ref = getUsersByRoleRef({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsersByRoleRef(dataConnect, getUsersByRoleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUsersByRoleName
You can execute the `GetUsersByRoleName` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUsersByRoleName(vars: GetUsersByRoleNameVariables): QueryPromise<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;

interface GetUsersByRoleNameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsersByRoleNameVariables): QueryRef<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;
}
export const getUsersByRoleNameRef: GetUsersByRoleNameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsersByRoleName(dc: DataConnect, vars: GetUsersByRoleNameVariables): QueryPromise<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;

interface GetUsersByRoleNameRef {
  ...
  (dc: DataConnect, vars: GetUsersByRoleNameVariables): QueryRef<GetUsersByRoleNameData, GetUsersByRoleNameVariables>;
}
export const getUsersByRoleNameRef: GetUsersByRoleNameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsersByRoleNameRef:
```typescript
const name = getUsersByRoleNameRef.operationName;
console.log(name);
```

### Variables
The `GetUsersByRoleName` query requires an argument of type `GetUsersByRoleNameVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUsersByRoleNameVariables {
  roleName: string;
}
```
### Return Type
Recall that executing the `GetUsersByRoleName` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsersByRoleNameData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUsersByRoleName`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsersByRoleName, GetUsersByRoleNameVariables } from '@firebasegen/adnlab-connector';

// The `GetUsersByRoleName` query requires an argument of type `GetUsersByRoleNameVariables`:
const getUsersByRoleNameVars: GetUsersByRoleNameVariables = {
  roleName: ..., 
};

// Call the `getUsersByRoleName()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsersByRoleName(getUsersByRoleNameVars);
// Variables can be defined inline as well.
const { data } = await getUsersByRoleName({ roleName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsersByRoleName(dataConnect, getUsersByRoleNameVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUsersByRoleName(getUsersByRoleNameVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUsersByRoleName`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsersByRoleNameRef, GetUsersByRoleNameVariables } from '@firebasegen/adnlab-connector';

// The `GetUsersByRoleName` query requires an argument of type `GetUsersByRoleNameVariables`:
const getUsersByRoleNameVars: GetUsersByRoleNameVariables = {
  roleName: ..., 
};

// Call the `getUsersByRoleNameRef()` function to get a reference to the query.
const ref = getUsersByRoleNameRef(getUsersByRoleNameVars);
// Variables can be defined inline as well.
const ref = getUsersByRoleNameRef({ roleName: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsersByRoleNameRef(dataConnect, getUsersByRoleNameVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetStaffMembers
You can execute the `GetStaffMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getStaffMembers(): QueryPromise<GetStaffMembersData, undefined>;

interface GetStaffMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetStaffMembersData, undefined>;
}
export const getStaffMembersRef: GetStaffMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffMembers(dc: DataConnect): QueryPromise<GetStaffMembersData, undefined>;

interface GetStaffMembersRef {
  ...
  (dc: DataConnect): QueryRef<GetStaffMembersData, undefined>;
}
export const getStaffMembersRef: GetStaffMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffMembersRef:
```typescript
const name = getStaffMembersRef.operationName;
console.log(name);
```

### Variables
The `GetStaffMembers` query has no variables.
### Return Type
Recall that executing the `GetStaffMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffMembersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetStaffMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffMembers } from '@firebasegen/adnlab-connector';


// Call the `getStaffMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffMembers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffMembers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
getStaffMembers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetStaffMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffMembersRef } from '@firebasegen/adnlab-connector';


// Call the `getStaffMembersRef()` function to get a reference to the query.
const ref = getStaffMembersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffMembersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## CountUsersByRole
You can execute the `CountUsersByRole` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
countUsersByRole(): QueryPromise<CountUsersByRoleData, undefined>;

interface CountUsersByRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<CountUsersByRoleData, undefined>;
}
export const countUsersByRoleRef: CountUsersByRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
countUsersByRole(dc: DataConnect): QueryPromise<CountUsersByRoleData, undefined>;

interface CountUsersByRoleRef {
  ...
  (dc: DataConnect): QueryRef<CountUsersByRoleData, undefined>;
}
export const countUsersByRoleRef: CountUsersByRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the countUsersByRoleRef:
```typescript
const name = countUsersByRoleRef.operationName;
console.log(name);
```

### Variables
The `CountUsersByRole` query has no variables.
### Return Type
Recall that executing the `CountUsersByRole` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CountUsersByRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `CountUsersByRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, countUsersByRole } from '@firebasegen/adnlab-connector';


// Call the `countUsersByRole()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await countUsersByRole();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await countUsersByRole(dataConnect);

console.log(data.customers);
console.log(data.staff);
console.log(data.managers);
console.log(data.admins);

// Or, you can use the `Promise` API.
countUsersByRole().then((response) => {
  const data = response.data;
  console.log(data.customers);
  console.log(data.staff);
  console.log(data.managers);
  console.log(data.admins);
});
```

### Using `CountUsersByRole`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, countUsersByRoleRef } from '@firebasegen/adnlab-connector';


// Call the `countUsersByRoleRef()` function to get a reference to the query.
const ref = countUsersByRoleRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = countUsersByRoleRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.customers);
console.log(data.staff);
console.log(data.managers);
console.log(data.admins);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.customers);
  console.log(data.staff);
  console.log(data.managers);
  console.log(data.admins);
});
```

## UserExists
You can execute the `UserExists` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
userExists(): QueryPromise<UserExistsData, undefined>;

interface UserExistsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<UserExistsData, undefined>;
}
export const userExistsRef: UserExistsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
userExists(dc: DataConnect): QueryPromise<UserExistsData, undefined>;

interface UserExistsRef {
  ...
  (dc: DataConnect): QueryRef<UserExistsData, undefined>;
}
export const userExistsRef: UserExistsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the userExistsRef:
```typescript
const name = userExistsRef.operationName;
console.log(name);
```

### Variables
The `UserExists` query has no variables.
### Return Type
Recall that executing the `UserExists` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UserExistsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UserExistsData {
  user?: {
    id: string;
  } & User_Key;
}
```
### Using `UserExists`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, userExists } from '@firebasegen/adnlab-connector';


// Call the `userExists()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await userExists();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await userExists(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
userExists().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `UserExists`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, userExistsRef } from '@firebasegen/adnlab-connector';


// Call the `userExistsRef()` function to get a reference to the query.
const ref = userExistsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = userExistsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateRole
You can execute the `CreateRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createRole(vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;

interface CreateRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
}
export const createRoleRef: CreateRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRole(dc: DataConnect, vars: CreateRoleVariables): MutationPromise<CreateRoleData, CreateRoleVariables>;

interface CreateRoleRef {
  ...
  (dc: DataConnect, vars: CreateRoleVariables): MutationRef<CreateRoleData, CreateRoleVariables>;
}
export const createRoleRef: CreateRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRoleRef:
```typescript
const name = createRoleRef.operationName;
console.log(name);
```

### Variables
The `CreateRole` mutation requires an argument of type `CreateRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRoleVariables {
  id: string;
  name: string;
  description?: string | null;
  permissions?: string | null;
}
```
### Return Type
Recall that executing the `CreateRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRoleData {
  role_insert: Role_Key;
}
```
### Using `CreateRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRole, CreateRoleVariables } from '@firebasegen/adnlab-connector';

// The `CreateRole` mutation requires an argument of type `CreateRoleVariables`:
const createRoleVars: CreateRoleVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  permissions: ..., // optional
};

// Call the `createRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRole(createRoleVars);
// Variables can be defined inline as well.
const { data } = await createRole({ id: ..., name: ..., description: ..., permissions: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRole(dataConnect, createRoleVars);

console.log(data.role_insert);

// Or, you can use the `Promise` API.
createRole(createRoleVars).then((response) => {
  const data = response.data;
  console.log(data.role_insert);
});
```

### Using `CreateRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRoleRef, CreateRoleVariables } from '@firebasegen/adnlab-connector';

// The `CreateRole` mutation requires an argument of type `CreateRoleVariables`:
const createRoleVars: CreateRoleVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  permissions: ..., // optional
};

// Call the `createRoleRef()` function to get a reference to the mutation.
const ref = createRoleRef(createRoleVars);
// Variables can be defined inline as well.
const ref = createRoleRef({ id: ..., name: ..., description: ..., permissions: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRoleRef(dataConnect, createRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.role_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.role_insert);
});
```

## UpdateRole
You can execute the `UpdateRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateRole(vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;

interface UpdateRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
}
export const updateRoleRef: UpdateRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRole(dc: DataConnect, vars: UpdateRoleVariables): MutationPromise<UpdateRoleData, UpdateRoleVariables>;

interface UpdateRoleRef {
  ...
  (dc: DataConnect, vars: UpdateRoleVariables): MutationRef<UpdateRoleData, UpdateRoleVariables>;
}
export const updateRoleRef: UpdateRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRoleRef:
```typescript
const name = updateRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateRole` mutation requires an argument of type `UpdateRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRoleVariables {
  roleId: string;
  name?: string | null;
  description?: string | null;
  permissions?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRoleData {
  role_update?: Role_Key | null;
}
```
### Using `UpdateRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRole, UpdateRoleVariables } from '@firebasegen/adnlab-connector';

// The `UpdateRole` mutation requires an argument of type `UpdateRoleVariables`:
const updateRoleVars: UpdateRoleVariables = {
  roleId: ..., 
  name: ..., // optional
  description: ..., // optional
  permissions: ..., // optional
  isActive: ..., // optional
};

// Call the `updateRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRole(updateRoleVars);
// Variables can be defined inline as well.
const { data } = await updateRole({ roleId: ..., name: ..., description: ..., permissions: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRole(dataConnect, updateRoleVars);

console.log(data.role_update);

// Or, you can use the `Promise` API.
updateRole(updateRoleVars).then((response) => {
  const data = response.data;
  console.log(data.role_update);
});
```

### Using `UpdateRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRoleRef, UpdateRoleVariables } from '@firebasegen/adnlab-connector';

// The `UpdateRole` mutation requires an argument of type `UpdateRoleVariables`:
const updateRoleVars: UpdateRoleVariables = {
  roleId: ..., 
  name: ..., // optional
  description: ..., // optional
  permissions: ..., // optional
  isActive: ..., // optional
};

// Call the `updateRoleRef()` function to get a reference to the mutation.
const ref = updateRoleRef(updateRoleVars);
// Variables can be defined inline as well.
const ref = updateRoleRef({ roleId: ..., name: ..., description: ..., permissions: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRoleRef(dataConnect, updateRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.role_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.role_update);
});
```

## DeactivateRole
You can execute the `DeactivateRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deactivateRole(vars: DeactivateRoleVariables): MutationPromise<DeactivateRoleData, DeactivateRoleVariables>;

interface DeactivateRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateRoleVariables): MutationRef<DeactivateRoleData, DeactivateRoleVariables>;
}
export const deactivateRoleRef: DeactivateRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deactivateRole(dc: DataConnect, vars: DeactivateRoleVariables): MutationPromise<DeactivateRoleData, DeactivateRoleVariables>;

interface DeactivateRoleRef {
  ...
  (dc: DataConnect, vars: DeactivateRoleVariables): MutationRef<DeactivateRoleData, DeactivateRoleVariables>;
}
export const deactivateRoleRef: DeactivateRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deactivateRoleRef:
```typescript
const name = deactivateRoleRef.operationName;
console.log(name);
```

### Variables
The `DeactivateRole` mutation requires an argument of type `DeactivateRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeactivateRoleVariables {
  roleId: string;
}
```
### Return Type
Recall that executing the `DeactivateRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeactivateRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeactivateRoleData {
  role_update?: Role_Key | null;
}
```
### Using `DeactivateRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deactivateRole, DeactivateRoleVariables } from '@firebasegen/adnlab-connector';

// The `DeactivateRole` mutation requires an argument of type `DeactivateRoleVariables`:
const deactivateRoleVars: DeactivateRoleVariables = {
  roleId: ..., 
};

// Call the `deactivateRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deactivateRole(deactivateRoleVars);
// Variables can be defined inline as well.
const { data } = await deactivateRole({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deactivateRole(dataConnect, deactivateRoleVars);

console.log(data.role_update);

// Or, you can use the `Promise` API.
deactivateRole(deactivateRoleVars).then((response) => {
  const data = response.data;
  console.log(data.role_update);
});
```

### Using `DeactivateRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deactivateRoleRef, DeactivateRoleVariables } from '@firebasegen/adnlab-connector';

// The `DeactivateRole` mutation requires an argument of type `DeactivateRoleVariables`:
const deactivateRoleVars: DeactivateRoleVariables = {
  roleId: ..., 
};

// Call the `deactivateRoleRef()` function to get a reference to the mutation.
const ref = deactivateRoleRef(deactivateRoleVars);
// Variables can be defined inline as well.
const ref = deactivateRoleRef({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deactivateRoleRef(dataConnect, deactivateRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.role_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.role_update);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@firebasegen/adnlab-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  fullname: ..., 
  email: ..., 
  authProvider: ..., 
  gender: ..., // optional
  avatar: ..., // optional
  phone: ..., // optional
  addressShipping: ..., // optional
  roleId: ..., // optional
  isAdmin: ..., // optional
  roleString: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ fullname: ..., email: ..., authProvider: ..., gender: ..., avatar: ..., phone: ..., addressShipping: ..., roleId: ..., isAdmin: ..., roleString: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@firebasegen/adnlab-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  fullname: ..., 
  email: ..., 
  authProvider: ..., 
  gender: ..., // optional
  avatar: ..., // optional
  phone: ..., // optional
  addressShipping: ..., // optional
  roleId: ..., // optional
  isAdmin: ..., // optional
  roleString: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ fullname: ..., email: ..., authProvider: ..., gender: ..., avatar: ..., phone: ..., addressShipping: ..., roleId: ..., isAdmin: ..., roleString: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpdateLastLogin
You can execute the `UpdateLastLogin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateLastLogin(): MutationPromise<UpdateLastLoginData, undefined>;

interface UpdateLastLoginRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateLastLoginData, undefined>;
}
export const updateLastLoginRef: UpdateLastLoginRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLastLogin(dc: DataConnect): MutationPromise<UpdateLastLoginData, undefined>;

interface UpdateLastLoginRef {
  ...
  (dc: DataConnect): MutationRef<UpdateLastLoginData, undefined>;
}
export const updateLastLoginRef: UpdateLastLoginRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLastLoginRef:
```typescript
const name = updateLastLoginRef.operationName;
console.log(name);
```

### Variables
The `UpdateLastLogin` mutation has no variables.
### Return Type
Recall that executing the `UpdateLastLogin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLastLoginData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLastLoginData {
  user_update?: User_Key | null;
}
```
### Using `UpdateLastLogin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLastLogin } from '@firebasegen/adnlab-connector';


// Call the `updateLastLogin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLastLogin();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLastLogin(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateLastLogin().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateLastLogin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLastLoginRef } from '@firebasegen/adnlab-connector';


// Call the `updateLastLoginRef()` function to get a reference to the mutation.
const ref = updateLastLoginRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLastLoginRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  fullname?: string | null;
  gender?: string | null;
  phone?: string | null;
  addressShipping?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  fullname: ..., // optional
  gender: ..., // optional
  phone: ..., // optional
  addressShipping: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ fullname: ..., gender: ..., phone: ..., addressShipping: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserProfileVariables` argument.
const { data } = await updateUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  fullname: ..., // optional
  gender: ..., // optional
  phone: ..., // optional
  addressShipping: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ fullname: ..., gender: ..., phone: ..., addressShipping: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserProfileVariables` argument.
const ref = updateUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUserRole
You can execute the `UpdateUserRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRoleRef:
```typescript
const name = updateUserRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserRoleVariables {
  userId: string;
  roleId: string;
}
```
### Return Type
Recall that executing the `UpdateUserRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRole, UpdateUserRoleVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  userId: ..., 
  roleId: ..., 
};

// Call the `updateUserRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRole(updateUserRoleVars);
// Variables can be defined inline as well.
const { data } = await updateUserRole({ userId: ..., roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRole(dataConnect, updateUserRoleVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserRole(updateUserRoleVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleRef, UpdateUserRoleVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  userId: ..., 
  roleId: ..., 
};

// Call the `updateUserRoleRef()` function to get a reference to the mutation.
const ref = updateUserRoleRef(updateUserRoleVars);
// Variables can be defined inline as well.
const ref = updateUserRoleRef({ userId: ..., roleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleRef(dataConnect, updateUserRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUserRoleLegacy
You can execute the `UpdateUserRoleLegacy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserRoleLegacy(vars: UpdateUserRoleLegacyVariables): MutationPromise<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;

interface UpdateUserRoleLegacyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleLegacyVariables): MutationRef<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;
}
export const updateUserRoleLegacyRef: UpdateUserRoleLegacyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserRoleLegacy(dc: DataConnect, vars: UpdateUserRoleLegacyVariables): MutationPromise<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;

interface UpdateUserRoleLegacyRef {
  ...
  (dc: DataConnect, vars: UpdateUserRoleLegacyVariables): MutationRef<UpdateUserRoleLegacyData, UpdateUserRoleLegacyVariables>;
}
export const updateUserRoleLegacyRef: UpdateUserRoleLegacyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRoleLegacyRef:
```typescript
const name = updateUserRoleLegacyRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserRoleLegacy` mutation requires an argument of type `UpdateUserRoleLegacyVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserRoleLegacyVariables {
  userId: string;
  roleString: string;
  isAdmin: boolean;
}
```
### Return Type
Recall that executing the `UpdateUserRoleLegacy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleLegacyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserRoleLegacyData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserRoleLegacy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleLegacy, UpdateUserRoleLegacyVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserRoleLegacy` mutation requires an argument of type `UpdateUserRoleLegacyVariables`:
const updateUserRoleLegacyVars: UpdateUserRoleLegacyVariables = {
  userId: ..., 
  roleString: ..., 
  isAdmin: ..., 
};

// Call the `updateUserRoleLegacy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRoleLegacy(updateUserRoleLegacyVars);
// Variables can be defined inline as well.
const { data } = await updateUserRoleLegacy({ userId: ..., roleString: ..., isAdmin: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRoleLegacy(dataConnect, updateUserRoleLegacyVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserRoleLegacy(updateUserRoleLegacyVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserRoleLegacy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleLegacyRef, UpdateUserRoleLegacyVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserRoleLegacy` mutation requires an argument of type `UpdateUserRoleLegacyVariables`:
const updateUserRoleLegacyVars: UpdateUserRoleLegacyVariables = {
  userId: ..., 
  roleString: ..., 
  isAdmin: ..., 
};

// Call the `updateUserRoleLegacyRef()` function to get a reference to the mutation.
const ref = updateUserRoleLegacyRef(updateUserRoleLegacyVars);
// Variables can be defined inline as well.
const ref = updateUserRoleLegacyRef({ userId: ..., roleString: ..., isAdmin: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleLegacyRef(dataConnect, updateUserRoleLegacyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateAccountStatus
You can execute the `UpdateAccountStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateAccountStatus(vars: UpdateAccountStatusVariables): MutationPromise<UpdateAccountStatusData, UpdateAccountStatusVariables>;

interface UpdateAccountStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAccountStatusVariables): MutationRef<UpdateAccountStatusData, UpdateAccountStatusVariables>;
}
export const updateAccountStatusRef: UpdateAccountStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAccountStatus(dc: DataConnect, vars: UpdateAccountStatusVariables): MutationPromise<UpdateAccountStatusData, UpdateAccountStatusVariables>;

interface UpdateAccountStatusRef {
  ...
  (dc: DataConnect, vars: UpdateAccountStatusVariables): MutationRef<UpdateAccountStatusData, UpdateAccountStatusVariables>;
}
export const updateAccountStatusRef: UpdateAccountStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAccountStatusRef:
```typescript
const name = updateAccountStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateAccountStatus` mutation requires an argument of type `UpdateAccountStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAccountStatusVariables {
  userId: string;
  accountStatus: string;
}
```
### Return Type
Recall that executing the `UpdateAccountStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAccountStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAccountStatusData {
  user_update?: User_Key | null;
}
```
### Using `UpdateAccountStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAccountStatus, UpdateAccountStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateAccountStatus` mutation requires an argument of type `UpdateAccountStatusVariables`:
const updateAccountStatusVars: UpdateAccountStatusVariables = {
  userId: ..., 
  accountStatus: ..., 
};

// Call the `updateAccountStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAccountStatus(updateAccountStatusVars);
// Variables can be defined inline as well.
const { data } = await updateAccountStatus({ userId: ..., accountStatus: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAccountStatus(dataConnect, updateAccountStatusVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateAccountStatus(updateAccountStatusVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateAccountStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAccountStatusRef, UpdateAccountStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateAccountStatus` mutation requires an argument of type `UpdateAccountStatusVariables`:
const updateAccountStatusVars: UpdateAccountStatusVariables = {
  userId: ..., 
  accountStatus: ..., 
};

// Call the `updateAccountStatusRef()` function to get a reference to the mutation.
const ref = updateAccountStatusRef(updateAccountStatusVars);
// Variables can be defined inline as well.
const ref = updateAccountStatusRef({ userId: ..., accountStatus: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAccountStatusRef(dataConnect, updateAccountStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## BulkAssignRole
You can execute the `BulkAssignRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
bulkAssignRole(vars: BulkAssignRoleVariables): MutationPromise<BulkAssignRoleData, BulkAssignRoleVariables>;

interface BulkAssignRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BulkAssignRoleVariables): MutationRef<BulkAssignRoleData, BulkAssignRoleVariables>;
}
export const bulkAssignRoleRef: BulkAssignRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
bulkAssignRole(dc: DataConnect, vars: BulkAssignRoleVariables): MutationPromise<BulkAssignRoleData, BulkAssignRoleVariables>;

interface BulkAssignRoleRef {
  ...
  (dc: DataConnect, vars: BulkAssignRoleVariables): MutationRef<BulkAssignRoleData, BulkAssignRoleVariables>;
}
export const bulkAssignRoleRef: BulkAssignRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the bulkAssignRoleRef:
```typescript
const name = bulkAssignRoleRef.operationName;
console.log(name);
```

### Variables
The `BulkAssignRole` mutation requires an argument of type `BulkAssignRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BulkAssignRoleVariables {
  userIds: string[];
  roleId: string;
}
```
### Return Type
Recall that executing the `BulkAssignRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BulkAssignRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BulkAssignRoleData {
  user_updateMany: number;
}
```
### Using `BulkAssignRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, bulkAssignRole, BulkAssignRoleVariables } from '@firebasegen/adnlab-connector';

// The `BulkAssignRole` mutation requires an argument of type `BulkAssignRoleVariables`:
const bulkAssignRoleVars: BulkAssignRoleVariables = {
  userIds: ..., 
  roleId: ..., 
};

// Call the `bulkAssignRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await bulkAssignRole(bulkAssignRoleVars);
// Variables can be defined inline as well.
const { data } = await bulkAssignRole({ userIds: ..., roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await bulkAssignRole(dataConnect, bulkAssignRoleVars);

console.log(data.user_updateMany);

// Or, you can use the `Promise` API.
bulkAssignRole(bulkAssignRoleVars).then((response) => {
  const data = response.data;
  console.log(data.user_updateMany);
});
```

### Using `BulkAssignRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, bulkAssignRoleRef, BulkAssignRoleVariables } from '@firebasegen/adnlab-connector';

// The `BulkAssignRole` mutation requires an argument of type `BulkAssignRoleVariables`:
const bulkAssignRoleVars: BulkAssignRoleVariables = {
  userIds: ..., 
  roleId: ..., 
};

// Call the `bulkAssignRoleRef()` function to get a reference to the mutation.
const ref = bulkAssignRoleRef(bulkAssignRoleVars);
// Variables can be defined inline as well.
const ref = bulkAssignRoleRef({ userIds: ..., roleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = bulkAssignRoleRef(dataConnect, bulkAssignRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_updateMany);
});
```

