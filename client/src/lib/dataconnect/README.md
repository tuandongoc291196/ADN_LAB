# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetRoles*](#getroles)
  - [*GetRoleById*](#getrolebyid)
  - [*GetRoleByName*](#getrolebyname)
  - [*GetUser*](#getuser)
  - [*GetUserById*](#getuserbyid)
  - [*GetUsers*](#getusers)
  - [*GetUsersByRole*](#getusersbyrole)
  - [*GetStaffMembers*](#getstaffmembers)
  - [*GetDnaServices*](#getdnaservices)
  - [*GetDnaServiceById*](#getdnaservicebyid)
  - [*GetDnaServicesBySampleType*](#getdnaservicesbysampletype)
  - [*GetAtHomeServices*](#getathomeservices)
  - [*GetKits*](#getkits)
  - [*GetAvailableKits*](#getavailablekits)
  - [*GetKitById*](#getkitbyid)
  - [*GetAvailableTimeSlots*](#getavailabletimeslots)
  - [*GetTimeSlotsByStaff*](#gettimeslotsbystaff)
  - [*GetTimeSlotById*](#gettimeslotbyid)
  - [*GetTimeSlotsInRange*](#gettimeslotsinrange)
  - [*GetUserBookings*](#getuserbookings)
  - [*GetMyBookings*](#getmybookings)
  - [*GetBookingById*](#getbookingbyid)
  - [*GetBookingsByStatus*](#getbookingsbystatus)
  - [*GetStaffBookings*](#getstaffbookings)
  - [*GetBookingItems*](#getbookingitems)
  - [*GetBookingItemById*](#getbookingitembyid)
  - [*GetBookingSamples*](#getbookingsamples)
  - [*GetSamplesByStatus*](#getsamplesbystatus)
  - [*GetSampleById*](#getsamplebyid)
  - [*GetStaffSamples*](#getstaffsamples)
  - [*GetBookingTestResults*](#getbookingtestresults)
  - [*GetTestResultById*](#gettestresultbyid)
  - [*GetTestResultsByStatus*](#gettestresultsbystatus)
  - [*GetUserTestResults*](#getusertestresults)
  - [*GetBookingPayment*](#getbookingpayment)
  - [*GetPaymentById*](#getpaymentbyid)
  - [*GetPaymentsByStatus*](#getpaymentsbystatus)
  - [*GetUserPayments*](#getuserpayments)
  - [*GetBookingFeedback*](#getbookingfeedback)
  - [*GetAllFeedback*](#getallfeedback)
  - [*GetFeedbackByRating*](#getfeedbackbyrating)
  - [*GetUserNotifications*](#getusernotifications)
  - [*GetMyNotifications*](#getmynotifications)
  - [*GetUnreadNotificationsCount*](#getunreadnotificationscount)
  - [*GetNotificationById*](#getnotificationbyid)
  - [*GetBookingStats*](#getbookingstats)
  - [*GetServicePopularity*](#getservicepopularity)
  - [*GetMonthlyRevenue*](#getmonthlyrevenue)
- [**Mutations**](#mutations)
  - [*CreateRole*](#createrole)
  - [*UpdateRole*](#updaterole)
  - [*DeleteRole*](#deleterole)
  - [*CreateOrUpdateUser*](#createorupdateuser)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*UpdateUserRole*](#updateuserrole)
  - [*UpdateUserAccountStatus*](#updateuseraccountstatus)
  - [*CreateDnaService*](#creatednaservice)
  - [*UpdateDnaService*](#updatednaservice)
  - [*CreateKit*](#createkit)
  - [*UpdateKitStatus*](#updatekitstatus)
  - [*CreateTimeSlot*](#createtimeslot)
  - [*UpdateTimeSlot*](#updatetimeslot)
  - [*UpdateTimeSlotBookings*](#updatetimeslotbookings)
  - [*CreateBooking*](#createbooking)
  - [*UpdateBookingStatus*](#updatebookingstatus)
  - [*AssignBookingStaff*](#assignbookingstaff)
  - [*AddBookingItem*](#addbookingitem)
  - [*UpdateBookingItem*](#updatebookingitem)
  - [*RemoveBookingItem*](#removebookingitem)
  - [*CreateSample*](#createsample)
  - [*UpdateSampleStatus*](#updatesamplestatus)
  - [*CreateTestResult*](#createtestresult)
  - [*UpdateTestResult*](#updatetestresult)
  - [*VerifyTestResult*](#verifytestresult)
  - [*CreatePayment*](#createpayment)
  - [*UpdatePaymentStatus*](#updatepaymentstatus)
  - [*CreateFeedback*](#createfeedback)
  - [*UpdateFeedback*](#updatefeedback)
  - [*CreateNotification*](#createnotification)
  - [*MarkNotificationRead*](#marknotificationread)
  - [*MarkAllNotificationsRead*](#markallnotificationsread)
  - [*DeleteNotification*](#deletenotification)

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
    shippingAddress?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      dailySlotCount: number;
      maxDailySlots: number;
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

## GetUserById
You can execute the `GetUserById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserById(vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserById(dc: DataConnect, vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByIdRef:
```typescript
const name = getUserByIdRef.operationName;
console.log(name);
```

### Variables
The `GetUserById` query requires an argument of type `GetUserByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByIdVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByIdData {
  user?: {
    id: string;
    fullname: string;
    gender?: string | null;
    avatar?: string | null;
    email: string;
    accountStatus: string;
    authProvider: string;
    phone?: string | null;
    shippingAddress?: string | null;
    roleId: string;
    role: {
      id: string;
      name: string;
      description?: string | null;
    } & Role_Key;
      dailySlotCount: number;
      maxDailySlots: number;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key;
}
```
### Using `GetUserById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserById, GetUserByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  userId: ..., 
};

// Call the `getUserById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserById(getUserByIdVars);
// Variables can be defined inline as well.
const { data } = await getUserById({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserById(dataConnect, getUserByIdVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserById(getUserByIdVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByIdRef, GetUserByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  userId: ..., 
};

// Call the `getUserByIdRef()` function to get a reference to the query.
const ref = getUserByIdRef(getUserByIdVars);
// Variables can be defined inline as well.
const ref = getUserByIdRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByIdRef(dataConnect, getUserByIdVars);

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

## GetUsers
You can execute the `GetUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUsers(vars?: GetUsersVariables): QueryPromise<GetUsersData, GetUsersVariables>;

interface GetUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetUsersVariables): QueryRef<GetUsersData, GetUsersVariables>;
}
export const getUsersRef: GetUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsers(dc: DataConnect, vars?: GetUsersVariables): QueryPromise<GetUsersData, GetUsersVariables>;

interface GetUsersRef {
  ...
  (dc: DataConnect, vars?: GetUsersVariables): QueryRef<GetUsersData, GetUsersVariables>;
}
export const getUsersRef: GetUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsersRef:
```typescript
const name = getUsersRef.operationName;
console.log(name);
```

### Variables
The `GetUsers` query has an optional argument of type `GetUsersVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUsersVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUsersData {
  users: ({
    id: string;
    fullname: string;
    email: string;
    accountStatus: string;
    role: {
      id: string;
      name: string;
    } & Role_Key;
      createdAt: TimestampString;
      lastLogin?: TimestampString | null;
  } & User_Key)[];
}
```
### Using `GetUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsers, GetUsersVariables } from '@firebasegen/adnlab-connector';

// The `GetUsers` query has an optional argument of type `GetUsersVariables`:
const getUsersVars: GetUsersVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsers(getUsersVars);
// Variables can be defined inline as well.
const { data } = await getUsers({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetUsersVariables` argument.
const { data } = await getUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsers(dataConnect, getUsersVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUsers(getUsersVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsersRef, GetUsersVariables } from '@firebasegen/adnlab-connector';

// The `GetUsers` query has an optional argument of type `GetUsersVariables`:
const getUsersVars: GetUsersVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getUsersRef()` function to get a reference to the query.
const ref = getUsersRef(getUsersVars);
// Variables can be defined inline as well.
const ref = getUsersRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetUsersVariables` argument.
const ref = getUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsersRef(dataConnect, getUsersVars);

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
    };
      createdAt: TimestampString;
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
    role: {
      name: string;
    };
      accountStatus: string;
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

## GetDnaServices
You can execute the `GetDnaServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDnaServices(): QueryPromise<GetDnaServicesData, undefined>;

interface GetDnaServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetDnaServicesData, undefined>;
}
export const getDnaServicesRef: GetDnaServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDnaServices(dc: DataConnect): QueryPromise<GetDnaServicesData, undefined>;

interface GetDnaServicesRef {
  ...
  (dc: DataConnect): QueryRef<GetDnaServicesData, undefined>;
}
export const getDnaServicesRef: GetDnaServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDnaServicesRef:
```typescript
const name = getDnaServicesRef.operationName;
console.log(name);
```

### Variables
The `GetDnaServices` query has no variables.
### Return Type
Recall that executing the `GetDnaServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDnaServicesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDnaServicesData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    atHomeAvailable: boolean;
    kitCost: number;
    createdAt: TimestampString;
  } & DnaService_Key)[];
}
```
### Using `GetDnaServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDnaServices } from '@firebasegen/adnlab-connector';


// Call the `getDnaServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDnaServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDnaServices(dataConnect);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
getDnaServices().then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

### Using `GetDnaServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDnaServicesRef } from '@firebasegen/adnlab-connector';


// Call the `getDnaServicesRef()` function to get a reference to the query.
const ref = getDnaServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDnaServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

## GetDnaServiceById
You can execute the `GetDnaServiceById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDnaServiceById(vars: GetDnaServiceByIdVariables): QueryPromise<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;

interface GetDnaServiceByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDnaServiceByIdVariables): QueryRef<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;
}
export const getDnaServiceByIdRef: GetDnaServiceByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDnaServiceById(dc: DataConnect, vars: GetDnaServiceByIdVariables): QueryPromise<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;

interface GetDnaServiceByIdRef {
  ...
  (dc: DataConnect, vars: GetDnaServiceByIdVariables): QueryRef<GetDnaServiceByIdData, GetDnaServiceByIdVariables>;
}
export const getDnaServiceByIdRef: GetDnaServiceByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDnaServiceByIdRef:
```typescript
const name = getDnaServiceByIdRef.operationName;
console.log(name);
```

### Variables
The `GetDnaServiceById` query requires an argument of type `GetDnaServiceByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDnaServiceByIdVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetDnaServiceById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDnaServiceByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDnaServiceByIdData {
  dnaService?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    atHomeAvailable: boolean;
    active: boolean;
    kitCost: number;
    createdAt: TimestampString;
  } & DnaService_Key;
}
```
### Using `GetDnaServiceById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDnaServiceById, GetDnaServiceByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetDnaServiceById` query requires an argument of type `GetDnaServiceByIdVariables`:
const getDnaServiceByIdVars: GetDnaServiceByIdVariables = {
  serviceId: ..., 
};

// Call the `getDnaServiceById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDnaServiceById(getDnaServiceByIdVars);
// Variables can be defined inline as well.
const { data } = await getDnaServiceById({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDnaServiceById(dataConnect, getDnaServiceByIdVars);

console.log(data.dnaService);

// Or, you can use the `Promise` API.
getDnaServiceById(getDnaServiceByIdVars).then((response) => {
  const data = response.data;
  console.log(data.dnaService);
});
```

### Using `GetDnaServiceById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDnaServiceByIdRef, GetDnaServiceByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetDnaServiceById` query requires an argument of type `GetDnaServiceByIdVariables`:
const getDnaServiceByIdVars: GetDnaServiceByIdVariables = {
  serviceId: ..., 
};

// Call the `getDnaServiceByIdRef()` function to get a reference to the query.
const ref = getDnaServiceByIdRef(getDnaServiceByIdVars);
// Variables can be defined inline as well.
const ref = getDnaServiceByIdRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDnaServiceByIdRef(dataConnect, getDnaServiceByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dnaService);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaService);
});
```

## GetDnaServicesBySampleType
You can execute the `GetDnaServicesBySampleType` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDnaServicesBySampleType(vars: GetDnaServicesBySampleTypeVariables): QueryPromise<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;

interface GetDnaServicesBySampleTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDnaServicesBySampleTypeVariables): QueryRef<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;
}
export const getDnaServicesBySampleTypeRef: GetDnaServicesBySampleTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDnaServicesBySampleType(dc: DataConnect, vars: GetDnaServicesBySampleTypeVariables): QueryPromise<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;

interface GetDnaServicesBySampleTypeRef {
  ...
  (dc: DataConnect, vars: GetDnaServicesBySampleTypeVariables): QueryRef<GetDnaServicesBySampleTypeData, GetDnaServicesBySampleTypeVariables>;
}
export const getDnaServicesBySampleTypeRef: GetDnaServicesBySampleTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDnaServicesBySampleTypeRef:
```typescript
const name = getDnaServicesBySampleTypeRef.operationName;
console.log(name);
```

### Variables
The `GetDnaServicesBySampleType` query requires an argument of type `GetDnaServicesBySampleTypeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDnaServicesBySampleTypeVariables {
  sampleType: string;
}
```
### Return Type
Recall that executing the `GetDnaServicesBySampleType` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDnaServicesBySampleTypeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDnaServicesBySampleTypeData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    atHomeAvailable: boolean;
    kitCost: number;
  } & DnaService_Key)[];
}
```
### Using `GetDnaServicesBySampleType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDnaServicesBySampleType, GetDnaServicesBySampleTypeVariables } from '@firebasegen/adnlab-connector';

// The `GetDnaServicesBySampleType` query requires an argument of type `GetDnaServicesBySampleTypeVariables`:
const getDnaServicesBySampleTypeVars: GetDnaServicesBySampleTypeVariables = {
  sampleType: ..., 
};

// Call the `getDnaServicesBySampleType()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDnaServicesBySampleType(getDnaServicesBySampleTypeVars);
// Variables can be defined inline as well.
const { data } = await getDnaServicesBySampleType({ sampleType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDnaServicesBySampleType(dataConnect, getDnaServicesBySampleTypeVars);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
getDnaServicesBySampleType(getDnaServicesBySampleTypeVars).then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

### Using `GetDnaServicesBySampleType`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDnaServicesBySampleTypeRef, GetDnaServicesBySampleTypeVariables } from '@firebasegen/adnlab-connector';

// The `GetDnaServicesBySampleType` query requires an argument of type `GetDnaServicesBySampleTypeVariables`:
const getDnaServicesBySampleTypeVars: GetDnaServicesBySampleTypeVariables = {
  sampleType: ..., 
};

// Call the `getDnaServicesBySampleTypeRef()` function to get a reference to the query.
const ref = getDnaServicesBySampleTypeRef(getDnaServicesBySampleTypeVars);
// Variables can be defined inline as well.
const ref = getDnaServicesBySampleTypeRef({ sampleType: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDnaServicesBySampleTypeRef(dataConnect, getDnaServicesBySampleTypeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

## GetAtHomeServices
You can execute the `GetAtHomeServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAtHomeServices(): QueryPromise<GetAtHomeServicesData, undefined>;

interface GetAtHomeServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAtHomeServicesData, undefined>;
}
export const getAtHomeServicesRef: GetAtHomeServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAtHomeServices(dc: DataConnect): QueryPromise<GetAtHomeServicesData, undefined>;

interface GetAtHomeServicesRef {
  ...
  (dc: DataConnect): QueryRef<GetAtHomeServicesData, undefined>;
}
export const getAtHomeServicesRef: GetAtHomeServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAtHomeServicesRef:
```typescript
const name = getAtHomeServicesRef.operationName;
console.log(name);
```

### Variables
The `GetAtHomeServices` query has no variables.
### Return Type
Recall that executing the `GetAtHomeServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAtHomeServicesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAtHomeServicesData {
  dnaServices: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    sampleType: string;
    kitCost: number;
  } & DnaService_Key)[];
}
```
### Using `GetAtHomeServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAtHomeServices } from '@firebasegen/adnlab-connector';


// Call the `getAtHomeServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAtHomeServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAtHomeServices(dataConnect);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
getAtHomeServices().then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

### Using `GetAtHomeServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAtHomeServicesRef } from '@firebasegen/adnlab-connector';


// Call the `getAtHomeServicesRef()` function to get a reference to the query.
const ref = getAtHomeServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAtHomeServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dnaServices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaServices);
});
```

## GetKits
You can execute the `GetKits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getKits(): QueryPromise<GetKitsData, undefined>;

interface GetKitsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetKitsData, undefined>;
}
export const getKitsRef: GetKitsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getKits(dc: DataConnect): QueryPromise<GetKitsData, undefined>;

interface GetKitsRef {
  ...
  (dc: DataConnect): QueryRef<GetKitsData, undefined>;
}
export const getKitsRef: GetKitsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getKitsRef:
```typescript
const name = getKitsRef.operationName;
console.log(name);
```

### Variables
The `GetKits` query has no variables.
### Return Type
Recall that executing the `GetKits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetKitsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetKitsData {
  kits: ({
    id: string;
    status: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key)[];
}
```
### Using `GetKits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getKits } from '@firebasegen/adnlab-connector';


// Call the `getKits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getKits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getKits(dataConnect);

console.log(data.kits);

// Or, you can use the `Promise` API.
getKits().then((response) => {
  const data = response.data;
  console.log(data.kits);
});
```

### Using `GetKits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getKitsRef } from '@firebasegen/adnlab-connector';


// Call the `getKitsRef()` function to get a reference to the query.
const ref = getKitsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getKitsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.kits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.kits);
});
```

## GetAvailableKits
You can execute the `GetAvailableKits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAvailableKits(): QueryPromise<GetAvailableKitsData, undefined>;

interface GetAvailableKitsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableKitsData, undefined>;
}
export const getAvailableKitsRef: GetAvailableKitsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvailableKits(dc: DataConnect): QueryPromise<GetAvailableKitsData, undefined>;

interface GetAvailableKitsRef {
  ...
  (dc: DataConnect): QueryRef<GetAvailableKitsData, undefined>;
}
export const getAvailableKitsRef: GetAvailableKitsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvailableKitsRef:
```typescript
const name = getAvailableKitsRef.operationName;
console.log(name);
```

### Variables
The `GetAvailableKits` query has no variables.
### Return Type
Recall that executing the `GetAvailableKits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvailableKitsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvailableKitsData {
  kits: ({
    id: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key)[];
}
```
### Using `GetAvailableKits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvailableKits } from '@firebasegen/adnlab-connector';


// Call the `getAvailableKits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvailableKits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvailableKits(dataConnect);

console.log(data.kits);

// Or, you can use the `Promise` API.
getAvailableKits().then((response) => {
  const data = response.data;
  console.log(data.kits);
});
```

### Using `GetAvailableKits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvailableKitsRef } from '@firebasegen/adnlab-connector';


// Call the `getAvailableKitsRef()` function to get a reference to the query.
const ref = getAvailableKitsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvailableKitsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.kits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.kits);
});
```

## GetKitById
You can execute the `GetKitById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getKitById(vars: GetKitByIdVariables): QueryPromise<GetKitByIdData, GetKitByIdVariables>;

interface GetKitByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetKitByIdVariables): QueryRef<GetKitByIdData, GetKitByIdVariables>;
}
export const getKitByIdRef: GetKitByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getKitById(dc: DataConnect, vars: GetKitByIdVariables): QueryPromise<GetKitByIdData, GetKitByIdVariables>;

interface GetKitByIdRef {
  ...
  (dc: DataConnect, vars: GetKitByIdVariables): QueryRef<GetKitByIdData, GetKitByIdVariables>;
}
export const getKitByIdRef: GetKitByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getKitByIdRef:
```typescript
const name = getKitByIdRef.operationName;
console.log(name);
```

### Variables
The `GetKitById` query requires an argument of type `GetKitByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetKitByIdVariables {
  kitId: string;
}
```
### Return Type
Recall that executing the `GetKitById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetKitByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetKitByIdData {
  kit?: {
    id: string;
    status: string;
    amount: number;
    createdAt: TimestampString;
  } & Kit_Key;
}
```
### Using `GetKitById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getKitById, GetKitByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetKitById` query requires an argument of type `GetKitByIdVariables`:
const getKitByIdVars: GetKitByIdVariables = {
  kitId: ..., 
};

// Call the `getKitById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getKitById(getKitByIdVars);
// Variables can be defined inline as well.
const { data } = await getKitById({ kitId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getKitById(dataConnect, getKitByIdVars);

console.log(data.kit);

// Or, you can use the `Promise` API.
getKitById(getKitByIdVars).then((response) => {
  const data = response.data;
  console.log(data.kit);
});
```

### Using `GetKitById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getKitByIdRef, GetKitByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetKitById` query requires an argument of type `GetKitByIdVariables`:
const getKitByIdVars: GetKitByIdVariables = {
  kitId: ..., 
};

// Call the `getKitByIdRef()` function to get a reference to the query.
const ref = getKitByIdRef(getKitByIdVars);
// Variables can be defined inline as well.
const ref = getKitByIdRef({ kitId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getKitByIdRef(dataConnect, getKitByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.kit);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.kit);
});
```

## GetAvailableTimeSlots
You can execute the `GetAvailableTimeSlots` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAvailableTimeSlots(vars: GetAvailableTimeSlotsVariables): QueryPromise<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;

interface GetAvailableTimeSlotsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAvailableTimeSlotsVariables): QueryRef<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;
}
export const getAvailableTimeSlotsRef: GetAvailableTimeSlotsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvailableTimeSlots(dc: DataConnect, vars: GetAvailableTimeSlotsVariables): QueryPromise<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;

interface GetAvailableTimeSlotsRef {
  ...
  (dc: DataConnect, vars: GetAvailableTimeSlotsVariables): QueryRef<GetAvailableTimeSlotsData, GetAvailableTimeSlotsVariables>;
}
export const getAvailableTimeSlotsRef: GetAvailableTimeSlotsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvailableTimeSlotsRef:
```typescript
const name = getAvailableTimeSlotsRef.operationName;
console.log(name);
```

### Variables
The `GetAvailableTimeSlots` query requires an argument of type `GetAvailableTimeSlotsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAvailableTimeSlotsVariables {
  slotDate: DateString;
}
```
### Return Type
Recall that executing the `GetAvailableTimeSlots` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvailableTimeSlotsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvailableTimeSlotsData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    staff?: {
      id: string;
      fullname: string;
    } & User_Key;
      notes?: string | null;
  } & TimeSlot_Key)[];
}
```
### Using `GetAvailableTimeSlots`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvailableTimeSlots, GetAvailableTimeSlotsVariables } from '@firebasegen/adnlab-connector';

// The `GetAvailableTimeSlots` query requires an argument of type `GetAvailableTimeSlotsVariables`:
const getAvailableTimeSlotsVars: GetAvailableTimeSlotsVariables = {
  slotDate: ..., 
};

// Call the `getAvailableTimeSlots()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvailableTimeSlots(getAvailableTimeSlotsVars);
// Variables can be defined inline as well.
const { data } = await getAvailableTimeSlots({ slotDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvailableTimeSlots(dataConnect, getAvailableTimeSlotsVars);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
getAvailableTimeSlots(getAvailableTimeSlotsVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

### Using `GetAvailableTimeSlots`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvailableTimeSlotsRef, GetAvailableTimeSlotsVariables } from '@firebasegen/adnlab-connector';

// The `GetAvailableTimeSlots` query requires an argument of type `GetAvailableTimeSlotsVariables`:
const getAvailableTimeSlotsVars: GetAvailableTimeSlotsVariables = {
  slotDate: ..., 
};

// Call the `getAvailableTimeSlotsRef()` function to get a reference to the query.
const ref = getAvailableTimeSlotsRef(getAvailableTimeSlotsVars);
// Variables can be defined inline as well.
const ref = getAvailableTimeSlotsRef({ slotDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvailableTimeSlotsRef(dataConnect, getAvailableTimeSlotsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

## GetTimeSlotsByStaff
You can execute the `GetTimeSlotsByStaff` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTimeSlotsByStaff(vars: GetTimeSlotsByStaffVariables): QueryPromise<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;

interface GetTimeSlotsByStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsByStaffVariables): QueryRef<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;
}
export const getTimeSlotsByStaffRef: GetTimeSlotsByStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTimeSlotsByStaff(dc: DataConnect, vars: GetTimeSlotsByStaffVariables): QueryPromise<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;

interface GetTimeSlotsByStaffRef {
  ...
  (dc: DataConnect, vars: GetTimeSlotsByStaffVariables): QueryRef<GetTimeSlotsByStaffData, GetTimeSlotsByStaffVariables>;
}
export const getTimeSlotsByStaffRef: GetTimeSlotsByStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTimeSlotsByStaffRef:
```typescript
const name = getTimeSlotsByStaffRef.operationName;
console.log(name);
```

### Variables
The `GetTimeSlotsByStaff` query requires an argument of type `GetTimeSlotsByStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTimeSlotsByStaffVariables {
  staffId: string;
}
```
### Return Type
Recall that executing the `GetTimeSlotsByStaff` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTimeSlotsByStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTimeSlotsByStaffData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    notes?: string | null;
  } & TimeSlot_Key)[];
}
```
### Using `GetTimeSlotsByStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotsByStaff, GetTimeSlotsByStaffVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotsByStaff` query requires an argument of type `GetTimeSlotsByStaffVariables`:
const getTimeSlotsByStaffVars: GetTimeSlotsByStaffVariables = {
  staffId: ..., 
};

// Call the `getTimeSlotsByStaff()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTimeSlotsByStaff(getTimeSlotsByStaffVars);
// Variables can be defined inline as well.
const { data } = await getTimeSlotsByStaff({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTimeSlotsByStaff(dataConnect, getTimeSlotsByStaffVars);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
getTimeSlotsByStaff(getTimeSlotsByStaffVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

### Using `GetTimeSlotsByStaff`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotsByStaffRef, GetTimeSlotsByStaffVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotsByStaff` query requires an argument of type `GetTimeSlotsByStaffVariables`:
const getTimeSlotsByStaffVars: GetTimeSlotsByStaffVariables = {
  staffId: ..., 
};

// Call the `getTimeSlotsByStaffRef()` function to get a reference to the query.
const ref = getTimeSlotsByStaffRef(getTimeSlotsByStaffVars);
// Variables can be defined inline as well.
const ref = getTimeSlotsByStaffRef({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTimeSlotsByStaffRef(dataConnect, getTimeSlotsByStaffVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

## GetTimeSlotById
You can execute the `GetTimeSlotById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTimeSlotById(vars: GetTimeSlotByIdVariables): QueryPromise<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;

interface GetTimeSlotByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotByIdVariables): QueryRef<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;
}
export const getTimeSlotByIdRef: GetTimeSlotByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTimeSlotById(dc: DataConnect, vars: GetTimeSlotByIdVariables): QueryPromise<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;

interface GetTimeSlotByIdRef {
  ...
  (dc: DataConnect, vars: GetTimeSlotByIdVariables): QueryRef<GetTimeSlotByIdData, GetTimeSlotByIdVariables>;
}
export const getTimeSlotByIdRef: GetTimeSlotByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTimeSlotByIdRef:
```typescript
const name = getTimeSlotByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTimeSlotById` query requires an argument of type `GetTimeSlotByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTimeSlotByIdVariables {
  timeSlotId: string;
}
```
### Return Type
Recall that executing the `GetTimeSlotById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTimeSlotByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTimeSlotByIdData {
  timeSlot?: {
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    staff?: {
      id: string;
      fullname: string;
    } & User_Key;
      notes?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & TimeSlot_Key;
}
```
### Using `GetTimeSlotById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotById, GetTimeSlotByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotById` query requires an argument of type `GetTimeSlotByIdVariables`:
const getTimeSlotByIdVars: GetTimeSlotByIdVariables = {
  timeSlotId: ..., 
};

// Call the `getTimeSlotById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTimeSlotById(getTimeSlotByIdVars);
// Variables can be defined inline as well.
const { data } = await getTimeSlotById({ timeSlotId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTimeSlotById(dataConnect, getTimeSlotByIdVars);

console.log(data.timeSlot);

// Or, you can use the `Promise` API.
getTimeSlotById(getTimeSlotByIdVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlot);
});
```

### Using `GetTimeSlotById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotByIdRef, GetTimeSlotByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotById` query requires an argument of type `GetTimeSlotByIdVariables`:
const getTimeSlotByIdVars: GetTimeSlotByIdVariables = {
  timeSlotId: ..., 
};

// Call the `getTimeSlotByIdRef()` function to get a reference to the query.
const ref = getTimeSlotByIdRef(getTimeSlotByIdVars);
// Variables can be defined inline as well.
const ref = getTimeSlotByIdRef({ timeSlotId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTimeSlotByIdRef(dataConnect, getTimeSlotByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeSlot);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlot);
});
```

## GetTimeSlotsInRange
You can execute the `GetTimeSlotsInRange` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTimeSlotsInRange(vars: GetTimeSlotsInRangeVariables): QueryPromise<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;

interface GetTimeSlotsInRangeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsInRangeVariables): QueryRef<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;
}
export const getTimeSlotsInRangeRef: GetTimeSlotsInRangeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTimeSlotsInRange(dc: DataConnect, vars: GetTimeSlotsInRangeVariables): QueryPromise<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;

interface GetTimeSlotsInRangeRef {
  ...
  (dc: DataConnect, vars: GetTimeSlotsInRangeVariables): QueryRef<GetTimeSlotsInRangeData, GetTimeSlotsInRangeVariables>;
}
export const getTimeSlotsInRangeRef: GetTimeSlotsInRangeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTimeSlotsInRangeRef:
```typescript
const name = getTimeSlotsInRangeRef.operationName;
console.log(name);
```

### Variables
The `GetTimeSlotsInRange` query requires an argument of type `GetTimeSlotsInRangeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTimeSlotsInRangeVariables {
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `GetTimeSlotsInRange` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTimeSlotsInRangeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTimeSlotsInRangeData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBookings: number;
    available: boolean;
    staff?: {
      fullname: string;
    };
  } & TimeSlot_Key)[];
}
```
### Using `GetTimeSlotsInRange`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotsInRange, GetTimeSlotsInRangeVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotsInRange` query requires an argument of type `GetTimeSlotsInRangeVariables`:
const getTimeSlotsInRangeVars: GetTimeSlotsInRangeVariables = {
  startDate: ..., 
  endDate: ..., 
};

// Call the `getTimeSlotsInRange()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTimeSlotsInRange(getTimeSlotsInRangeVars);
// Variables can be defined inline as well.
const { data } = await getTimeSlotsInRange({ startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTimeSlotsInRange(dataConnect, getTimeSlotsInRangeVars);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
getTimeSlotsInRange(getTimeSlotsInRangeVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

### Using `GetTimeSlotsInRange`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotsInRangeRef, GetTimeSlotsInRangeVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlotsInRange` query requires an argument of type `GetTimeSlotsInRangeVariables`:
const getTimeSlotsInRangeVars: GetTimeSlotsInRangeVariables = {
  startDate: ..., 
  endDate: ..., 
};

// Call the `getTimeSlotsInRangeRef()` function to get a reference to the query.
const ref = getTimeSlotsInRangeRef(getTimeSlotsInRangeVars);
// Variables can be defined inline as well.
const ref = getTimeSlotsInRangeRef({ startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTimeSlotsInRangeRef(dataConnect, getTimeSlotsInRangeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

## GetUserBookings
You can execute the `GetUserBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserBookings(vars: GetUserBookingsVariables): QueryPromise<GetUserBookingsData, GetUserBookingsVariables>;

interface GetUserBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserBookingsVariables): QueryRef<GetUserBookingsData, GetUserBookingsVariables>;
}
export const getUserBookingsRef: GetUserBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserBookings(dc: DataConnect, vars: GetUserBookingsVariables): QueryPromise<GetUserBookingsData, GetUserBookingsVariables>;

interface GetUserBookingsRef {
  ...
  (dc: DataConnect, vars: GetUserBookingsVariables): QueryRef<GetUserBookingsData, GetUserBookingsVariables>;
}
export const getUserBookingsRef: GetUserBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserBookingsRef:
```typescript
const name = getUserBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetUserBookings` query requires an argument of type `GetUserBookingsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserBookingsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserBookingsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserBookingsData {
  bookings: ({
    id: string;
    status: string;
    collectionMethod: string;
    totalAmount: number;
    timeSlot?: {
      slotDate: DateString;
      startTime: string;
      endTime: string;
    };
      staff?: {
        fullname: string;
      };
        kit?: {
          id: string;
          status: string;
        } & Kit_Key;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Booking_Key)[];
}
```
### Using `GetUserBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserBookings, GetUserBookingsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserBookings` query requires an argument of type `GetUserBookingsVariables`:
const getUserBookingsVars: GetUserBookingsVariables = {
  userId: ..., 
};

// Call the `getUserBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserBookings(getUserBookingsVars);
// Variables can be defined inline as well.
const { data } = await getUserBookings({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserBookings(dataConnect, getUserBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getUserBookings(getUserBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetUserBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserBookingsRef, GetUserBookingsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserBookings` query requires an argument of type `GetUserBookingsVariables`:
const getUserBookingsVars: GetUserBookingsVariables = {
  userId: ..., 
};

// Call the `getUserBookingsRef()` function to get a reference to the query.
const ref = getUserBookingsRef(getUserBookingsVars);
// Variables can be defined inline as well.
const ref = getUserBookingsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserBookingsRef(dataConnect, getUserBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetMyBookings
You can execute the `GetMyBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyBookings(): QueryPromise<GetMyBookingsData, undefined>;

interface GetMyBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookingsData, undefined>;
}
export const getMyBookingsRef: GetMyBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyBookings(dc: DataConnect): QueryPromise<GetMyBookingsData, undefined>;

interface GetMyBookingsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyBookingsData, undefined>;
}
export const getMyBookingsRef: GetMyBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyBookingsRef:
```typescript
const name = getMyBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetMyBookings` query has no variables.
### Return Type
Recall that executing the `GetMyBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyBookingsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyBookingsData {
  bookings: ({
    id: string;
    status: string;
    collectionMethod: string;
    totalAmount: number;
    notes?: string | null;
    timeSlot?: {
      slotDate: DateString;
      startTime: string;
      endTime: string;
    };
      staff?: {
        fullname: string;
      };
        kit?: {
          id: string;
          status: string;
        } & Kit_Key;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
  } & Booking_Key)[];
}
```
### Using `GetMyBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyBookings } from '@firebasegen/adnlab-connector';


// Call the `getMyBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyBookings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyBookings(dataConnect);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getMyBookings().then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetMyBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyBookingsRef } from '@firebasegen/adnlab-connector';


// Call the `getMyBookingsRef()` function to get a reference to the query.
const ref = getMyBookingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyBookingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetBookingById
You can execute the `GetBookingById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingById(vars: GetBookingByIdVariables): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingById(dc: DataConnect, vars: GetBookingByIdVariables): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  (dc: DataConnect, vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingByIdRef:
```typescript
const name = getBookingByIdRef.operationName;
console.log(name);
```

### Variables
The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingByIdVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingByIdData {
  booking?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      email: string;
      phone?: string | null;
      shippingAddress?: string | null;
    } & User_Key;
      staff?: {
        id: string;
        fullname: string;
      } & User_Key;
        kit?: {
          id: string;
          status: string;
          amount: number;
        } & Kit_Key;
          timeSlot?: {
            slotDate: DateString;
            startTime: string;
            endTime: string;
            staff?: {
              fullname: string;
            };
          };
            status: string;
            collectionMethod: string;
            notes?: string | null;
            totalAmount: number;
            createdAt: TimestampString;
            updatedAt?: TimestampString | null;
  } & Booking_Key;
}
```
### Using `GetBookingById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingById, GetBookingByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  bookingId: ..., 
};

// Call the `getBookingById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingById(getBookingByIdVars);
// Variables can be defined inline as well.
const { data } = await getBookingById({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingById(dataConnect, getBookingByIdVars);

console.log(data.booking);

// Or, you can use the `Promise` API.
getBookingById(getBookingByIdVars).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

### Using `GetBookingById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingByIdRef, GetBookingByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  bookingId: ..., 
};

// Call the `getBookingByIdRef()` function to get a reference to the query.
const ref = getBookingByIdRef(getBookingByIdVars);
// Variables can be defined inline as well.
const ref = getBookingByIdRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingByIdRef(dataConnect, getBookingByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.booking);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

## GetBookingsByStatus
You can execute the `GetBookingsByStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingsByStatus(vars: GetBookingsByStatusVariables): QueryPromise<GetBookingsByStatusData, GetBookingsByStatusVariables>;

interface GetBookingsByStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingsByStatusVariables): QueryRef<GetBookingsByStatusData, GetBookingsByStatusVariables>;
}
export const getBookingsByStatusRef: GetBookingsByStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingsByStatus(dc: DataConnect, vars: GetBookingsByStatusVariables): QueryPromise<GetBookingsByStatusData, GetBookingsByStatusVariables>;

interface GetBookingsByStatusRef {
  ...
  (dc: DataConnect, vars: GetBookingsByStatusVariables): QueryRef<GetBookingsByStatusData, GetBookingsByStatusVariables>;
}
export const getBookingsByStatusRef: GetBookingsByStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingsByStatusRef:
```typescript
const name = getBookingsByStatusRef.operationName;
console.log(name);
```

### Variables
The `GetBookingsByStatus` query requires an argument of type `GetBookingsByStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingsByStatusVariables {
  status: string;
}
```
### Return Type
Recall that executing the `GetBookingsByStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingsByStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingsByStatusData {
  bookings: ({
    id: string;
    user: {
      fullname: string;
      email: string;
    };
      status: string;
      collectionMethod: string;
      totalAmount: number;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
      };
        staff?: {
          fullname: string;
        };
          createdAt: TimestampString;
  } & Booking_Key)[];
}
```
### Using `GetBookingsByStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingsByStatus, GetBookingsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingsByStatus` query requires an argument of type `GetBookingsByStatusVariables`:
const getBookingsByStatusVars: GetBookingsByStatusVariables = {
  status: ..., 
};

// Call the `getBookingsByStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingsByStatus(getBookingsByStatusVars);
// Variables can be defined inline as well.
const { data } = await getBookingsByStatus({ status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingsByStatus(dataConnect, getBookingsByStatusVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getBookingsByStatus(getBookingsByStatusVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetBookingsByStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingsByStatusRef, GetBookingsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingsByStatus` query requires an argument of type `GetBookingsByStatusVariables`:
const getBookingsByStatusVars: GetBookingsByStatusVariables = {
  status: ..., 
};

// Call the `getBookingsByStatusRef()` function to get a reference to the query.
const ref = getBookingsByStatusRef(getBookingsByStatusVars);
// Variables can be defined inline as well.
const ref = getBookingsByStatusRef({ status: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingsByStatusRef(dataConnect, getBookingsByStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetStaffBookings
You can execute the `GetStaffBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getStaffBookings(vars: GetStaffBookingsVariables): QueryPromise<GetStaffBookingsData, GetStaffBookingsVariables>;

interface GetStaffBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffBookingsVariables): QueryRef<GetStaffBookingsData, GetStaffBookingsVariables>;
}
export const getStaffBookingsRef: GetStaffBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffBookings(dc: DataConnect, vars: GetStaffBookingsVariables): QueryPromise<GetStaffBookingsData, GetStaffBookingsVariables>;

interface GetStaffBookingsRef {
  ...
  (dc: DataConnect, vars: GetStaffBookingsVariables): QueryRef<GetStaffBookingsData, GetStaffBookingsVariables>;
}
export const getStaffBookingsRef: GetStaffBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffBookingsRef:
```typescript
const name = getStaffBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetStaffBookings` query requires an argument of type `GetStaffBookingsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffBookingsVariables {
  staffId: string;
}
```
### Return Type
Recall that executing the `GetStaffBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffBookingsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStaffBookingsData {
  bookings: ({
    id: string;
    user: {
      fullname: string;
      email: string;
      phone?: string | null;
    };
      status: string;
      collectionMethod: string;
      totalAmount: number;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
        endTime: string;
      };
        notes?: string | null;
        createdAt: TimestampString;
  } & Booking_Key)[];
}
```
### Using `GetStaffBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffBookings, GetStaffBookingsVariables } from '@firebasegen/adnlab-connector';

// The `GetStaffBookings` query requires an argument of type `GetStaffBookingsVariables`:
const getStaffBookingsVars: GetStaffBookingsVariables = {
  staffId: ..., 
};

// Call the `getStaffBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffBookings(getStaffBookingsVars);
// Variables can be defined inline as well.
const { data } = await getStaffBookings({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffBookings(dataConnect, getStaffBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getStaffBookings(getStaffBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetStaffBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffBookingsRef, GetStaffBookingsVariables } from '@firebasegen/adnlab-connector';

// The `GetStaffBookings` query requires an argument of type `GetStaffBookingsVariables`:
const getStaffBookingsVars: GetStaffBookingsVariables = {
  staffId: ..., 
};

// Call the `getStaffBookingsRef()` function to get a reference to the query.
const ref = getStaffBookingsRef(getStaffBookingsVars);
// Variables can be defined inline as well.
const ref = getStaffBookingsRef({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffBookingsRef(dataConnect, getStaffBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetBookingItems
You can execute the `GetBookingItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingItems(vars: GetBookingItemsVariables): QueryPromise<GetBookingItemsData, GetBookingItemsVariables>;

interface GetBookingItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingItemsVariables): QueryRef<GetBookingItemsData, GetBookingItemsVariables>;
}
export const getBookingItemsRef: GetBookingItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingItems(dc: DataConnect, vars: GetBookingItemsVariables): QueryPromise<GetBookingItemsData, GetBookingItemsVariables>;

interface GetBookingItemsRef {
  ...
  (dc: DataConnect, vars: GetBookingItemsVariables): QueryRef<GetBookingItemsData, GetBookingItemsVariables>;
}
export const getBookingItemsRef: GetBookingItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingItemsRef:
```typescript
const name = getBookingItemsRef.operationName;
console.log(name);
```

### Variables
The `GetBookingItems` query requires an argument of type `GetBookingItemsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingItemsVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingItemsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingItemsData {
  bookingItems: ({
    id: string;
    service: {
      id: string;
      name: string;
      description?: string | null;
      price: number;
      durationDays: number;
      sampleType: string;
    } & DnaService_Key;
      price: number;
      quantity: number;
      notes?: string | null;
  } & BookingItem_Key)[];
}
```
### Using `GetBookingItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingItems, GetBookingItemsVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingItems` query requires an argument of type `GetBookingItemsVariables`:
const getBookingItemsVars: GetBookingItemsVariables = {
  bookingId: ..., 
};

// Call the `getBookingItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingItems(getBookingItemsVars);
// Variables can be defined inline as well.
const { data } = await getBookingItems({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingItems(dataConnect, getBookingItemsVars);

console.log(data.bookingItems);

// Or, you can use the `Promise` API.
getBookingItems(getBookingItemsVars).then((response) => {
  const data = response.data;
  console.log(data.bookingItems);
});
```

### Using `GetBookingItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingItemsRef, GetBookingItemsVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingItems` query requires an argument of type `GetBookingItemsVariables`:
const getBookingItemsVars: GetBookingItemsVariables = {
  bookingId: ..., 
};

// Call the `getBookingItemsRef()` function to get a reference to the query.
const ref = getBookingItemsRef(getBookingItemsVars);
// Variables can be defined inline as well.
const ref = getBookingItemsRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingItemsRef(dataConnect, getBookingItemsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookingItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItems);
});
```

## GetBookingItemById
You can execute the `GetBookingItemById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingItemById(vars: GetBookingItemByIdVariables): QueryPromise<GetBookingItemByIdData, GetBookingItemByIdVariables>;

interface GetBookingItemByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingItemByIdVariables): QueryRef<GetBookingItemByIdData, GetBookingItemByIdVariables>;
}
export const getBookingItemByIdRef: GetBookingItemByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingItemById(dc: DataConnect, vars: GetBookingItemByIdVariables): QueryPromise<GetBookingItemByIdData, GetBookingItemByIdVariables>;

interface GetBookingItemByIdRef {
  ...
  (dc: DataConnect, vars: GetBookingItemByIdVariables): QueryRef<GetBookingItemByIdData, GetBookingItemByIdVariables>;
}
export const getBookingItemByIdRef: GetBookingItemByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingItemByIdRef:
```typescript
const name = getBookingItemByIdRef.operationName;
console.log(name);
```

### Variables
The `GetBookingItemById` query requires an argument of type `GetBookingItemByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingItemByIdVariables {
  itemId: string;
}
```
### Return Type
Recall that executing the `GetBookingItemById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingItemByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingItemByIdData {
  bookingItem?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
    } & Booking_Key;
      service: {
        id: string;
        name: string;
        price: number;
      } & DnaService_Key;
        price: number;
        quantity: number;
        notes?: string | null;
  } & BookingItem_Key;
}
```
### Using `GetBookingItemById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingItemById, GetBookingItemByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingItemById` query requires an argument of type `GetBookingItemByIdVariables`:
const getBookingItemByIdVars: GetBookingItemByIdVariables = {
  itemId: ..., 
};

// Call the `getBookingItemById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingItemById(getBookingItemByIdVars);
// Variables can be defined inline as well.
const { data } = await getBookingItemById({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingItemById(dataConnect, getBookingItemByIdVars);

console.log(data.bookingItem);

// Or, you can use the `Promise` API.
getBookingItemById(getBookingItemByIdVars).then((response) => {
  const data = response.data;
  console.log(data.bookingItem);
});
```

### Using `GetBookingItemById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingItemByIdRef, GetBookingItemByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingItemById` query requires an argument of type `GetBookingItemByIdVariables`:
const getBookingItemByIdVars: GetBookingItemByIdVariables = {
  itemId: ..., 
};

// Call the `getBookingItemByIdRef()` function to get a reference to the query.
const ref = getBookingItemByIdRef(getBookingItemByIdVars);
// Variables can be defined inline as well.
const ref = getBookingItemByIdRef({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingItemByIdRef(dataConnect, getBookingItemByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookingItem);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItem);
});
```

## GetBookingSamples
You can execute the `GetBookingSamples` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingSamples(vars: GetBookingSamplesVariables): QueryPromise<GetBookingSamplesData, GetBookingSamplesVariables>;

interface GetBookingSamplesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingSamplesVariables): QueryRef<GetBookingSamplesData, GetBookingSamplesVariables>;
}
export const getBookingSamplesRef: GetBookingSamplesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingSamples(dc: DataConnect, vars: GetBookingSamplesVariables): QueryPromise<GetBookingSamplesData, GetBookingSamplesVariables>;

interface GetBookingSamplesRef {
  ...
  (dc: DataConnect, vars: GetBookingSamplesVariables): QueryRef<GetBookingSamplesData, GetBookingSamplesVariables>;
}
export const getBookingSamplesRef: GetBookingSamplesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingSamplesRef:
```typescript
const name = getBookingSamplesRef.operationName;
console.log(name);
```

### Variables
The `GetBookingSamples` query requires an argument of type `GetBookingSamplesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingSamplesVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingSamples` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingSamplesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingSamplesData {
  samples: ({
    id: string;
    service: {
      name: string;
      sampleType: string;
    };
      staff?: {
        fullname: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
  } & Sample_Key)[];
}
```
### Using `GetBookingSamples`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingSamples, GetBookingSamplesVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingSamples` query requires an argument of type `GetBookingSamplesVariables`:
const getBookingSamplesVars: GetBookingSamplesVariables = {
  bookingId: ..., 
};

// Call the `getBookingSamples()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingSamples(getBookingSamplesVars);
// Variables can be defined inline as well.
const { data } = await getBookingSamples({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingSamples(dataConnect, getBookingSamplesVars);

console.log(data.samples);

// Or, you can use the `Promise` API.
getBookingSamples(getBookingSamplesVars).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

### Using `GetBookingSamples`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingSamplesRef, GetBookingSamplesVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingSamples` query requires an argument of type `GetBookingSamplesVariables`:
const getBookingSamplesVars: GetBookingSamplesVariables = {
  bookingId: ..., 
};

// Call the `getBookingSamplesRef()` function to get a reference to the query.
const ref = getBookingSamplesRef(getBookingSamplesVars);
// Variables can be defined inline as well.
const ref = getBookingSamplesRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingSamplesRef(dataConnect, getBookingSamplesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.samples);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

## GetSamplesByStatus
You can execute the `GetSamplesByStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getSamplesByStatus(vars: GetSamplesByStatusVariables): QueryPromise<GetSamplesByStatusData, GetSamplesByStatusVariables>;

interface GetSamplesByStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSamplesByStatusVariables): QueryRef<GetSamplesByStatusData, GetSamplesByStatusVariables>;
}
export const getSamplesByStatusRef: GetSamplesByStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSamplesByStatus(dc: DataConnect, vars: GetSamplesByStatusVariables): QueryPromise<GetSamplesByStatusData, GetSamplesByStatusVariables>;

interface GetSamplesByStatusRef {
  ...
  (dc: DataConnect, vars: GetSamplesByStatusVariables): QueryRef<GetSamplesByStatusData, GetSamplesByStatusVariables>;
}
export const getSamplesByStatusRef: GetSamplesByStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSamplesByStatusRef:
```typescript
const name = getSamplesByStatusRef.operationName;
console.log(name);
```

### Variables
The `GetSamplesByStatus` query requires an argument of type `GetSamplesByStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSamplesByStatusVariables {
  status: string;
}
```
### Return Type
Recall that executing the `GetSamplesByStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSamplesByStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSamplesByStatusData {
  samples: ({
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
      };
    } & Booking_Key;
      service: {
        name: string;
        sampleType: string;
      };
        staff?: {
          fullname: string;
        };
          collectionDate?: DateString | null;
          status: string;
          notes?: string | null;
  } & Sample_Key)[];
}
```
### Using `GetSamplesByStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSamplesByStatus, GetSamplesByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetSamplesByStatus` query requires an argument of type `GetSamplesByStatusVariables`:
const getSamplesByStatusVars: GetSamplesByStatusVariables = {
  status: ..., 
};

// Call the `getSamplesByStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSamplesByStatus(getSamplesByStatusVars);
// Variables can be defined inline as well.
const { data } = await getSamplesByStatus({ status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSamplesByStatus(dataConnect, getSamplesByStatusVars);

console.log(data.samples);

// Or, you can use the `Promise` API.
getSamplesByStatus(getSamplesByStatusVars).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

### Using `GetSamplesByStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSamplesByStatusRef, GetSamplesByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetSamplesByStatus` query requires an argument of type `GetSamplesByStatusVariables`:
const getSamplesByStatusVars: GetSamplesByStatusVariables = {
  status: ..., 
};

// Call the `getSamplesByStatusRef()` function to get a reference to the query.
const ref = getSamplesByStatusRef(getSamplesByStatusVars);
// Variables can be defined inline as well.
const ref = getSamplesByStatusRef({ status: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSamplesByStatusRef(dataConnect, getSamplesByStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.samples);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

## GetSampleById
You can execute the `GetSampleById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getSampleById(vars: GetSampleByIdVariables): QueryPromise<GetSampleByIdData, GetSampleByIdVariables>;

interface GetSampleByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSampleByIdVariables): QueryRef<GetSampleByIdData, GetSampleByIdVariables>;
}
export const getSampleByIdRef: GetSampleByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSampleById(dc: DataConnect, vars: GetSampleByIdVariables): QueryPromise<GetSampleByIdData, GetSampleByIdVariables>;

interface GetSampleByIdRef {
  ...
  (dc: DataConnect, vars: GetSampleByIdVariables): QueryRef<GetSampleByIdData, GetSampleByIdVariables>;
}
export const getSampleByIdRef: GetSampleByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSampleByIdRef:
```typescript
const name = getSampleByIdRef.operationName;
console.log(name);
```

### Variables
The `GetSampleById` query requires an argument of type `GetSampleByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSampleByIdVariables {
  sampleId: string;
}
```
### Return Type
Recall that executing the `GetSampleById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSampleByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSampleByIdData {
  sample?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
    } & Booking_Key;
      service: {
        name: string;
        sampleType: string;
        description?: string | null;
      };
        staff?: {
          fullname: string;
        };
          collectionDate?: DateString | null;
          status: string;
          notes?: string | null;
  } & Sample_Key;
}
```
### Using `GetSampleById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSampleById, GetSampleByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetSampleById` query requires an argument of type `GetSampleByIdVariables`:
const getSampleByIdVars: GetSampleByIdVariables = {
  sampleId: ..., 
};

// Call the `getSampleById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSampleById(getSampleByIdVars);
// Variables can be defined inline as well.
const { data } = await getSampleById({ sampleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSampleById(dataConnect, getSampleByIdVars);

console.log(data.sample);

// Or, you can use the `Promise` API.
getSampleById(getSampleByIdVars).then((response) => {
  const data = response.data;
  console.log(data.sample);
});
```

### Using `GetSampleById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSampleByIdRef, GetSampleByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetSampleById` query requires an argument of type `GetSampleByIdVariables`:
const getSampleByIdVars: GetSampleByIdVariables = {
  sampleId: ..., 
};

// Call the `getSampleByIdRef()` function to get a reference to the query.
const ref = getSampleByIdRef(getSampleByIdVars);
// Variables can be defined inline as well.
const ref = getSampleByIdRef({ sampleId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSampleByIdRef(dataConnect, getSampleByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sample);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sample);
});
```

## GetStaffSamples
You can execute the `GetStaffSamples` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getStaffSamples(vars: GetStaffSamplesVariables): QueryPromise<GetStaffSamplesData, GetStaffSamplesVariables>;

interface GetStaffSamplesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffSamplesVariables): QueryRef<GetStaffSamplesData, GetStaffSamplesVariables>;
}
export const getStaffSamplesRef: GetStaffSamplesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffSamples(dc: DataConnect, vars: GetStaffSamplesVariables): QueryPromise<GetStaffSamplesData, GetStaffSamplesVariables>;

interface GetStaffSamplesRef {
  ...
  (dc: DataConnect, vars: GetStaffSamplesVariables): QueryRef<GetStaffSamplesData, GetStaffSamplesVariables>;
}
export const getStaffSamplesRef: GetStaffSamplesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffSamplesRef:
```typescript
const name = getStaffSamplesRef.operationName;
console.log(name);
```

### Variables
The `GetStaffSamples` query requires an argument of type `GetStaffSamplesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffSamplesVariables {
  staffId: string;
}
```
### Return Type
Recall that executing the `GetStaffSamples` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffSamplesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStaffSamplesData {
  samples: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      service: {
        name: string;
        sampleType: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
  } & Sample_Key)[];
}
```
### Using `GetStaffSamples`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffSamples, GetStaffSamplesVariables } from '@firebasegen/adnlab-connector';

// The `GetStaffSamples` query requires an argument of type `GetStaffSamplesVariables`:
const getStaffSamplesVars: GetStaffSamplesVariables = {
  staffId: ..., 
};

// Call the `getStaffSamples()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffSamples(getStaffSamplesVars);
// Variables can be defined inline as well.
const { data } = await getStaffSamples({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffSamples(dataConnect, getStaffSamplesVars);

console.log(data.samples);

// Or, you can use the `Promise` API.
getStaffSamples(getStaffSamplesVars).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

### Using `GetStaffSamples`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffSamplesRef, GetStaffSamplesVariables } from '@firebasegen/adnlab-connector';

// The `GetStaffSamples` query requires an argument of type `GetStaffSamplesVariables`:
const getStaffSamplesVars: GetStaffSamplesVariables = {
  staffId: ..., 
};

// Call the `getStaffSamplesRef()` function to get a reference to the query.
const ref = getStaffSamplesRef(getStaffSamplesVars);
// Variables can be defined inline as well.
const ref = getStaffSamplesRef({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffSamplesRef(dataConnect, getStaffSamplesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.samples);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.samples);
});
```

## GetBookingTestResults
You can execute the `GetBookingTestResults` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingTestResults(vars: GetBookingTestResultsVariables): QueryPromise<GetBookingTestResultsData, GetBookingTestResultsVariables>;

interface GetBookingTestResultsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingTestResultsVariables): QueryRef<GetBookingTestResultsData, GetBookingTestResultsVariables>;
}
export const getBookingTestResultsRef: GetBookingTestResultsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingTestResults(dc: DataConnect, vars: GetBookingTestResultsVariables): QueryPromise<GetBookingTestResultsData, GetBookingTestResultsVariables>;

interface GetBookingTestResultsRef {
  ...
  (dc: DataConnect, vars: GetBookingTestResultsVariables): QueryRef<GetBookingTestResultsData, GetBookingTestResultsVariables>;
}
export const getBookingTestResultsRef: GetBookingTestResultsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingTestResultsRef:
```typescript
const name = getBookingTestResultsRef.operationName;
console.log(name);
```

### Variables
The `GetBookingTestResults` query requires an argument of type `GetBookingTestResultsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingTestResultsVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingTestResults` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingTestResultsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingTestResultsData {
  testResults: ({
    id: string;
    sample: {
      id: string;
    } & Sample_Key;
      service: {
        name: string;
      };
        staff?: {
          fullname: string;
        };
          verifier?: {
            fullname: string;
          };
            testDate?: DateString | null;
            reportDate?: DateString | null;
            status: string;
            reportUrl?: string | null;
            notes?: string | null;
  } & TestResult_Key)[];
}
```
### Using `GetBookingTestResults`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingTestResults, GetBookingTestResultsVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingTestResults` query requires an argument of type `GetBookingTestResultsVariables`:
const getBookingTestResultsVars: GetBookingTestResultsVariables = {
  bookingId: ..., 
};

// Call the `getBookingTestResults()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingTestResults(getBookingTestResultsVars);
// Variables can be defined inline as well.
const { data } = await getBookingTestResults({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingTestResults(dataConnect, getBookingTestResultsVars);

console.log(data.testResults);

// Or, you can use the `Promise` API.
getBookingTestResults(getBookingTestResultsVars).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

### Using `GetBookingTestResults`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingTestResultsRef, GetBookingTestResultsVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingTestResults` query requires an argument of type `GetBookingTestResultsVariables`:
const getBookingTestResultsVars: GetBookingTestResultsVariables = {
  bookingId: ..., 
};

// Call the `getBookingTestResultsRef()` function to get a reference to the query.
const ref = getBookingTestResultsRef(getBookingTestResultsVars);
// Variables can be defined inline as well.
const ref = getBookingTestResultsRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingTestResultsRef(dataConnect, getBookingTestResultsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.testResults);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

## GetTestResultById
You can execute the `GetTestResultById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTestResultById(vars: GetTestResultByIdVariables): QueryPromise<GetTestResultByIdData, GetTestResultByIdVariables>;

interface GetTestResultByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTestResultByIdVariables): QueryRef<GetTestResultByIdData, GetTestResultByIdVariables>;
}
export const getTestResultByIdRef: GetTestResultByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTestResultById(dc: DataConnect, vars: GetTestResultByIdVariables): QueryPromise<GetTestResultByIdData, GetTestResultByIdVariables>;

interface GetTestResultByIdRef {
  ...
  (dc: DataConnect, vars: GetTestResultByIdVariables): QueryRef<GetTestResultByIdData, GetTestResultByIdVariables>;
}
export const getTestResultByIdRef: GetTestResultByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTestResultByIdRef:
```typescript
const name = getTestResultByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTestResultById` query requires an argument of type `GetTestResultByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTestResultByIdVariables {
  resultId: string;
}
```
### Return Type
Recall that executing the `GetTestResultById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTestResultByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTestResultByIdData {
  testResult?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
    } & Booking_Key;
      sample: {
        id: string;
        collectionDate?: DateString | null;
      } & Sample_Key;
        service: {
          name: string;
          description?: string | null;
        };
          staff?: {
            fullname: string;
          };
            verifier?: {
              fullname: string;
            };
              testDate?: DateString | null;
              reportDate?: DateString | null;
              resultData?: string | null;
              status: string;
              reportUrl?: string | null;
              notes?: string | null;
  } & TestResult_Key;
}
```
### Using `GetTestResultById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTestResultById, GetTestResultByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetTestResultById` query requires an argument of type `GetTestResultByIdVariables`:
const getTestResultByIdVars: GetTestResultByIdVariables = {
  resultId: ..., 
};

// Call the `getTestResultById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTestResultById(getTestResultByIdVars);
// Variables can be defined inline as well.
const { data } = await getTestResultById({ resultId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTestResultById(dataConnect, getTestResultByIdVars);

console.log(data.testResult);

// Or, you can use the `Promise` API.
getTestResultById(getTestResultByIdVars).then((response) => {
  const data = response.data;
  console.log(data.testResult);
});
```

### Using `GetTestResultById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTestResultByIdRef, GetTestResultByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetTestResultById` query requires an argument of type `GetTestResultByIdVariables`:
const getTestResultByIdVars: GetTestResultByIdVariables = {
  resultId: ..., 
};

// Call the `getTestResultByIdRef()` function to get a reference to the query.
const ref = getTestResultByIdRef(getTestResultByIdVars);
// Variables can be defined inline as well.
const ref = getTestResultByIdRef({ resultId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTestResultByIdRef(dataConnect, getTestResultByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.testResult);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.testResult);
});
```

## GetTestResultsByStatus
You can execute the `GetTestResultsByStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTestResultsByStatus(vars: GetTestResultsByStatusVariables): QueryPromise<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;

interface GetTestResultsByStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTestResultsByStatusVariables): QueryRef<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;
}
export const getTestResultsByStatusRef: GetTestResultsByStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTestResultsByStatus(dc: DataConnect, vars: GetTestResultsByStatusVariables): QueryPromise<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;

interface GetTestResultsByStatusRef {
  ...
  (dc: DataConnect, vars: GetTestResultsByStatusVariables): QueryRef<GetTestResultsByStatusData, GetTestResultsByStatusVariables>;
}
export const getTestResultsByStatusRef: GetTestResultsByStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTestResultsByStatusRef:
```typescript
const name = getTestResultsByStatusRef.operationName;
console.log(name);
```

### Variables
The `GetTestResultsByStatus` query requires an argument of type `GetTestResultsByStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTestResultsByStatusVariables {
  status: string;
}
```
### Return Type
Recall that executing the `GetTestResultsByStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTestResultsByStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTestResultsByStatusData {
  testResults: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      service: {
        name: string;
      };
        staff?: {
          fullname: string;
        };
          testDate?: DateString | null;
          status: string;
  } & TestResult_Key)[];
}
```
### Using `GetTestResultsByStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTestResultsByStatus, GetTestResultsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetTestResultsByStatus` query requires an argument of type `GetTestResultsByStatusVariables`:
const getTestResultsByStatusVars: GetTestResultsByStatusVariables = {
  status: ..., 
};

// Call the `getTestResultsByStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTestResultsByStatus(getTestResultsByStatusVars);
// Variables can be defined inline as well.
const { data } = await getTestResultsByStatus({ status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTestResultsByStatus(dataConnect, getTestResultsByStatusVars);

console.log(data.testResults);

// Or, you can use the `Promise` API.
getTestResultsByStatus(getTestResultsByStatusVars).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

### Using `GetTestResultsByStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTestResultsByStatusRef, GetTestResultsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetTestResultsByStatus` query requires an argument of type `GetTestResultsByStatusVariables`:
const getTestResultsByStatusVars: GetTestResultsByStatusVariables = {
  status: ..., 
};

// Call the `getTestResultsByStatusRef()` function to get a reference to the query.
const ref = getTestResultsByStatusRef(getTestResultsByStatusVars);
// Variables can be defined inline as well.
const ref = getTestResultsByStatusRef({ status: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTestResultsByStatusRef(dataConnect, getTestResultsByStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.testResults);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

## GetUserTestResults
You can execute the `GetUserTestResults` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserTestResults(vars: GetUserTestResultsVariables): QueryPromise<GetUserTestResultsData, GetUserTestResultsVariables>;

interface GetUserTestResultsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserTestResultsVariables): QueryRef<GetUserTestResultsData, GetUserTestResultsVariables>;
}
export const getUserTestResultsRef: GetUserTestResultsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserTestResults(dc: DataConnect, vars: GetUserTestResultsVariables): QueryPromise<GetUserTestResultsData, GetUserTestResultsVariables>;

interface GetUserTestResultsRef {
  ...
  (dc: DataConnect, vars: GetUserTestResultsVariables): QueryRef<GetUserTestResultsData, GetUserTestResultsVariables>;
}
export const getUserTestResultsRef: GetUserTestResultsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserTestResultsRef:
```typescript
const name = getUserTestResultsRef.operationName;
console.log(name);
```

### Variables
The `GetUserTestResults` query requires an argument of type `GetUserTestResultsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserTestResultsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserTestResults` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserTestResultsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserTestResultsData {
  testResults: ({
    id: string;
    service: {
      name: string;
    };
      testDate?: DateString | null;
      reportDate?: DateString | null;
      status: string;
      reportUrl?: string | null;
  } & TestResult_Key)[];
}
```
### Using `GetUserTestResults`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserTestResults, GetUserTestResultsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserTestResults` query requires an argument of type `GetUserTestResultsVariables`:
const getUserTestResultsVars: GetUserTestResultsVariables = {
  userId: ..., 
};

// Call the `getUserTestResults()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserTestResults(getUserTestResultsVars);
// Variables can be defined inline as well.
const { data } = await getUserTestResults({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserTestResults(dataConnect, getUserTestResultsVars);

console.log(data.testResults);

// Or, you can use the `Promise` API.
getUserTestResults(getUserTestResultsVars).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

### Using `GetUserTestResults`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserTestResultsRef, GetUserTestResultsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserTestResults` query requires an argument of type `GetUserTestResultsVariables`:
const getUserTestResultsVars: GetUserTestResultsVariables = {
  userId: ..., 
};

// Call the `getUserTestResultsRef()` function to get a reference to the query.
const ref = getUserTestResultsRef(getUserTestResultsVars);
// Variables can be defined inline as well.
const ref = getUserTestResultsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserTestResultsRef(dataConnect, getUserTestResultsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.testResults);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.testResults);
});
```

## GetBookingPayment
You can execute the `GetBookingPayment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingPayment(vars: GetBookingPaymentVariables): QueryPromise<GetBookingPaymentData, GetBookingPaymentVariables>;

interface GetBookingPaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingPaymentVariables): QueryRef<GetBookingPaymentData, GetBookingPaymentVariables>;
}
export const getBookingPaymentRef: GetBookingPaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingPayment(dc: DataConnect, vars: GetBookingPaymentVariables): QueryPromise<GetBookingPaymentData, GetBookingPaymentVariables>;

interface GetBookingPaymentRef {
  ...
  (dc: DataConnect, vars: GetBookingPaymentVariables): QueryRef<GetBookingPaymentData, GetBookingPaymentVariables>;
}
export const getBookingPaymentRef: GetBookingPaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingPaymentRef:
```typescript
const name = getBookingPaymentRef.operationName;
console.log(name);
```

### Variables
The `GetBookingPayment` query requires an argument of type `GetBookingPaymentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingPaymentVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingPayment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingPaymentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingPaymentData {
  payments: ({
    id: string;
    amount: number;
    paymentMethod: string;
    transactionId?: string | null;
    status: string;
    paymentDate?: DateString | null;
    refundDetail?: string | null;
  } & Payment_Key)[];
}
```
### Using `GetBookingPayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingPayment, GetBookingPaymentVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingPayment` query requires an argument of type `GetBookingPaymentVariables`:
const getBookingPaymentVars: GetBookingPaymentVariables = {
  bookingId: ..., 
};

// Call the `getBookingPayment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingPayment(getBookingPaymentVars);
// Variables can be defined inline as well.
const { data } = await getBookingPayment({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingPayment(dataConnect, getBookingPaymentVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
getBookingPayment(getBookingPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `GetBookingPayment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingPaymentRef, GetBookingPaymentVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingPayment` query requires an argument of type `GetBookingPaymentVariables`:
const getBookingPaymentVars: GetBookingPaymentVariables = {
  bookingId: ..., 
};

// Call the `getBookingPaymentRef()` function to get a reference to the query.
const ref = getBookingPaymentRef(getBookingPaymentVars);
// Variables can be defined inline as well.
const ref = getBookingPaymentRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingPaymentRef(dataConnect, getBookingPaymentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetPaymentById
You can execute the `GetPaymentById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPaymentById(vars: GetPaymentByIdVariables): QueryPromise<GetPaymentByIdData, GetPaymentByIdVariables>;

interface GetPaymentByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentByIdVariables): QueryRef<GetPaymentByIdData, GetPaymentByIdVariables>;
}
export const getPaymentByIdRef: GetPaymentByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPaymentById(dc: DataConnect, vars: GetPaymentByIdVariables): QueryPromise<GetPaymentByIdData, GetPaymentByIdVariables>;

interface GetPaymentByIdRef {
  ...
  (dc: DataConnect, vars: GetPaymentByIdVariables): QueryRef<GetPaymentByIdData, GetPaymentByIdVariables>;
}
export const getPaymentByIdRef: GetPaymentByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPaymentByIdRef:
```typescript
const name = getPaymentByIdRef.operationName;
console.log(name);
```

### Variables
The `GetPaymentById` query requires an argument of type `GetPaymentByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPaymentByIdVariables {
  paymentId: string;
}
```
### Return Type
Recall that executing the `GetPaymentById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPaymentByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPaymentByIdData {
  payment?: {
    id: string;
    booking: {
      id: string;
      user: {
        fullname: string;
        email: string;
      };
        totalAmount: number;
    } & Booking_Key;
      amount: number;
      paymentMethod: string;
      transactionId?: string | null;
      status: string;
      paymentDate?: DateString | null;
      refundDetail?: string | null;
  } & Payment_Key;
}
```
### Using `GetPaymentById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPaymentById, GetPaymentByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetPaymentById` query requires an argument of type `GetPaymentByIdVariables`:
const getPaymentByIdVars: GetPaymentByIdVariables = {
  paymentId: ..., 
};

// Call the `getPaymentById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPaymentById(getPaymentByIdVars);
// Variables can be defined inline as well.
const { data } = await getPaymentById({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPaymentById(dataConnect, getPaymentByIdVars);

console.log(data.payment);

// Or, you can use the `Promise` API.
getPaymentById(getPaymentByIdVars).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

### Using `GetPaymentById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPaymentByIdRef, GetPaymentByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetPaymentById` query requires an argument of type `GetPaymentByIdVariables`:
const getPaymentByIdVars: GetPaymentByIdVariables = {
  paymentId: ..., 
};

// Call the `getPaymentByIdRef()` function to get a reference to the query.
const ref = getPaymentByIdRef(getPaymentByIdVars);
// Variables can be defined inline as well.
const ref = getPaymentByIdRef({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPaymentByIdRef(dataConnect, getPaymentByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

## GetPaymentsByStatus
You can execute the `GetPaymentsByStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPaymentsByStatus(vars: GetPaymentsByStatusVariables): QueryPromise<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;

interface GetPaymentsByStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentsByStatusVariables): QueryRef<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;
}
export const getPaymentsByStatusRef: GetPaymentsByStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPaymentsByStatus(dc: DataConnect, vars: GetPaymentsByStatusVariables): QueryPromise<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;

interface GetPaymentsByStatusRef {
  ...
  (dc: DataConnect, vars: GetPaymentsByStatusVariables): QueryRef<GetPaymentsByStatusData, GetPaymentsByStatusVariables>;
}
export const getPaymentsByStatusRef: GetPaymentsByStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPaymentsByStatusRef:
```typescript
const name = getPaymentsByStatusRef.operationName;
console.log(name);
```

### Variables
The `GetPaymentsByStatus` query requires an argument of type `GetPaymentsByStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPaymentsByStatusVariables {
  status: string;
}
```
### Return Type
Recall that executing the `GetPaymentsByStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPaymentsByStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPaymentsByStatusData {
  payments: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      amount: number;
      paymentMethod: string;
      transactionId?: string | null;
      paymentDate?: DateString | null;
  } & Payment_Key)[];
}
```
### Using `GetPaymentsByStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPaymentsByStatus, GetPaymentsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetPaymentsByStatus` query requires an argument of type `GetPaymentsByStatusVariables`:
const getPaymentsByStatusVars: GetPaymentsByStatusVariables = {
  status: ..., 
};

// Call the `getPaymentsByStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPaymentsByStatus(getPaymentsByStatusVars);
// Variables can be defined inline as well.
const { data } = await getPaymentsByStatus({ status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPaymentsByStatus(dataConnect, getPaymentsByStatusVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
getPaymentsByStatus(getPaymentsByStatusVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `GetPaymentsByStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPaymentsByStatusRef, GetPaymentsByStatusVariables } from '@firebasegen/adnlab-connector';

// The `GetPaymentsByStatus` query requires an argument of type `GetPaymentsByStatusVariables`:
const getPaymentsByStatusVars: GetPaymentsByStatusVariables = {
  status: ..., 
};

// Call the `getPaymentsByStatusRef()` function to get a reference to the query.
const ref = getPaymentsByStatusRef(getPaymentsByStatusVars);
// Variables can be defined inline as well.
const ref = getPaymentsByStatusRef({ status: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPaymentsByStatusRef(dataConnect, getPaymentsByStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetUserPayments
You can execute the `GetUserPayments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserPayments(vars: GetUserPaymentsVariables): QueryPromise<GetUserPaymentsData, GetUserPaymentsVariables>;

interface GetUserPaymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPaymentsVariables): QueryRef<GetUserPaymentsData, GetUserPaymentsVariables>;
}
export const getUserPaymentsRef: GetUserPaymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPayments(dc: DataConnect, vars: GetUserPaymentsVariables): QueryPromise<GetUserPaymentsData, GetUserPaymentsVariables>;

interface GetUserPaymentsRef {
  ...
  (dc: DataConnect, vars: GetUserPaymentsVariables): QueryRef<GetUserPaymentsData, GetUserPaymentsVariables>;
}
export const getUserPaymentsRef: GetUserPaymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPaymentsRef:
```typescript
const name = getUserPaymentsRef.operationName;
console.log(name);
```

### Variables
The `GetUserPayments` query requires an argument of type `GetUserPaymentsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPaymentsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserPayments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPaymentsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserPaymentsData {
  payments: ({
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    paymentDate?: DateString | null;
  } & Payment_Key)[];
}
```
### Using `GetUserPayments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPayments, GetUserPaymentsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserPayments` query requires an argument of type `GetUserPaymentsVariables`:
const getUserPaymentsVars: GetUserPaymentsVariables = {
  userId: ..., 
};

// Call the `getUserPayments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPayments(getUserPaymentsVars);
// Variables can be defined inline as well.
const { data } = await getUserPayments({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPayments(dataConnect, getUserPaymentsVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
getUserPayments(getUserPaymentsVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `GetUserPayments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPaymentsRef, GetUserPaymentsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserPayments` query requires an argument of type `GetUserPaymentsVariables`:
const getUserPaymentsVars: GetUserPaymentsVariables = {
  userId: ..., 
};

// Call the `getUserPaymentsRef()` function to get a reference to the query.
const ref = getUserPaymentsRef(getUserPaymentsVars);
// Variables can be defined inline as well.
const ref = getUserPaymentsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPaymentsRef(dataConnect, getUserPaymentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetBookingFeedback
You can execute the `GetBookingFeedback` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingFeedback(vars: GetBookingFeedbackVariables): QueryPromise<GetBookingFeedbackData, GetBookingFeedbackVariables>;

interface GetBookingFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingFeedbackVariables): QueryRef<GetBookingFeedbackData, GetBookingFeedbackVariables>;
}
export const getBookingFeedbackRef: GetBookingFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingFeedback(dc: DataConnect, vars: GetBookingFeedbackVariables): QueryPromise<GetBookingFeedbackData, GetBookingFeedbackVariables>;

interface GetBookingFeedbackRef {
  ...
  (dc: DataConnect, vars: GetBookingFeedbackVariables): QueryRef<GetBookingFeedbackData, GetBookingFeedbackVariables>;
}
export const getBookingFeedbackRef: GetBookingFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingFeedbackRef:
```typescript
const name = getBookingFeedbackRef.operationName;
console.log(name);
```

### Variables
The `GetBookingFeedback` query requires an argument of type `GetBookingFeedbackVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingFeedbackVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingFeedback` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingFeedbackData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingFeedbackData {
  feedbacks: ({
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: TimestampString;
  } & Feedback_Key)[];
}
```
### Using `GetBookingFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingFeedback, GetBookingFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingFeedback` query requires an argument of type `GetBookingFeedbackVariables`:
const getBookingFeedbackVars: GetBookingFeedbackVariables = {
  bookingId: ..., 
};

// Call the `getBookingFeedback()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingFeedback(getBookingFeedbackVars);
// Variables can be defined inline as well.
const { data } = await getBookingFeedback({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingFeedback(dataConnect, getBookingFeedbackVars);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
getBookingFeedback(getBookingFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

### Using `GetBookingFeedback`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingFeedbackRef, GetBookingFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingFeedback` query requires an argument of type `GetBookingFeedbackVariables`:
const getBookingFeedbackVars: GetBookingFeedbackVariables = {
  bookingId: ..., 
};

// Call the `getBookingFeedbackRef()` function to get a reference to the query.
const ref = getBookingFeedbackRef(getBookingFeedbackVars);
// Variables can be defined inline as well.
const ref = getBookingFeedbackRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingFeedbackRef(dataConnect, getBookingFeedbackVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

## GetAllFeedback
You can execute the `GetAllFeedback` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAllFeedback(vars?: GetAllFeedbackVariables): QueryPromise<GetAllFeedbackData, GetAllFeedbackVariables>;

interface GetAllFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetAllFeedbackVariables): QueryRef<GetAllFeedbackData, GetAllFeedbackVariables>;
}
export const getAllFeedbackRef: GetAllFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllFeedback(dc: DataConnect, vars?: GetAllFeedbackVariables): QueryPromise<GetAllFeedbackData, GetAllFeedbackVariables>;

interface GetAllFeedbackRef {
  ...
  (dc: DataConnect, vars?: GetAllFeedbackVariables): QueryRef<GetAllFeedbackData, GetAllFeedbackVariables>;
}
export const getAllFeedbackRef: GetAllFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllFeedbackRef:
```typescript
const name = getAllFeedbackRef.operationName;
console.log(name);
```

### Variables
The `GetAllFeedback` query has an optional argument of type `GetAllFeedbackVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAllFeedbackVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetAllFeedback` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllFeedbackData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAllFeedbackData {
  feedbacks: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      rating: number;
      comment?: string | null;
      createdAt: TimestampString;
  } & Feedback_Key)[];
}
```
### Using `GetAllFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllFeedback, GetAllFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `GetAllFeedback` query has an optional argument of type `GetAllFeedbackVariables`:
const getAllFeedbackVars: GetAllFeedbackVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAllFeedback()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllFeedback(getAllFeedbackVars);
// Variables can be defined inline as well.
const { data } = await getAllFeedback({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetAllFeedbackVariables` argument.
const { data } = await getAllFeedback();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllFeedback(dataConnect, getAllFeedbackVars);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
getAllFeedback(getAllFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

### Using `GetAllFeedback`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllFeedbackRef, GetAllFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `GetAllFeedback` query has an optional argument of type `GetAllFeedbackVariables`:
const getAllFeedbackVars: GetAllFeedbackVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getAllFeedbackRef()` function to get a reference to the query.
const ref = getAllFeedbackRef(getAllFeedbackVars);
// Variables can be defined inline as well.
const ref = getAllFeedbackRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetAllFeedbackVariables` argument.
const ref = getAllFeedbackRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllFeedbackRef(dataConnect, getAllFeedbackVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

## GetFeedbackByRating
You can execute the `GetFeedbackByRating` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getFeedbackByRating(vars: GetFeedbackByRatingVariables): QueryPromise<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;

interface GetFeedbackByRatingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFeedbackByRatingVariables): QueryRef<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;
}
export const getFeedbackByRatingRef: GetFeedbackByRatingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFeedbackByRating(dc: DataConnect, vars: GetFeedbackByRatingVariables): QueryPromise<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;

interface GetFeedbackByRatingRef {
  ...
  (dc: DataConnect, vars: GetFeedbackByRatingVariables): QueryRef<GetFeedbackByRatingData, GetFeedbackByRatingVariables>;
}
export const getFeedbackByRatingRef: GetFeedbackByRatingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFeedbackByRatingRef:
```typescript
const name = getFeedbackByRatingRef.operationName;
console.log(name);
```

### Variables
The `GetFeedbackByRating` query requires an argument of type `GetFeedbackByRatingVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFeedbackByRatingVariables {
  rating: number;
}
```
### Return Type
Recall that executing the `GetFeedbackByRating` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFeedbackByRatingData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFeedbackByRatingData {
  feedbacks: ({
    id: string;
    booking: {
      user: {
        fullname: string;
      };
    };
      rating: number;
      comment?: string | null;
      createdAt: TimestampString;
  } & Feedback_Key)[];
}
```
### Using `GetFeedbackByRating`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFeedbackByRating, GetFeedbackByRatingVariables } from '@firebasegen/adnlab-connector';

// The `GetFeedbackByRating` query requires an argument of type `GetFeedbackByRatingVariables`:
const getFeedbackByRatingVars: GetFeedbackByRatingVariables = {
  rating: ..., 
};

// Call the `getFeedbackByRating()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFeedbackByRating(getFeedbackByRatingVars);
// Variables can be defined inline as well.
const { data } = await getFeedbackByRating({ rating: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFeedbackByRating(dataConnect, getFeedbackByRatingVars);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
getFeedbackByRating(getFeedbackByRatingVars).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

### Using `GetFeedbackByRating`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFeedbackByRatingRef, GetFeedbackByRatingVariables } from '@firebasegen/adnlab-connector';

// The `GetFeedbackByRating` query requires an argument of type `GetFeedbackByRatingVariables`:
const getFeedbackByRatingVars: GetFeedbackByRatingVariables = {
  rating: ..., 
};

// Call the `getFeedbackByRatingRef()` function to get a reference to the query.
const ref = getFeedbackByRatingRef(getFeedbackByRatingVars);
// Variables can be defined inline as well.
const ref = getFeedbackByRatingRef({ rating: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFeedbackByRatingRef(dataConnect, getFeedbackByRatingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

## GetUserNotifications
You can execute the `GetUserNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserNotifications(vars: GetUserNotificationsVariables): QueryPromise<GetUserNotificationsData, GetUserNotificationsVariables>;

interface GetUserNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserNotificationsVariables): QueryRef<GetUserNotificationsData, GetUserNotificationsVariables>;
}
export const getUserNotificationsRef: GetUserNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserNotifications(dc: DataConnect, vars: GetUserNotificationsVariables): QueryPromise<GetUserNotificationsData, GetUserNotificationsVariables>;

interface GetUserNotificationsRef {
  ...
  (dc: DataConnect, vars: GetUserNotificationsVariables): QueryRef<GetUserNotificationsData, GetUserNotificationsVariables>;
}
export const getUserNotificationsRef: GetUserNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserNotificationsRef:
```typescript
const name = getUserNotificationsRef.operationName;
console.log(name);
```

### Variables
The `GetUserNotifications` query requires an argument of type `GetUserNotificationsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserNotificationsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserNotificationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      fullname: string;
    };
      title: string;
      message: string;
      isRead: boolean;
      type: string;
      createdAt: TimestampString;
  } & Notification_Key)[];
}
```
### Using `GetUserNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserNotifications, GetUserNotificationsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserNotifications` query requires an argument of type `GetUserNotificationsVariables`:
const getUserNotificationsVars: GetUserNotificationsVariables = {
  userId: ..., 
};

// Call the `getUserNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserNotifications(getUserNotificationsVars);
// Variables can be defined inline as well.
const { data } = await getUserNotifications({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserNotifications(dataConnect, getUserNotificationsVars);

console.log(data.notifications);

// Or, you can use the `Promise` API.
getUserNotifications(getUserNotificationsVars).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `GetUserNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserNotificationsRef, GetUserNotificationsVariables } from '@firebasegen/adnlab-connector';

// The `GetUserNotifications` query requires an argument of type `GetUserNotificationsVariables`:
const getUserNotificationsVars: GetUserNotificationsVariables = {
  userId: ..., 
};

// Call the `getUserNotificationsRef()` function to get a reference to the query.
const ref = getUserNotificationsRef(getUserNotificationsVars);
// Variables can be defined inline as well.
const ref = getUserNotificationsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserNotificationsRef(dataConnect, getUserNotificationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## GetMyNotifications
You can execute the `GetMyNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyNotifications(): QueryPromise<GetMyNotificationsData, undefined>;

interface GetMyNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyNotificationsData, undefined>;
}
export const getMyNotificationsRef: GetMyNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyNotifications(dc: DataConnect): QueryPromise<GetMyNotificationsData, undefined>;

interface GetMyNotificationsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyNotificationsData, undefined>;
}
export const getMyNotificationsRef: GetMyNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyNotificationsRef:
```typescript
const name = getMyNotificationsRef.operationName;
console.log(name);
```

### Variables
The `GetMyNotifications` query has no variables.
### Return Type
Recall that executing the `GetMyNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyNotificationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyNotificationsData {
  notifications: ({
    id: string;
    staff?: {
      fullname: string;
    };
      title: string;
      message: string;
      isRead: boolean;
      type: string;
      createdAt: TimestampString;
  } & Notification_Key)[];
}
```
### Using `GetMyNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyNotifications } from '@firebasegen/adnlab-connector';


// Call the `getMyNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyNotifications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyNotifications(dataConnect);

console.log(data.notifications);

// Or, you can use the `Promise` API.
getMyNotifications().then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `GetMyNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyNotificationsRef } from '@firebasegen/adnlab-connector';


// Call the `getMyNotificationsRef()` function to get a reference to the query.
const ref = getMyNotificationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyNotificationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## GetUnreadNotificationsCount
You can execute the `GetUnreadNotificationsCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUnreadNotificationsCount(vars: GetUnreadNotificationsCountVariables): QueryPromise<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;

interface GetUnreadNotificationsCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUnreadNotificationsCountVariables): QueryRef<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;
}
export const getUnreadNotificationsCountRef: GetUnreadNotificationsCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUnreadNotificationsCount(dc: DataConnect, vars: GetUnreadNotificationsCountVariables): QueryPromise<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;

interface GetUnreadNotificationsCountRef {
  ...
  (dc: DataConnect, vars: GetUnreadNotificationsCountVariables): QueryRef<GetUnreadNotificationsCountData, GetUnreadNotificationsCountVariables>;
}
export const getUnreadNotificationsCountRef: GetUnreadNotificationsCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUnreadNotificationsCountRef:
```typescript
const name = getUnreadNotificationsCountRef.operationName;
console.log(name);
```

### Variables
The `GetUnreadNotificationsCount` query requires an argument of type `GetUnreadNotificationsCountVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUnreadNotificationsCountVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUnreadNotificationsCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUnreadNotificationsCountData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUnreadNotificationsCountData {
  notifications: ({
    id: string;
  } & Notification_Key)[];
}
```
### Using `GetUnreadNotificationsCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUnreadNotificationsCount, GetUnreadNotificationsCountVariables } from '@firebasegen/adnlab-connector';

// The `GetUnreadNotificationsCount` query requires an argument of type `GetUnreadNotificationsCountVariables`:
const getUnreadNotificationsCountVars: GetUnreadNotificationsCountVariables = {
  userId: ..., 
};

// Call the `getUnreadNotificationsCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUnreadNotificationsCount(getUnreadNotificationsCountVars);
// Variables can be defined inline as well.
const { data } = await getUnreadNotificationsCount({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUnreadNotificationsCount(dataConnect, getUnreadNotificationsCountVars);

console.log(data.notifications);

// Or, you can use the `Promise` API.
getUnreadNotificationsCount(getUnreadNotificationsCountVars).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `GetUnreadNotificationsCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUnreadNotificationsCountRef, GetUnreadNotificationsCountVariables } from '@firebasegen/adnlab-connector';

// The `GetUnreadNotificationsCount` query requires an argument of type `GetUnreadNotificationsCountVariables`:
const getUnreadNotificationsCountVars: GetUnreadNotificationsCountVariables = {
  userId: ..., 
};

// Call the `getUnreadNotificationsCountRef()` function to get a reference to the query.
const ref = getUnreadNotificationsCountRef(getUnreadNotificationsCountVars);
// Variables can be defined inline as well.
const ref = getUnreadNotificationsCountRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUnreadNotificationsCountRef(dataConnect, getUnreadNotificationsCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## GetNotificationById
You can execute the `GetNotificationById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getNotificationById(vars: GetNotificationByIdVariables): QueryPromise<GetNotificationByIdData, GetNotificationByIdVariables>;

interface GetNotificationByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationByIdVariables): QueryRef<GetNotificationByIdData, GetNotificationByIdVariables>;
}
export const getNotificationByIdRef: GetNotificationByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotificationById(dc: DataConnect, vars: GetNotificationByIdVariables): QueryPromise<GetNotificationByIdData, GetNotificationByIdVariables>;

interface GetNotificationByIdRef {
  ...
  (dc: DataConnect, vars: GetNotificationByIdVariables): QueryRef<GetNotificationByIdData, GetNotificationByIdVariables>;
}
export const getNotificationByIdRef: GetNotificationByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotificationByIdRef:
```typescript
const name = getNotificationByIdRef.operationName;
console.log(name);
```

### Variables
The `GetNotificationById` query requires an argument of type `GetNotificationByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotificationByIdVariables {
  notificationId: string;
}
```
### Return Type
Recall that executing the `GetNotificationById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotificationByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNotificationByIdData {
  notification?: {
    id: string;
    user?: {
      fullname: string;
    };
      staff?: {
        fullname: string;
      };
        title: string;
        message: string;
        isRead: boolean;
        type: string;
        createdAt: TimestampString;
  } & Notification_Key;
}
```
### Using `GetNotificationById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotificationById, GetNotificationByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetNotificationById` query requires an argument of type `GetNotificationByIdVariables`:
const getNotificationByIdVars: GetNotificationByIdVariables = {
  notificationId: ..., 
};

// Call the `getNotificationById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotificationById(getNotificationByIdVars);
// Variables can be defined inline as well.
const { data } = await getNotificationById({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotificationById(dataConnect, getNotificationByIdVars);

console.log(data.notification);

// Or, you can use the `Promise` API.
getNotificationById(getNotificationByIdVars).then((response) => {
  const data = response.data;
  console.log(data.notification);
});
```

### Using `GetNotificationById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotificationByIdRef, GetNotificationByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetNotificationById` query requires an argument of type `GetNotificationByIdVariables`:
const getNotificationByIdVars: GetNotificationByIdVariables = {
  notificationId: ..., 
};

// Call the `getNotificationByIdRef()` function to get a reference to the query.
const ref = getNotificationByIdRef(getNotificationByIdVars);
// Variables can be defined inline as well.
const ref = getNotificationByIdRef({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotificationByIdRef(dataConnect, getNotificationByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notification);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notification);
});
```

## GetBookingStats
You can execute the `GetBookingStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingStats(): QueryPromise<GetBookingStatsData, undefined>;

interface GetBookingStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBookingStatsData, undefined>;
}
export const getBookingStatsRef: GetBookingStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingStats(dc: DataConnect): QueryPromise<GetBookingStatsData, undefined>;

interface GetBookingStatsRef {
  ...
  (dc: DataConnect): QueryRef<GetBookingStatsData, undefined>;
}
export const getBookingStatsRef: GetBookingStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingStatsRef:
```typescript
const name = getBookingStatsRef.operationName;
console.log(name);
```

### Variables
The `GetBookingStats` query has no variables.
### Return Type
Recall that executing the `GetBookingStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingStatsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingStatsData {
  bookings: ({
    id: string;
    status: string;
    totalAmount: number;
    createdAt: TimestampString;
  } & Booking_Key)[];
}
```
### Using `GetBookingStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingStats } from '@firebasegen/adnlab-connector';


// Call the `getBookingStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingStats();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingStats(dataConnect);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getBookingStats().then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetBookingStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingStatsRef } from '@firebasegen/adnlab-connector';


// Call the `getBookingStatsRef()` function to get a reference to the query.
const ref = getBookingStatsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingStatsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetServicePopularity
You can execute the `GetServicePopularity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServicePopularity(): QueryPromise<GetServicePopularityData, undefined>;

interface GetServicePopularityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServicePopularityData, undefined>;
}
export const getServicePopularityRef: GetServicePopularityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServicePopularity(dc: DataConnect): QueryPromise<GetServicePopularityData, undefined>;

interface GetServicePopularityRef {
  ...
  (dc: DataConnect): QueryRef<GetServicePopularityData, undefined>;
}
export const getServicePopularityRef: GetServicePopularityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServicePopularityRef:
```typescript
const name = getServicePopularityRef.operationName;
console.log(name);
```

### Variables
The `GetServicePopularity` query has no variables.
### Return Type
Recall that executing the `GetServicePopularity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServicePopularityData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServicePopularityData {
  bookingItems: ({
    service: {
      id: string;
      name: string;
    } & DnaService_Key;
      quantity: number;
  })[];
}
```
### Using `GetServicePopularity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServicePopularity } from '@firebasegen/adnlab-connector';


// Call the `getServicePopularity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServicePopularity();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServicePopularity(dataConnect);

console.log(data.bookingItems);

// Or, you can use the `Promise` API.
getServicePopularity().then((response) => {
  const data = response.data;
  console.log(data.bookingItems);
});
```

### Using `GetServicePopularity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServicePopularityRef } from '@firebasegen/adnlab-connector';


// Call the `getServicePopularityRef()` function to get a reference to the query.
const ref = getServicePopularityRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServicePopularityRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookingItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItems);
});
```

## GetMonthlyRevenue
You can execute the `GetMonthlyRevenue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMonthlyRevenue(vars: GetMonthlyRevenueVariables): QueryPromise<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;

interface GetMonthlyRevenueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMonthlyRevenueVariables): QueryRef<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;
}
export const getMonthlyRevenueRef: GetMonthlyRevenueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMonthlyRevenue(dc: DataConnect, vars: GetMonthlyRevenueVariables): QueryPromise<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;

interface GetMonthlyRevenueRef {
  ...
  (dc: DataConnect, vars: GetMonthlyRevenueVariables): QueryRef<GetMonthlyRevenueData, GetMonthlyRevenueVariables>;
}
export const getMonthlyRevenueRef: GetMonthlyRevenueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMonthlyRevenueRef:
```typescript
const name = getMonthlyRevenueRef.operationName;
console.log(name);
```

### Variables
The `GetMonthlyRevenue` query requires an argument of type `GetMonthlyRevenueVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMonthlyRevenueVariables {
  year: number;
  month: number;
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `GetMonthlyRevenue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMonthlyRevenueData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMonthlyRevenueData {
  payments: ({
    amount: number;
    paymentDate?: DateString | null;
  })[];
}
```
### Using `GetMonthlyRevenue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMonthlyRevenue, GetMonthlyRevenueVariables } from '@firebasegen/adnlab-connector';

// The `GetMonthlyRevenue` query requires an argument of type `GetMonthlyRevenueVariables`:
const getMonthlyRevenueVars: GetMonthlyRevenueVariables = {
  year: ..., 
  month: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `getMonthlyRevenue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMonthlyRevenue(getMonthlyRevenueVars);
// Variables can be defined inline as well.
const { data } = await getMonthlyRevenue({ year: ..., month: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMonthlyRevenue(dataConnect, getMonthlyRevenueVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
getMonthlyRevenue(getMonthlyRevenueVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `GetMonthlyRevenue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMonthlyRevenueRef, GetMonthlyRevenueVariables } from '@firebasegen/adnlab-connector';

// The `GetMonthlyRevenue` query requires an argument of type `GetMonthlyRevenueVariables`:
const getMonthlyRevenueVars: GetMonthlyRevenueVariables = {
  year: ..., 
  month: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `getMonthlyRevenueRef()` function to get a reference to the query.
const ref = getMonthlyRevenueRef(getMonthlyRevenueVars);
// Variables can be defined inline as well.
const ref = getMonthlyRevenueRef({ year: ..., month: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMonthlyRevenueRef(dataConnect, getMonthlyRevenueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
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
};

// Call the `createRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRole(createRoleVars);
// Variables can be defined inline as well.
const { data } = await createRole({ id: ..., name: ..., description: ..., });

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
};

// Call the `createRoleRef()` function to get a reference to the mutation.
const ref = createRoleRef(createRoleVars);
// Variables can be defined inline as well.
const ref = createRoleRef({ id: ..., name: ..., description: ..., });

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
};

// Call the `updateRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRole(updateRoleVars);
// Variables can be defined inline as well.
const { data } = await updateRole({ roleId: ..., name: ..., description: ..., });

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
};

// Call the `updateRoleRef()` function to get a reference to the mutation.
const ref = updateRoleRef(updateRoleVars);
// Variables can be defined inline as well.
const ref = updateRoleRef({ roleId: ..., name: ..., description: ..., });

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

## DeleteRole
You can execute the `DeleteRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteRole(vars: DeleteRoleVariables): MutationPromise<DeleteRoleData, DeleteRoleVariables>;

interface DeleteRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRoleVariables): MutationRef<DeleteRoleData, DeleteRoleVariables>;
}
export const deleteRoleRef: DeleteRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteRole(dc: DataConnect, vars: DeleteRoleVariables): MutationPromise<DeleteRoleData, DeleteRoleVariables>;

interface DeleteRoleRef {
  ...
  (dc: DataConnect, vars: DeleteRoleVariables): MutationRef<DeleteRoleData, DeleteRoleVariables>;
}
export const deleteRoleRef: DeleteRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteRoleRef:
```typescript
const name = deleteRoleRef.operationName;
console.log(name);
```

### Variables
The `DeleteRole` mutation requires an argument of type `DeleteRoleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteRoleVariables {
  roleId: string;
}
```
### Return Type
Recall that executing the `DeleteRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteRoleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteRoleData {
  role_delete?: Role_Key | null;
}
```
### Using `DeleteRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteRole, DeleteRoleVariables } from '@firebasegen/adnlab-connector';

// The `DeleteRole` mutation requires an argument of type `DeleteRoleVariables`:
const deleteRoleVars: DeleteRoleVariables = {
  roleId: ..., 
};

// Call the `deleteRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteRole(deleteRoleVars);
// Variables can be defined inline as well.
const { data } = await deleteRole({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteRole(dataConnect, deleteRoleVars);

console.log(data.role_delete);

// Or, you can use the `Promise` API.
deleteRole(deleteRoleVars).then((response) => {
  const data = response.data;
  console.log(data.role_delete);
});
```

### Using `DeleteRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteRoleRef, DeleteRoleVariables } from '@firebasegen/adnlab-connector';

// The `DeleteRole` mutation requires an argument of type `DeleteRoleVariables`:
const deleteRoleVars: DeleteRoleVariables = {
  roleId: ..., 
};

// Call the `deleteRoleRef()` function to get a reference to the mutation.
const ref = deleteRoleRef(deleteRoleVars);
// Variables can be defined inline as well.
const ref = deleteRoleRef({ roleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteRoleRef(dataConnect, deleteRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.role_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.role_delete);
});
```

## CreateOrUpdateUser
You can execute the `CreateOrUpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createOrUpdateUser(vars: CreateOrUpdateUserVariables): MutationPromise<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;

interface CreateOrUpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrUpdateUserVariables): MutationRef<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;
}
export const createOrUpdateUserRef: CreateOrUpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrUpdateUser(dc: DataConnect, vars: CreateOrUpdateUserVariables): MutationPromise<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;

interface CreateOrUpdateUserRef {
  ...
  (dc: DataConnect, vars: CreateOrUpdateUserVariables): MutationRef<CreateOrUpdateUserData, CreateOrUpdateUserVariables>;
}
export const createOrUpdateUserRef: CreateOrUpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrUpdateUserRef:
```typescript
const name = createOrUpdateUserRef.operationName;
console.log(name);
```

### Variables
The `CreateOrUpdateUser` mutation requires an argument of type `CreateOrUpdateUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrUpdateUserVariables {
  fullname: string;
  gender?: string | null;
  avatar?: string | null;
  email: string;
  phone?: string | null;
  shippingAddress?: string | null;
  roleId?: string | null;
  authProvider: string;
}
```
### Return Type
Recall that executing the `CreateOrUpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrUpdateUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrUpdateUserData {
  user_upsert: User_Key;
}
```
### Using `CreateOrUpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrUpdateUser, CreateOrUpdateUserVariables } from '@firebasegen/adnlab-connector';

// The `CreateOrUpdateUser` mutation requires an argument of type `CreateOrUpdateUserVariables`:
const createOrUpdateUserVars: CreateOrUpdateUserVariables = {
  fullname: ..., 
  gender: ..., // optional
  avatar: ..., // optional
  email: ..., 
  phone: ..., // optional
  shippingAddress: ..., // optional
  roleId: ..., // optional
  authProvider: ..., 
};

// Call the `createOrUpdateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrUpdateUser(createOrUpdateUserVars);
// Variables can be defined inline as well.
const { data } = await createOrUpdateUser({ fullname: ..., gender: ..., avatar: ..., email: ..., phone: ..., shippingAddress: ..., roleId: ..., authProvider: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrUpdateUser(dataConnect, createOrUpdateUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
createOrUpdateUser(createOrUpdateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `CreateOrUpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrUpdateUserRef, CreateOrUpdateUserVariables } from '@firebasegen/adnlab-connector';

// The `CreateOrUpdateUser` mutation requires an argument of type `CreateOrUpdateUserVariables`:
const createOrUpdateUserVars: CreateOrUpdateUserVariables = {
  fullname: ..., 
  gender: ..., // optional
  avatar: ..., // optional
  email: ..., 
  phone: ..., // optional
  shippingAddress: ..., // optional
  roleId: ..., // optional
  authProvider: ..., 
};

// Call the `createOrUpdateUserRef()` function to get a reference to the mutation.
const ref = createOrUpdateUserRef(createOrUpdateUserVars);
// Variables can be defined inline as well.
const ref = createOrUpdateUserRef({ fullname: ..., gender: ..., avatar: ..., email: ..., phone: ..., shippingAddress: ..., roleId: ..., authProvider: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrUpdateUserRef(dataConnect, createOrUpdateUserVars);

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
  avatar?: string | null;
  phone?: string | null;
  shippingAddress?: string | null;
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
  avatar: ..., // optional
  phone: ..., // optional
  shippingAddress: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ fullname: ..., gender: ..., avatar: ..., phone: ..., shippingAddress: ..., });
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
  avatar: ..., // optional
  phone: ..., // optional
  shippingAddress: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ fullname: ..., gender: ..., avatar: ..., phone: ..., shippingAddress: ..., });
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

## UpdateUserAccountStatus
You can execute the `UpdateUserAccountStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserAccountStatus(vars: UpdateUserAccountStatusVariables): MutationPromise<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;

interface UpdateUserAccountStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserAccountStatusVariables): MutationRef<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;
}
export const updateUserAccountStatusRef: UpdateUserAccountStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserAccountStatus(dc: DataConnect, vars: UpdateUserAccountStatusVariables): MutationPromise<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;

interface UpdateUserAccountStatusRef {
  ...
  (dc: DataConnect, vars: UpdateUserAccountStatusVariables): MutationRef<UpdateUserAccountStatusData, UpdateUserAccountStatusVariables>;
}
export const updateUserAccountStatusRef: UpdateUserAccountStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserAccountStatusRef:
```typescript
const name = updateUserAccountStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserAccountStatus` mutation requires an argument of type `UpdateUserAccountStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserAccountStatusVariables {
  userId: string;
  accountStatus: string;
}
```
### Return Type
Recall that executing the `UpdateUserAccountStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserAccountStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserAccountStatusData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserAccountStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserAccountStatus, UpdateUserAccountStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserAccountStatus` mutation requires an argument of type `UpdateUserAccountStatusVariables`:
const updateUserAccountStatusVars: UpdateUserAccountStatusVariables = {
  userId: ..., 
  accountStatus: ..., 
};

// Call the `updateUserAccountStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserAccountStatus(updateUserAccountStatusVars);
// Variables can be defined inline as well.
const { data } = await updateUserAccountStatus({ userId: ..., accountStatus: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserAccountStatus(dataConnect, updateUserAccountStatusVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserAccountStatus(updateUserAccountStatusVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserAccountStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserAccountStatusRef, UpdateUserAccountStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateUserAccountStatus` mutation requires an argument of type `UpdateUserAccountStatusVariables`:
const updateUserAccountStatusVars: UpdateUserAccountStatusVariables = {
  userId: ..., 
  accountStatus: ..., 
};

// Call the `updateUserAccountStatusRef()` function to get a reference to the mutation.
const ref = updateUserAccountStatusRef(updateUserAccountStatusVars);
// Variables can be defined inline as well.
const ref = updateUserAccountStatusRef({ userId: ..., accountStatus: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserAccountStatusRef(dataConnect, updateUserAccountStatusVars);

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

## CreateDnaService
You can execute the `CreateDnaService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDnaService(vars: CreateDnaServiceVariables): MutationPromise<CreateDnaServiceData, CreateDnaServiceVariables>;

interface CreateDnaServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDnaServiceVariables): MutationRef<CreateDnaServiceData, CreateDnaServiceVariables>;
}
export const createDnaServiceRef: CreateDnaServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDnaService(dc: DataConnect, vars: CreateDnaServiceVariables): MutationPromise<CreateDnaServiceData, CreateDnaServiceVariables>;

interface CreateDnaServiceRef {
  ...
  (dc: DataConnect, vars: CreateDnaServiceVariables): MutationRef<CreateDnaServiceData, CreateDnaServiceVariables>;
}
export const createDnaServiceRef: CreateDnaServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDnaServiceRef:
```typescript
const name = createDnaServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateDnaService` mutation requires an argument of type `CreateDnaServiceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDnaServiceVariables {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  sampleType: string;
  atHomeAvailable: boolean;
  kitCost: number;
}
```
### Return Type
Recall that executing the `CreateDnaService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDnaServiceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDnaServiceData {
  dnaService_insert: DnaService_Key;
}
```
### Using `CreateDnaService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDnaService, CreateDnaServiceVariables } from '@firebasegen/adnlab-connector';

// The `CreateDnaService` mutation requires an argument of type `CreateDnaServiceVariables`:
const createDnaServiceVars: CreateDnaServiceVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
  durationDays: ..., 
  sampleType: ..., 
  atHomeAvailable: ..., 
  kitCost: ..., 
};

// Call the `createDnaService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDnaService(createDnaServiceVars);
// Variables can be defined inline as well.
const { data } = await createDnaService({ id: ..., name: ..., description: ..., price: ..., durationDays: ..., sampleType: ..., atHomeAvailable: ..., kitCost: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDnaService(dataConnect, createDnaServiceVars);

console.log(data.dnaService_insert);

// Or, you can use the `Promise` API.
createDnaService(createDnaServiceVars).then((response) => {
  const data = response.data;
  console.log(data.dnaService_insert);
});
```

### Using `CreateDnaService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDnaServiceRef, CreateDnaServiceVariables } from '@firebasegen/adnlab-connector';

// The `CreateDnaService` mutation requires an argument of type `CreateDnaServiceVariables`:
const createDnaServiceVars: CreateDnaServiceVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
  durationDays: ..., 
  sampleType: ..., 
  atHomeAvailable: ..., 
  kitCost: ..., 
};

// Call the `createDnaServiceRef()` function to get a reference to the mutation.
const ref = createDnaServiceRef(createDnaServiceVars);
// Variables can be defined inline as well.
const ref = createDnaServiceRef({ id: ..., name: ..., description: ..., price: ..., durationDays: ..., sampleType: ..., atHomeAvailable: ..., kitCost: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDnaServiceRef(dataConnect, createDnaServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dnaService_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaService_insert);
});
```

## UpdateDnaService
You can execute the `UpdateDnaService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateDnaService(vars: UpdateDnaServiceVariables): MutationPromise<UpdateDnaServiceData, UpdateDnaServiceVariables>;

interface UpdateDnaServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDnaServiceVariables): MutationRef<UpdateDnaServiceData, UpdateDnaServiceVariables>;
}
export const updateDnaServiceRef: UpdateDnaServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDnaService(dc: DataConnect, vars: UpdateDnaServiceVariables): MutationPromise<UpdateDnaServiceData, UpdateDnaServiceVariables>;

interface UpdateDnaServiceRef {
  ...
  (dc: DataConnect, vars: UpdateDnaServiceVariables): MutationRef<UpdateDnaServiceData, UpdateDnaServiceVariables>;
}
export const updateDnaServiceRef: UpdateDnaServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDnaServiceRef:
```typescript
const name = updateDnaServiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateDnaService` mutation requires an argument of type `UpdateDnaServiceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDnaServiceVariables {
  serviceId: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  durationDays?: number | null;
  sampleType?: string | null;
  atHomeAvailable?: boolean | null;
  kitCost?: number | null;
  active?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateDnaService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDnaServiceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDnaServiceData {
  dnaService_update?: DnaService_Key | null;
}
```
### Using `UpdateDnaService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDnaService, UpdateDnaServiceVariables } from '@firebasegen/adnlab-connector';

// The `UpdateDnaService` mutation requires an argument of type `UpdateDnaServiceVariables`:
const updateDnaServiceVars: UpdateDnaServiceVariables = {
  serviceId: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
  durationDays: ..., // optional
  sampleType: ..., // optional
  atHomeAvailable: ..., // optional
  kitCost: ..., // optional
  active: ..., // optional
};

// Call the `updateDnaService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDnaService(updateDnaServiceVars);
// Variables can be defined inline as well.
const { data } = await updateDnaService({ serviceId: ..., name: ..., description: ..., price: ..., durationDays: ..., sampleType: ..., atHomeAvailable: ..., kitCost: ..., active: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDnaService(dataConnect, updateDnaServiceVars);

console.log(data.dnaService_update);

// Or, you can use the `Promise` API.
updateDnaService(updateDnaServiceVars).then((response) => {
  const data = response.data;
  console.log(data.dnaService_update);
});
```

### Using `UpdateDnaService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDnaServiceRef, UpdateDnaServiceVariables } from '@firebasegen/adnlab-connector';

// The `UpdateDnaService` mutation requires an argument of type `UpdateDnaServiceVariables`:
const updateDnaServiceVars: UpdateDnaServiceVariables = {
  serviceId: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
  durationDays: ..., // optional
  sampleType: ..., // optional
  atHomeAvailable: ..., // optional
  kitCost: ..., // optional
  active: ..., // optional
};

// Call the `updateDnaServiceRef()` function to get a reference to the mutation.
const ref = updateDnaServiceRef(updateDnaServiceVars);
// Variables can be defined inline as well.
const ref = updateDnaServiceRef({ serviceId: ..., name: ..., description: ..., price: ..., durationDays: ..., sampleType: ..., atHomeAvailable: ..., kitCost: ..., active: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDnaServiceRef(dataConnect, updateDnaServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dnaService_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dnaService_update);
});
```

## CreateKit
You can execute the `CreateKit` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createKit(vars: CreateKitVariables): MutationPromise<CreateKitData, CreateKitVariables>;

interface CreateKitRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKitVariables): MutationRef<CreateKitData, CreateKitVariables>;
}
export const createKitRef: CreateKitRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createKit(dc: DataConnect, vars: CreateKitVariables): MutationPromise<CreateKitData, CreateKitVariables>;

interface CreateKitRef {
  ...
  (dc: DataConnect, vars: CreateKitVariables): MutationRef<CreateKitData, CreateKitVariables>;
}
export const createKitRef: CreateKitRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createKitRef:
```typescript
const name = createKitRef.operationName;
console.log(name);
```

### Variables
The `CreateKit` mutation requires an argument of type `CreateKitVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateKitVariables {
  id: string;
  amount: number;
}
```
### Return Type
Recall that executing the `CreateKit` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateKitData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateKitData {
  kit_insert: Kit_Key;
}
```
### Using `CreateKit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createKit, CreateKitVariables } from '@firebasegen/adnlab-connector';

// The `CreateKit` mutation requires an argument of type `CreateKitVariables`:
const createKitVars: CreateKitVariables = {
  id: ..., 
  amount: ..., 
};

// Call the `createKit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createKit(createKitVars);
// Variables can be defined inline as well.
const { data } = await createKit({ id: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createKit(dataConnect, createKitVars);

console.log(data.kit_insert);

// Or, you can use the `Promise` API.
createKit(createKitVars).then((response) => {
  const data = response.data;
  console.log(data.kit_insert);
});
```

### Using `CreateKit`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createKitRef, CreateKitVariables } from '@firebasegen/adnlab-connector';

// The `CreateKit` mutation requires an argument of type `CreateKitVariables`:
const createKitVars: CreateKitVariables = {
  id: ..., 
  amount: ..., 
};

// Call the `createKitRef()` function to get a reference to the mutation.
const ref = createKitRef(createKitVars);
// Variables can be defined inline as well.
const ref = createKitRef({ id: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createKitRef(dataConnect, createKitVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.kit_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.kit_insert);
});
```

## UpdateKitStatus
You can execute the `UpdateKitStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateKitStatus(vars: UpdateKitStatusVariables): MutationPromise<UpdateKitStatusData, UpdateKitStatusVariables>;

interface UpdateKitStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateKitStatusVariables): MutationRef<UpdateKitStatusData, UpdateKitStatusVariables>;
}
export const updateKitStatusRef: UpdateKitStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateKitStatus(dc: DataConnect, vars: UpdateKitStatusVariables): MutationPromise<UpdateKitStatusData, UpdateKitStatusVariables>;

interface UpdateKitStatusRef {
  ...
  (dc: DataConnect, vars: UpdateKitStatusVariables): MutationRef<UpdateKitStatusData, UpdateKitStatusVariables>;
}
export const updateKitStatusRef: UpdateKitStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateKitStatusRef:
```typescript
const name = updateKitStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateKitStatus` mutation requires an argument of type `UpdateKitStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateKitStatusVariables {
  kitId: string;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateKitStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateKitStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateKitStatusData {
  kit_update?: Kit_Key | null;
}
```
### Using `UpdateKitStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateKitStatus, UpdateKitStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateKitStatus` mutation requires an argument of type `UpdateKitStatusVariables`:
const updateKitStatusVars: UpdateKitStatusVariables = {
  kitId: ..., 
  status: ..., 
};

// Call the `updateKitStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateKitStatus(updateKitStatusVars);
// Variables can be defined inline as well.
const { data } = await updateKitStatus({ kitId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateKitStatus(dataConnect, updateKitStatusVars);

console.log(data.kit_update);

// Or, you can use the `Promise` API.
updateKitStatus(updateKitStatusVars).then((response) => {
  const data = response.data;
  console.log(data.kit_update);
});
```

### Using `UpdateKitStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateKitStatusRef, UpdateKitStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateKitStatus` mutation requires an argument of type `UpdateKitStatusVariables`:
const updateKitStatusVars: UpdateKitStatusVariables = {
  kitId: ..., 
  status: ..., 
};

// Call the `updateKitStatusRef()` function to get a reference to the mutation.
const ref = updateKitStatusRef(updateKitStatusVars);
// Variables can be defined inline as well.
const ref = updateKitStatusRef({ kitId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateKitStatusRef(dataConnect, updateKitStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.kit_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.kit_update);
});
```

## CreateTimeSlot
You can execute the `CreateTimeSlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createTimeSlot(vars: CreateTimeSlotVariables): MutationPromise<CreateTimeSlotData, CreateTimeSlotVariables>;

interface CreateTimeSlotRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeSlotVariables): MutationRef<CreateTimeSlotData, CreateTimeSlotVariables>;
}
export const createTimeSlotRef: CreateTimeSlotRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTimeSlot(dc: DataConnect, vars: CreateTimeSlotVariables): MutationPromise<CreateTimeSlotData, CreateTimeSlotVariables>;

interface CreateTimeSlotRef {
  ...
  (dc: DataConnect, vars: CreateTimeSlotVariables): MutationRef<CreateTimeSlotData, CreateTimeSlotVariables>;
}
export const createTimeSlotRef: CreateTimeSlotRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTimeSlotRef:
```typescript
const name = createTimeSlotRef.operationName;
console.log(name);
```

### Variables
The `CreateTimeSlot` mutation requires an argument of type `CreateTimeSlotVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTimeSlotVariables {
  id: string;
  slotDate: DateString;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  staffId?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateTimeSlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTimeSlotData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTimeSlotData {
  timeSlot_insert: TimeSlot_Key;
}
```
### Using `CreateTimeSlot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTimeSlot, CreateTimeSlotVariables } from '@firebasegen/adnlab-connector';

// The `CreateTimeSlot` mutation requires an argument of type `CreateTimeSlotVariables`:
const createTimeSlotVars: CreateTimeSlotVariables = {
  id: ..., 
  slotDate: ..., 
  startTime: ..., 
  endTime: ..., 
  maxCapacity: ..., 
  staffId: ..., // optional
  notes: ..., // optional
};

// Call the `createTimeSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTimeSlot(createTimeSlotVars);
// Variables can be defined inline as well.
const { data } = await createTimeSlot({ id: ..., slotDate: ..., startTime: ..., endTime: ..., maxCapacity: ..., staffId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTimeSlot(dataConnect, createTimeSlotVars);

console.log(data.timeSlot_insert);

// Or, you can use the `Promise` API.
createTimeSlot(createTimeSlotVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_insert);
});
```

### Using `CreateTimeSlot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTimeSlotRef, CreateTimeSlotVariables } from '@firebasegen/adnlab-connector';

// The `CreateTimeSlot` mutation requires an argument of type `CreateTimeSlotVariables`:
const createTimeSlotVars: CreateTimeSlotVariables = {
  id: ..., 
  slotDate: ..., 
  startTime: ..., 
  endTime: ..., 
  maxCapacity: ..., 
  staffId: ..., // optional
  notes: ..., // optional
};

// Call the `createTimeSlotRef()` function to get a reference to the mutation.
const ref = createTimeSlotRef(createTimeSlotVars);
// Variables can be defined inline as well.
const ref = createTimeSlotRef({ id: ..., slotDate: ..., startTime: ..., endTime: ..., maxCapacity: ..., staffId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTimeSlotRef(dataConnect, createTimeSlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeSlot_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_insert);
});
```

## UpdateTimeSlot
You can execute the `UpdateTimeSlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateTimeSlot(vars: UpdateTimeSlotVariables): MutationPromise<UpdateTimeSlotData, UpdateTimeSlotVariables>;

interface UpdateTimeSlotRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTimeSlotVariables): MutationRef<UpdateTimeSlotData, UpdateTimeSlotVariables>;
}
export const updateTimeSlotRef: UpdateTimeSlotRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTimeSlot(dc: DataConnect, vars: UpdateTimeSlotVariables): MutationPromise<UpdateTimeSlotData, UpdateTimeSlotVariables>;

interface UpdateTimeSlotRef {
  ...
  (dc: DataConnect, vars: UpdateTimeSlotVariables): MutationRef<UpdateTimeSlotData, UpdateTimeSlotVariables>;
}
export const updateTimeSlotRef: UpdateTimeSlotRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTimeSlotRef:
```typescript
const name = updateTimeSlotRef.operationName;
console.log(name);
```

### Variables
The `UpdateTimeSlot` mutation requires an argument of type `UpdateTimeSlotVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTimeSlotVariables {
  timeSlotId: string;
  slotDate?: DateString | null;
  startTime?: string | null;
  endTime?: string | null;
  maxCapacity?: number | null;
  staffId?: string | null;
  notes?: string | null;
  available?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateTimeSlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTimeSlotData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTimeSlotData {
  timeSlot_update?: TimeSlot_Key | null;
}
```
### Using `UpdateTimeSlot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTimeSlot, UpdateTimeSlotVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTimeSlot` mutation requires an argument of type `UpdateTimeSlotVariables`:
const updateTimeSlotVars: UpdateTimeSlotVariables = {
  timeSlotId: ..., 
  slotDate: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  maxCapacity: ..., // optional
  staffId: ..., // optional
  notes: ..., // optional
  available: ..., // optional
};

// Call the `updateTimeSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTimeSlot(updateTimeSlotVars);
// Variables can be defined inline as well.
const { data } = await updateTimeSlot({ timeSlotId: ..., slotDate: ..., startTime: ..., endTime: ..., maxCapacity: ..., staffId: ..., notes: ..., available: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTimeSlot(dataConnect, updateTimeSlotVars);

console.log(data.timeSlot_update);

// Or, you can use the `Promise` API.
updateTimeSlot(updateTimeSlotVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_update);
});
```

### Using `UpdateTimeSlot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTimeSlotRef, UpdateTimeSlotVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTimeSlot` mutation requires an argument of type `UpdateTimeSlotVariables`:
const updateTimeSlotVars: UpdateTimeSlotVariables = {
  timeSlotId: ..., 
  slotDate: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  maxCapacity: ..., // optional
  staffId: ..., // optional
  notes: ..., // optional
  available: ..., // optional
};

// Call the `updateTimeSlotRef()` function to get a reference to the mutation.
const ref = updateTimeSlotRef(updateTimeSlotVars);
// Variables can be defined inline as well.
const ref = updateTimeSlotRef({ timeSlotId: ..., slotDate: ..., startTime: ..., endTime: ..., maxCapacity: ..., staffId: ..., notes: ..., available: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTimeSlotRef(dataConnect, updateTimeSlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeSlot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_update);
});
```

## UpdateTimeSlotBookings
You can execute the `UpdateTimeSlotBookings` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateTimeSlotBookings(vars: UpdateTimeSlotBookingsVariables): MutationPromise<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;

interface UpdateTimeSlotBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTimeSlotBookingsVariables): MutationRef<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;
}
export const updateTimeSlotBookingsRef: UpdateTimeSlotBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTimeSlotBookings(dc: DataConnect, vars: UpdateTimeSlotBookingsVariables): MutationPromise<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;

interface UpdateTimeSlotBookingsRef {
  ...
  (dc: DataConnect, vars: UpdateTimeSlotBookingsVariables): MutationRef<UpdateTimeSlotBookingsData, UpdateTimeSlotBookingsVariables>;
}
export const updateTimeSlotBookingsRef: UpdateTimeSlotBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTimeSlotBookingsRef:
```typescript
const name = updateTimeSlotBookingsRef.operationName;
console.log(name);
```

### Variables
The `UpdateTimeSlotBookings` mutation requires an argument of type `UpdateTimeSlotBookingsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTimeSlotBookingsVariables {
  timeSlotId: string;
  currentBookings: number;
}
```
### Return Type
Recall that executing the `UpdateTimeSlotBookings` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTimeSlotBookingsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTimeSlotBookingsData {
  timeSlot_update?: TimeSlot_Key | null;
}
```
### Using `UpdateTimeSlotBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTimeSlotBookings, UpdateTimeSlotBookingsVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTimeSlotBookings` mutation requires an argument of type `UpdateTimeSlotBookingsVariables`:
const updateTimeSlotBookingsVars: UpdateTimeSlotBookingsVariables = {
  timeSlotId: ..., 
  currentBookings: ..., 
};

// Call the `updateTimeSlotBookings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTimeSlotBookings(updateTimeSlotBookingsVars);
// Variables can be defined inline as well.
const { data } = await updateTimeSlotBookings({ timeSlotId: ..., currentBookings: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTimeSlotBookings(dataConnect, updateTimeSlotBookingsVars);

console.log(data.timeSlot_update);

// Or, you can use the `Promise` API.
updateTimeSlotBookings(updateTimeSlotBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_update);
});
```

### Using `UpdateTimeSlotBookings`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTimeSlotBookingsRef, UpdateTimeSlotBookingsVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTimeSlotBookings` mutation requires an argument of type `UpdateTimeSlotBookingsVariables`:
const updateTimeSlotBookingsVars: UpdateTimeSlotBookingsVariables = {
  timeSlotId: ..., 
  currentBookings: ..., 
};

// Call the `updateTimeSlotBookingsRef()` function to get a reference to the mutation.
const ref = updateTimeSlotBookingsRef(updateTimeSlotBookingsVars);
// Variables can be defined inline as well.
const ref = updateTimeSlotBookingsRef({ timeSlotId: ..., currentBookings: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTimeSlotBookingsRef(dataConnect, updateTimeSlotBookingsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeSlot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeSlot_update);
});
```

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  id: string;
  userId: string;
  staffId?: string | null;
  kitId?: string | null;
  timeSlotId?: string | null;
  collectionMethod: string;
  notes?: string | null;
  totalAmount: number;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@firebasegen/adnlab-connector';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  id: ..., 
  userId: ..., 
  staffId: ..., // optional
  kitId: ..., // optional
  timeSlotId: ..., // optional
  collectionMethod: ..., 
  notes: ..., // optional
  totalAmount: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ id: ..., userId: ..., staffId: ..., kitId: ..., timeSlotId: ..., collectionMethod: ..., notes: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@firebasegen/adnlab-connector';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  id: ..., 
  userId: ..., 
  staffId: ..., // optional
  kitId: ..., // optional
  timeSlotId: ..., // optional
  collectionMethod: ..., 
  notes: ..., // optional
  totalAmount: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ id: ..., userId: ..., staffId: ..., kitId: ..., timeSlotId: ..., collectionMethod: ..., notes: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## UpdateBookingStatus
You can execute the `UpdateBookingStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBookingStatus(vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface UpdateBookingStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBookingStatus(dc: DataConnect, vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface UpdateBookingStatusRef {
  ...
  (dc: DataConnect, vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingStatusRef:
```typescript
const name = updateBookingStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingStatusVariables {
  bookingId: string;
  status: string;
  staffId?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBookingStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingStatusData {
  booking_update?: Booking_Key | null;
}
```
### Using `UpdateBookingStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBookingStatus, UpdateBookingStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`:
const updateBookingStatusVars: UpdateBookingStatusVariables = {
  bookingId: ..., 
  status: ..., 
  staffId: ..., // optional
};

// Call the `updateBookingStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBookingStatus(updateBookingStatusVars);
// Variables can be defined inline as well.
const { data } = await updateBookingStatus({ bookingId: ..., status: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBookingStatus(dataConnect, updateBookingStatusVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
updateBookingStatus(updateBookingStatusVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `UpdateBookingStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingStatusRef, UpdateBookingStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`:
const updateBookingStatusVars: UpdateBookingStatusVariables = {
  bookingId: ..., 
  status: ..., 
  staffId: ..., // optional
};

// Call the `updateBookingStatusRef()` function to get a reference to the mutation.
const ref = updateBookingStatusRef(updateBookingStatusVars);
// Variables can be defined inline as well.
const ref = updateBookingStatusRef({ bookingId: ..., status: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingStatusRef(dataConnect, updateBookingStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## AssignBookingStaff
You can execute the `AssignBookingStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
assignBookingStaff(vars: AssignBookingStaffVariables): MutationPromise<AssignBookingStaffData, AssignBookingStaffVariables>;

interface AssignBookingStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignBookingStaffVariables): MutationRef<AssignBookingStaffData, AssignBookingStaffVariables>;
}
export const assignBookingStaffRef: AssignBookingStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignBookingStaff(dc: DataConnect, vars: AssignBookingStaffVariables): MutationPromise<AssignBookingStaffData, AssignBookingStaffVariables>;

interface AssignBookingStaffRef {
  ...
  (dc: DataConnect, vars: AssignBookingStaffVariables): MutationRef<AssignBookingStaffData, AssignBookingStaffVariables>;
}
export const assignBookingStaffRef: AssignBookingStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignBookingStaffRef:
```typescript
const name = assignBookingStaffRef.operationName;
console.log(name);
```

### Variables
The `AssignBookingStaff` mutation requires an argument of type `AssignBookingStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignBookingStaffVariables {
  bookingId: string;
  staffId: string;
}
```
### Return Type
Recall that executing the `AssignBookingStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignBookingStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignBookingStaffData {
  booking_update?: Booking_Key | null;
}
```
### Using `AssignBookingStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignBookingStaff, AssignBookingStaffVariables } from '@firebasegen/adnlab-connector';

// The `AssignBookingStaff` mutation requires an argument of type `AssignBookingStaffVariables`:
const assignBookingStaffVars: AssignBookingStaffVariables = {
  bookingId: ..., 
  staffId: ..., 
};

// Call the `assignBookingStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignBookingStaff(assignBookingStaffVars);
// Variables can be defined inline as well.
const { data } = await assignBookingStaff({ bookingId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignBookingStaff(dataConnect, assignBookingStaffVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
assignBookingStaff(assignBookingStaffVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `AssignBookingStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignBookingStaffRef, AssignBookingStaffVariables } from '@firebasegen/adnlab-connector';

// The `AssignBookingStaff` mutation requires an argument of type `AssignBookingStaffVariables`:
const assignBookingStaffVars: AssignBookingStaffVariables = {
  bookingId: ..., 
  staffId: ..., 
};

// Call the `assignBookingStaffRef()` function to get a reference to the mutation.
const ref = assignBookingStaffRef(assignBookingStaffVars);
// Variables can be defined inline as well.
const ref = assignBookingStaffRef({ bookingId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignBookingStaffRef(dataConnect, assignBookingStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## AddBookingItem
You can execute the `AddBookingItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addBookingItem(vars: AddBookingItemVariables): MutationPromise<AddBookingItemData, AddBookingItemVariables>;

interface AddBookingItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddBookingItemVariables): MutationRef<AddBookingItemData, AddBookingItemVariables>;
}
export const addBookingItemRef: AddBookingItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addBookingItem(dc: DataConnect, vars: AddBookingItemVariables): MutationPromise<AddBookingItemData, AddBookingItemVariables>;

interface AddBookingItemRef {
  ...
  (dc: DataConnect, vars: AddBookingItemVariables): MutationRef<AddBookingItemData, AddBookingItemVariables>;
}
export const addBookingItemRef: AddBookingItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addBookingItemRef:
```typescript
const name = addBookingItemRef.operationName;
console.log(name);
```

### Variables
The `AddBookingItem` mutation requires an argument of type `AddBookingItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddBookingItemVariables {
  id: string;
  bookingId: string;
  serviceId: string;
  price: number;
  quantity: number;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AddBookingItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddBookingItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddBookingItemData {
  bookingItem_insert: BookingItem_Key;
}
```
### Using `AddBookingItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addBookingItem, AddBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `AddBookingItem` mutation requires an argument of type `AddBookingItemVariables`:
const addBookingItemVars: AddBookingItemVariables = {
  id: ..., 
  bookingId: ..., 
  serviceId: ..., 
  price: ..., 
  quantity: ..., 
  notes: ..., // optional
};

// Call the `addBookingItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addBookingItem(addBookingItemVars);
// Variables can be defined inline as well.
const { data } = await addBookingItem({ id: ..., bookingId: ..., serviceId: ..., price: ..., quantity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addBookingItem(dataConnect, addBookingItemVars);

console.log(data.bookingItem_insert);

// Or, you can use the `Promise` API.
addBookingItem(addBookingItemVars).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_insert);
});
```

### Using `AddBookingItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addBookingItemRef, AddBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `AddBookingItem` mutation requires an argument of type `AddBookingItemVariables`:
const addBookingItemVars: AddBookingItemVariables = {
  id: ..., 
  bookingId: ..., 
  serviceId: ..., 
  price: ..., 
  quantity: ..., 
  notes: ..., // optional
};

// Call the `addBookingItemRef()` function to get a reference to the mutation.
const ref = addBookingItemRef(addBookingItemVars);
// Variables can be defined inline as well.
const ref = addBookingItemRef({ id: ..., bookingId: ..., serviceId: ..., price: ..., quantity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addBookingItemRef(dataConnect, addBookingItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookingItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_insert);
});
```

## UpdateBookingItem
You can execute the `UpdateBookingItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBookingItem(vars: UpdateBookingItemVariables): MutationPromise<UpdateBookingItemData, UpdateBookingItemVariables>;

interface UpdateBookingItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingItemVariables): MutationRef<UpdateBookingItemData, UpdateBookingItemVariables>;
}
export const updateBookingItemRef: UpdateBookingItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBookingItem(dc: DataConnect, vars: UpdateBookingItemVariables): MutationPromise<UpdateBookingItemData, UpdateBookingItemVariables>;

interface UpdateBookingItemRef {
  ...
  (dc: DataConnect, vars: UpdateBookingItemVariables): MutationRef<UpdateBookingItemData, UpdateBookingItemVariables>;
}
export const updateBookingItemRef: UpdateBookingItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingItemRef:
```typescript
const name = updateBookingItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateBookingItem` mutation requires an argument of type `UpdateBookingItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingItemVariables {
  itemId: string;
  price?: number | null;
  quantity?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBookingItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingItemData {
  bookingItem_update?: BookingItem_Key | null;
}
```
### Using `UpdateBookingItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBookingItem, UpdateBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingItem` mutation requires an argument of type `UpdateBookingItemVariables`:
const updateBookingItemVars: UpdateBookingItemVariables = {
  itemId: ..., 
  price: ..., // optional
  quantity: ..., // optional
  notes: ..., // optional
};

// Call the `updateBookingItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBookingItem(updateBookingItemVars);
// Variables can be defined inline as well.
const { data } = await updateBookingItem({ itemId: ..., price: ..., quantity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBookingItem(dataConnect, updateBookingItemVars);

console.log(data.bookingItem_update);

// Or, you can use the `Promise` API.
updateBookingItem(updateBookingItemVars).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_update);
});
```

### Using `UpdateBookingItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingItemRef, UpdateBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingItem` mutation requires an argument of type `UpdateBookingItemVariables`:
const updateBookingItemVars: UpdateBookingItemVariables = {
  itemId: ..., 
  price: ..., // optional
  quantity: ..., // optional
  notes: ..., // optional
};

// Call the `updateBookingItemRef()` function to get a reference to the mutation.
const ref = updateBookingItemRef(updateBookingItemVars);
// Variables can be defined inline as well.
const ref = updateBookingItemRef({ itemId: ..., price: ..., quantity: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingItemRef(dataConnect, updateBookingItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookingItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_update);
});
```

## RemoveBookingItem
You can execute the `RemoveBookingItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
removeBookingItem(vars: RemoveBookingItemVariables): MutationPromise<RemoveBookingItemData, RemoveBookingItemVariables>;

interface RemoveBookingItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveBookingItemVariables): MutationRef<RemoveBookingItemData, RemoveBookingItemVariables>;
}
export const removeBookingItemRef: RemoveBookingItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeBookingItem(dc: DataConnect, vars: RemoveBookingItemVariables): MutationPromise<RemoveBookingItemData, RemoveBookingItemVariables>;

interface RemoveBookingItemRef {
  ...
  (dc: DataConnect, vars: RemoveBookingItemVariables): MutationRef<RemoveBookingItemData, RemoveBookingItemVariables>;
}
export const removeBookingItemRef: RemoveBookingItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeBookingItemRef:
```typescript
const name = removeBookingItemRef.operationName;
console.log(name);
```

### Variables
The `RemoveBookingItem` mutation requires an argument of type `RemoveBookingItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveBookingItemVariables {
  itemId: string;
}
```
### Return Type
Recall that executing the `RemoveBookingItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveBookingItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveBookingItemData {
  bookingItem_delete?: BookingItem_Key | null;
}
```
### Using `RemoveBookingItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeBookingItem, RemoveBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `RemoveBookingItem` mutation requires an argument of type `RemoveBookingItemVariables`:
const removeBookingItemVars: RemoveBookingItemVariables = {
  itemId: ..., 
};

// Call the `removeBookingItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeBookingItem(removeBookingItemVars);
// Variables can be defined inline as well.
const { data } = await removeBookingItem({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeBookingItem(dataConnect, removeBookingItemVars);

console.log(data.bookingItem_delete);

// Or, you can use the `Promise` API.
removeBookingItem(removeBookingItemVars).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_delete);
});
```

### Using `RemoveBookingItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeBookingItemRef, RemoveBookingItemVariables } from '@firebasegen/adnlab-connector';

// The `RemoveBookingItem` mutation requires an argument of type `RemoveBookingItemVariables`:
const removeBookingItemVars: RemoveBookingItemVariables = {
  itemId: ..., 
};

// Call the `removeBookingItemRef()` function to get a reference to the mutation.
const ref = removeBookingItemRef(removeBookingItemVars);
// Variables can be defined inline as well.
const ref = removeBookingItemRef({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeBookingItemRef(dataConnect, removeBookingItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookingItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingItem_delete);
});
```

## CreateSample
You can execute the `CreateSample` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSample(vars: CreateSampleVariables): MutationPromise<CreateSampleData, CreateSampleVariables>;

interface CreateSampleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSampleVariables): MutationRef<CreateSampleData, CreateSampleVariables>;
}
export const createSampleRef: CreateSampleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSample(dc: DataConnect, vars: CreateSampleVariables): MutationPromise<CreateSampleData, CreateSampleVariables>;

interface CreateSampleRef {
  ...
  (dc: DataConnect, vars: CreateSampleVariables): MutationRef<CreateSampleData, CreateSampleVariables>;
}
export const createSampleRef: CreateSampleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSampleRef:
```typescript
const name = createSampleRef.operationName;
console.log(name);
```

### Variables
The `CreateSample` mutation requires an argument of type `CreateSampleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSampleVariables {
  id: string;
  bookingId: string;
  serviceId: string;
  staffId?: string | null;
  collectionDate?: DateString | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateSample` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSampleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSampleData {
  sample_insert: Sample_Key;
}
```
### Using `CreateSample`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSample, CreateSampleVariables } from '@firebasegen/adnlab-connector';

// The `CreateSample` mutation requires an argument of type `CreateSampleVariables`:
const createSampleVars: CreateSampleVariables = {
  id: ..., 
  bookingId: ..., 
  serviceId: ..., 
  staffId: ..., // optional
  collectionDate: ..., // optional
  notes: ..., // optional
};

// Call the `createSample()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSample(createSampleVars);
// Variables can be defined inline as well.
const { data } = await createSample({ id: ..., bookingId: ..., serviceId: ..., staffId: ..., collectionDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSample(dataConnect, createSampleVars);

console.log(data.sample_insert);

// Or, you can use the `Promise` API.
createSample(createSampleVars).then((response) => {
  const data = response.data;
  console.log(data.sample_insert);
});
```

### Using `CreateSample`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSampleRef, CreateSampleVariables } from '@firebasegen/adnlab-connector';

// The `CreateSample` mutation requires an argument of type `CreateSampleVariables`:
const createSampleVars: CreateSampleVariables = {
  id: ..., 
  bookingId: ..., 
  serviceId: ..., 
  staffId: ..., // optional
  collectionDate: ..., // optional
  notes: ..., // optional
};

// Call the `createSampleRef()` function to get a reference to the mutation.
const ref = createSampleRef(createSampleVars);
// Variables can be defined inline as well.
const ref = createSampleRef({ id: ..., bookingId: ..., serviceId: ..., staffId: ..., collectionDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSampleRef(dataConnect, createSampleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sample_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sample_insert);
});
```

## UpdateSampleStatus
You can execute the `UpdateSampleStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateSampleStatus(vars: UpdateSampleStatusVariables): MutationPromise<UpdateSampleStatusData, UpdateSampleStatusVariables>;

interface UpdateSampleStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSampleStatusVariables): MutationRef<UpdateSampleStatusData, UpdateSampleStatusVariables>;
}
export const updateSampleStatusRef: UpdateSampleStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSampleStatus(dc: DataConnect, vars: UpdateSampleStatusVariables): MutationPromise<UpdateSampleStatusData, UpdateSampleStatusVariables>;

interface UpdateSampleStatusRef {
  ...
  (dc: DataConnect, vars: UpdateSampleStatusVariables): MutationRef<UpdateSampleStatusData, UpdateSampleStatusVariables>;
}
export const updateSampleStatusRef: UpdateSampleStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSampleStatusRef:
```typescript
const name = updateSampleStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateSampleStatus` mutation requires an argument of type `UpdateSampleStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSampleStatusVariables {
  sampleId: string;
  status: string;
  staffId?: string | null;
  collectionDate?: DateString | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateSampleStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSampleStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSampleStatusData {
  sample_update?: Sample_Key | null;
}
```
### Using `UpdateSampleStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSampleStatus, UpdateSampleStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateSampleStatus` mutation requires an argument of type `UpdateSampleStatusVariables`:
const updateSampleStatusVars: UpdateSampleStatusVariables = {
  sampleId: ..., 
  status: ..., 
  staffId: ..., // optional
  collectionDate: ..., // optional
  notes: ..., // optional
};

// Call the `updateSampleStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSampleStatus(updateSampleStatusVars);
// Variables can be defined inline as well.
const { data } = await updateSampleStatus({ sampleId: ..., status: ..., staffId: ..., collectionDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSampleStatus(dataConnect, updateSampleStatusVars);

console.log(data.sample_update);

// Or, you can use the `Promise` API.
updateSampleStatus(updateSampleStatusVars).then((response) => {
  const data = response.data;
  console.log(data.sample_update);
});
```

### Using `UpdateSampleStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSampleStatusRef, UpdateSampleStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdateSampleStatus` mutation requires an argument of type `UpdateSampleStatusVariables`:
const updateSampleStatusVars: UpdateSampleStatusVariables = {
  sampleId: ..., 
  status: ..., 
  staffId: ..., // optional
  collectionDate: ..., // optional
  notes: ..., // optional
};

// Call the `updateSampleStatusRef()` function to get a reference to the mutation.
const ref = updateSampleStatusRef(updateSampleStatusVars);
// Variables can be defined inline as well.
const ref = updateSampleStatusRef({ sampleId: ..., status: ..., staffId: ..., collectionDate: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSampleStatusRef(dataConnect, updateSampleStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sample_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sample_update);
});
```

## CreateTestResult
You can execute the `CreateTestResult` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createTestResult(vars: CreateTestResultVariables): MutationPromise<CreateTestResultData, CreateTestResultVariables>;

interface CreateTestResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTestResultVariables): MutationRef<CreateTestResultData, CreateTestResultVariables>;
}
export const createTestResultRef: CreateTestResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTestResult(dc: DataConnect, vars: CreateTestResultVariables): MutationPromise<CreateTestResultData, CreateTestResultVariables>;

interface CreateTestResultRef {
  ...
  (dc: DataConnect, vars: CreateTestResultVariables): MutationRef<CreateTestResultData, CreateTestResultVariables>;
}
export const createTestResultRef: CreateTestResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTestResultRef:
```typescript
const name = createTestResultRef.operationName;
console.log(name);
```

### Variables
The `CreateTestResult` mutation requires an argument of type `CreateTestResultVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTestResultVariables {
  id: string;
  bookingId: string;
  sampleId: string;
  serviceId: string;
  staffId?: string | null;
  testDate?: DateString | null;
  resultData?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateTestResult` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTestResultData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTestResultData {
  testResult_insert: TestResult_Key;
}
```
### Using `CreateTestResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTestResult, CreateTestResultVariables } from '@firebasegen/adnlab-connector';

// The `CreateTestResult` mutation requires an argument of type `CreateTestResultVariables`:
const createTestResultVars: CreateTestResultVariables = {
  id: ..., 
  bookingId: ..., 
  sampleId: ..., 
  serviceId: ..., 
  staffId: ..., // optional
  testDate: ..., // optional
  resultData: ..., // optional
  notes: ..., // optional
};

// Call the `createTestResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTestResult(createTestResultVars);
// Variables can be defined inline as well.
const { data } = await createTestResult({ id: ..., bookingId: ..., sampleId: ..., serviceId: ..., staffId: ..., testDate: ..., resultData: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTestResult(dataConnect, createTestResultVars);

console.log(data.testResult_insert);

// Or, you can use the `Promise` API.
createTestResult(createTestResultVars).then((response) => {
  const data = response.data;
  console.log(data.testResult_insert);
});
```

### Using `CreateTestResult`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTestResultRef, CreateTestResultVariables } from '@firebasegen/adnlab-connector';

// The `CreateTestResult` mutation requires an argument of type `CreateTestResultVariables`:
const createTestResultVars: CreateTestResultVariables = {
  id: ..., 
  bookingId: ..., 
  sampleId: ..., 
  serviceId: ..., 
  staffId: ..., // optional
  testDate: ..., // optional
  resultData: ..., // optional
  notes: ..., // optional
};

// Call the `createTestResultRef()` function to get a reference to the mutation.
const ref = createTestResultRef(createTestResultVars);
// Variables can be defined inline as well.
const ref = createTestResultRef({ id: ..., bookingId: ..., sampleId: ..., serviceId: ..., staffId: ..., testDate: ..., resultData: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTestResultRef(dataConnect, createTestResultVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.testResult_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.testResult_insert);
});
```

## UpdateTestResult
You can execute the `UpdateTestResult` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateTestResult(vars: UpdateTestResultVariables): MutationPromise<UpdateTestResultData, UpdateTestResultVariables>;

interface UpdateTestResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTestResultVariables): MutationRef<UpdateTestResultData, UpdateTestResultVariables>;
}
export const updateTestResultRef: UpdateTestResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTestResult(dc: DataConnect, vars: UpdateTestResultVariables): MutationPromise<UpdateTestResultData, UpdateTestResultVariables>;

interface UpdateTestResultRef {
  ...
  (dc: DataConnect, vars: UpdateTestResultVariables): MutationRef<UpdateTestResultData, UpdateTestResultVariables>;
}
export const updateTestResultRef: UpdateTestResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTestResultRef:
```typescript
const name = updateTestResultRef.operationName;
console.log(name);
```

### Variables
The `UpdateTestResult` mutation requires an argument of type `UpdateTestResultVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTestResultVariables {
  resultId: string;
  resultData?: string | null;
  status?: string | null;
  reportDate?: DateString | null;
  reportUrl?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateTestResult` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTestResultData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTestResultData {
  testResult_update?: TestResult_Key | null;
}
```
### Using `UpdateTestResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTestResult, UpdateTestResultVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTestResult` mutation requires an argument of type `UpdateTestResultVariables`:
const updateTestResultVars: UpdateTestResultVariables = {
  resultId: ..., 
  resultData: ..., // optional
  status: ..., // optional
  reportDate: ..., // optional
  reportUrl: ..., // optional
  notes: ..., // optional
};

// Call the `updateTestResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTestResult(updateTestResultVars);
// Variables can be defined inline as well.
const { data } = await updateTestResult({ resultId: ..., resultData: ..., status: ..., reportDate: ..., reportUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTestResult(dataConnect, updateTestResultVars);

console.log(data.testResult_update);

// Or, you can use the `Promise` API.
updateTestResult(updateTestResultVars).then((response) => {
  const data = response.data;
  console.log(data.testResult_update);
});
```

### Using `UpdateTestResult`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTestResultRef, UpdateTestResultVariables } from '@firebasegen/adnlab-connector';

// The `UpdateTestResult` mutation requires an argument of type `UpdateTestResultVariables`:
const updateTestResultVars: UpdateTestResultVariables = {
  resultId: ..., 
  resultData: ..., // optional
  status: ..., // optional
  reportDate: ..., // optional
  reportUrl: ..., // optional
  notes: ..., // optional
};

// Call the `updateTestResultRef()` function to get a reference to the mutation.
const ref = updateTestResultRef(updateTestResultVars);
// Variables can be defined inline as well.
const ref = updateTestResultRef({ resultId: ..., resultData: ..., status: ..., reportDate: ..., reportUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTestResultRef(dataConnect, updateTestResultVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.testResult_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.testResult_update);
});
```

## VerifyTestResult
You can execute the `VerifyTestResult` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
verifyTestResult(vars: VerifyTestResultVariables): MutationPromise<VerifyTestResultData, VerifyTestResultVariables>;

interface VerifyTestResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: VerifyTestResultVariables): MutationRef<VerifyTestResultData, VerifyTestResultVariables>;
}
export const verifyTestResultRef: VerifyTestResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
verifyTestResult(dc: DataConnect, vars: VerifyTestResultVariables): MutationPromise<VerifyTestResultData, VerifyTestResultVariables>;

interface VerifyTestResultRef {
  ...
  (dc: DataConnect, vars: VerifyTestResultVariables): MutationRef<VerifyTestResultData, VerifyTestResultVariables>;
}
export const verifyTestResultRef: VerifyTestResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the verifyTestResultRef:
```typescript
const name = verifyTestResultRef.operationName;
console.log(name);
```

### Variables
The `VerifyTestResult` mutation requires an argument of type `VerifyTestResultVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface VerifyTestResultVariables {
  resultId: string;
  verifiedBy: string;
}
```
### Return Type
Recall that executing the `VerifyTestResult` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `VerifyTestResultData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface VerifyTestResultData {
  testResult_update?: TestResult_Key | null;
}
```
### Using `VerifyTestResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, verifyTestResult, VerifyTestResultVariables } from '@firebasegen/adnlab-connector';

// The `VerifyTestResult` mutation requires an argument of type `VerifyTestResultVariables`:
const verifyTestResultVars: VerifyTestResultVariables = {
  resultId: ..., 
  verifiedBy: ..., 
};

// Call the `verifyTestResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await verifyTestResult(verifyTestResultVars);
// Variables can be defined inline as well.
const { data } = await verifyTestResult({ resultId: ..., verifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await verifyTestResult(dataConnect, verifyTestResultVars);

console.log(data.testResult_update);

// Or, you can use the `Promise` API.
verifyTestResult(verifyTestResultVars).then((response) => {
  const data = response.data;
  console.log(data.testResult_update);
});
```

### Using `VerifyTestResult`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, verifyTestResultRef, VerifyTestResultVariables } from '@firebasegen/adnlab-connector';

// The `VerifyTestResult` mutation requires an argument of type `VerifyTestResultVariables`:
const verifyTestResultVars: VerifyTestResultVariables = {
  resultId: ..., 
  verifiedBy: ..., 
};

// Call the `verifyTestResultRef()` function to get a reference to the mutation.
const ref = verifyTestResultRef(verifyTestResultVars);
// Variables can be defined inline as well.
const ref = verifyTestResultRef({ resultId: ..., verifiedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = verifyTestResultRef(dataConnect, verifyTestResultVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.testResult_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.testResult_update);
});
```

## CreatePayment
You can execute the `CreatePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPaymentRef:
```typescript
const name = createPaymentRef.operationName;
console.log(name);
```

### Variables
The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePaymentVariables {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string | null;
  paymentDate: DateString;
}
```
### Return Type
Recall that executing the `CreatePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePaymentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePaymentData {
  payment_insert: Payment_Key;
}
```
### Using `CreatePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayment, CreatePaymentVariables } from '@firebasegen/adnlab-connector';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  id: ..., 
  bookingId: ..., 
  amount: ..., 
  paymentMethod: ..., 
  transactionId: ..., // optional
  paymentDate: ..., 
};

// Call the `createPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayment(createPaymentVars);
// Variables can be defined inline as well.
const { data } = await createPayment({ id: ..., bookingId: ..., amount: ..., paymentMethod: ..., transactionId: ..., paymentDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayment(dataConnect, createPaymentVars);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
createPayment(createPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

### Using `CreatePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPaymentRef, CreatePaymentVariables } from '@firebasegen/adnlab-connector';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  id: ..., 
  bookingId: ..., 
  amount: ..., 
  paymentMethod: ..., 
  transactionId: ..., // optional
  paymentDate: ..., 
};

// Call the `createPaymentRef()` function to get a reference to the mutation.
const ref = createPaymentRef(createPaymentVars);
// Variables can be defined inline as well.
const ref = createPaymentRef({ id: ..., bookingId: ..., amount: ..., paymentMethod: ..., transactionId: ..., paymentDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPaymentRef(dataConnect, createPaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

## UpdatePaymentStatus
You can execute the `UpdatePaymentStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updatePaymentStatus(vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface UpdatePaymentStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePaymentStatus(dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface UpdatePaymentStatusRef {
  ...
  (dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePaymentStatusRef:
```typescript
const name = updatePaymentStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  transactionId?: string | null;
  refundDetail?: string | null;
}
```
### Return Type
Recall that executing the `UpdatePaymentStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePaymentStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePaymentStatusData {
  payment_update?: Payment_Key | null;
}
```
### Using `UpdatePaymentStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePaymentStatus, UpdatePaymentStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`:
const updatePaymentStatusVars: UpdatePaymentStatusVariables = {
  paymentId: ..., 
  status: ..., 
  transactionId: ..., // optional
  refundDetail: ..., // optional
};

// Call the `updatePaymentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePaymentStatus(updatePaymentStatusVars);
// Variables can be defined inline as well.
const { data } = await updatePaymentStatus({ paymentId: ..., status: ..., transactionId: ..., refundDetail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePaymentStatus(dataConnect, updatePaymentStatusVars);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
updatePaymentStatus(updatePaymentStatusVars).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

### Using `UpdatePaymentStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePaymentStatusRef, UpdatePaymentStatusVariables } from '@firebasegen/adnlab-connector';

// The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`:
const updatePaymentStatusVars: UpdatePaymentStatusVariables = {
  paymentId: ..., 
  status: ..., 
  transactionId: ..., // optional
  refundDetail: ..., // optional
};

// Call the `updatePaymentStatusRef()` function to get a reference to the mutation.
const ref = updatePaymentStatusRef(updatePaymentStatusVars);
// Variables can be defined inline as well.
const ref = updatePaymentStatusRef({ paymentId: ..., status: ..., transactionId: ..., refundDetail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePaymentStatusRef(dataConnect, updatePaymentStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

## CreateFeedback
You can execute the `CreateFeedback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createFeedback(vars: CreateFeedbackVariables): MutationPromise<CreateFeedbackData, CreateFeedbackVariables>;

interface CreateFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFeedbackVariables): MutationRef<CreateFeedbackData, CreateFeedbackVariables>;
}
export const createFeedbackRef: CreateFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFeedback(dc: DataConnect, vars: CreateFeedbackVariables): MutationPromise<CreateFeedbackData, CreateFeedbackVariables>;

interface CreateFeedbackRef {
  ...
  (dc: DataConnect, vars: CreateFeedbackVariables): MutationRef<CreateFeedbackData, CreateFeedbackVariables>;
}
export const createFeedbackRef: CreateFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFeedbackRef:
```typescript
const name = createFeedbackRef.operationName;
console.log(name);
```

### Variables
The `CreateFeedback` mutation requires an argument of type `CreateFeedbackVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFeedbackVariables {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
}
```
### Return Type
Recall that executing the `CreateFeedback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFeedbackData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFeedbackData {
  feedback_insert: Feedback_Key;
}
```
### Using `CreateFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFeedback, CreateFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `CreateFeedback` mutation requires an argument of type `CreateFeedbackVariables`:
const createFeedbackVars: CreateFeedbackVariables = {
  id: ..., 
  bookingId: ..., 
  rating: ..., 
  comment: ..., // optional
};

// Call the `createFeedback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFeedback(createFeedbackVars);
// Variables can be defined inline as well.
const { data } = await createFeedback({ id: ..., bookingId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFeedback(dataConnect, createFeedbackVars);

console.log(data.feedback_insert);

// Or, you can use the `Promise` API.
createFeedback(createFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedback_insert);
});
```

### Using `CreateFeedback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFeedbackRef, CreateFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `CreateFeedback` mutation requires an argument of type `CreateFeedbackVariables`:
const createFeedbackVars: CreateFeedbackVariables = {
  id: ..., 
  bookingId: ..., 
  rating: ..., 
  comment: ..., // optional
};

// Call the `createFeedbackRef()` function to get a reference to the mutation.
const ref = createFeedbackRef(createFeedbackVars);
// Variables can be defined inline as well.
const ref = createFeedbackRef({ id: ..., bookingId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFeedbackRef(dataConnect, createFeedbackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.feedback_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.feedback_insert);
});
```

## UpdateFeedback
You can execute the `UpdateFeedback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateFeedback(vars: UpdateFeedbackVariables): MutationPromise<UpdateFeedbackData, UpdateFeedbackVariables>;

interface UpdateFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFeedbackVariables): MutationRef<UpdateFeedbackData, UpdateFeedbackVariables>;
}
export const updateFeedbackRef: UpdateFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFeedback(dc: DataConnect, vars: UpdateFeedbackVariables): MutationPromise<UpdateFeedbackData, UpdateFeedbackVariables>;

interface UpdateFeedbackRef {
  ...
  (dc: DataConnect, vars: UpdateFeedbackVariables): MutationRef<UpdateFeedbackData, UpdateFeedbackVariables>;
}
export const updateFeedbackRef: UpdateFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFeedbackRef:
```typescript
const name = updateFeedbackRef.operationName;
console.log(name);
```

### Variables
The `UpdateFeedback` mutation requires an argument of type `UpdateFeedbackVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFeedbackVariables {
  feedbackId: string;
  rating?: number | null;
  comment?: string | null;
}
```
### Return Type
Recall that executing the `UpdateFeedback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFeedbackData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFeedbackData {
  feedback_update?: Feedback_Key | null;
}
```
### Using `UpdateFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFeedback, UpdateFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `UpdateFeedback` mutation requires an argument of type `UpdateFeedbackVariables`:
const updateFeedbackVars: UpdateFeedbackVariables = {
  feedbackId: ..., 
  rating: ..., // optional
  comment: ..., // optional
};

// Call the `updateFeedback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFeedback(updateFeedbackVars);
// Variables can be defined inline as well.
const { data } = await updateFeedback({ feedbackId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFeedback(dataConnect, updateFeedbackVars);

console.log(data.feedback_update);

// Or, you can use the `Promise` API.
updateFeedback(updateFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedback_update);
});
```

### Using `UpdateFeedback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFeedbackRef, UpdateFeedbackVariables } from '@firebasegen/adnlab-connector';

// The `UpdateFeedback` mutation requires an argument of type `UpdateFeedbackVariables`:
const updateFeedbackVars: UpdateFeedbackVariables = {
  feedbackId: ..., 
  rating: ..., // optional
  comment: ..., // optional
};

// Call the `updateFeedbackRef()` function to get a reference to the mutation.
const ref = updateFeedbackRef(updateFeedbackVars);
// Variables can be defined inline as well.
const ref = updateFeedbackRef({ feedbackId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFeedbackRef(dataConnect, updateFeedbackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.feedback_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.feedback_update);
});
```

## CreateNotification
You can execute the `CreateNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNotificationRef:
```typescript
const name = createNotificationRef.operationName;
console.log(name);
```

### Variables
The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNotificationVariables {
  id: string;
  userId?: string | null;
  staffId?: string | null;
  title: string;
  message: string;
  type: string;
}
```
### Return Type
Recall that executing the `CreateNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNotificationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNotificationData {
  notification_insert: Notification_Key;
}
```
### Using `CreateNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNotification, CreateNotificationVariables } from '@firebasegen/adnlab-connector';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  id: ..., 
  userId: ..., // optional
  staffId: ..., // optional
  title: ..., 
  message: ..., 
  type: ..., 
};

// Call the `createNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNotification(createNotificationVars);
// Variables can be defined inline as well.
const { data } = await createNotification({ id: ..., userId: ..., staffId: ..., title: ..., message: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNotification(dataConnect, createNotificationVars);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
createNotification(createNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

### Using `CreateNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNotificationRef, CreateNotificationVariables } from '@firebasegen/adnlab-connector';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  id: ..., 
  userId: ..., // optional
  staffId: ..., // optional
  title: ..., 
  message: ..., 
  type: ..., 
};

// Call the `createNotificationRef()` function to get a reference to the mutation.
const ref = createNotificationRef(createNotificationVars);
// Variables can be defined inline as well.
const ref = createNotificationRef({ id: ..., userId: ..., staffId: ..., title: ..., message: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNotificationRef(dataConnect, createNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

## MarkNotificationRead
You can execute the `MarkNotificationRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markNotificationReadRef:
```typescript
const name = markNotificationReadRef.operationName;
console.log(name);
```

### Variables
The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkNotificationReadVariables {
  notificationId: string;
}
```
### Return Type
Recall that executing the `MarkNotificationRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkNotificationReadData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}
```
### Using `MarkNotificationRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markNotificationRead, MarkNotificationReadVariables } from '@firebasegen/adnlab-connector';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  notificationId: ..., 
};

// Call the `markNotificationRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markNotificationRead(markNotificationReadVars);
// Variables can be defined inline as well.
const { data } = await markNotificationRead({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markNotificationRead(dataConnect, markNotificationReadVars);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
markNotificationRead(markNotificationReadVars).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

### Using `MarkNotificationRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markNotificationReadRef, MarkNotificationReadVariables } from '@firebasegen/adnlab-connector';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  notificationId: ..., 
};

// Call the `markNotificationReadRef()` function to get a reference to the mutation.
const ref = markNotificationReadRef(markNotificationReadVars);
// Variables can be defined inline as well.
const ref = markNotificationReadRef({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markNotificationReadRef(dataConnect, markNotificationReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

## MarkAllNotificationsRead
You can execute the `MarkAllNotificationsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markAllNotificationsRead(vars: MarkAllNotificationsReadVariables): MutationPromise<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;

interface MarkAllNotificationsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAllNotificationsReadVariables): MutationRef<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;
}
export const markAllNotificationsReadRef: MarkAllNotificationsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAllNotificationsRead(dc: DataConnect, vars: MarkAllNotificationsReadVariables): MutationPromise<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;

interface MarkAllNotificationsReadRef {
  ...
  (dc: DataConnect, vars: MarkAllNotificationsReadVariables): MutationRef<MarkAllNotificationsReadData, MarkAllNotificationsReadVariables>;
}
export const markAllNotificationsReadRef: MarkAllNotificationsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAllNotificationsReadRef:
```typescript
const name = markAllNotificationsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkAllNotificationsRead` mutation requires an argument of type `MarkAllNotificationsReadVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAllNotificationsReadVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `MarkAllNotificationsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAllNotificationsReadData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAllNotificationsReadData {
  notification_updateMany: number;
}
```
### Using `MarkAllNotificationsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAllNotificationsRead, MarkAllNotificationsReadVariables } from '@firebasegen/adnlab-connector';

// The `MarkAllNotificationsRead` mutation requires an argument of type `MarkAllNotificationsReadVariables`:
const markAllNotificationsReadVars: MarkAllNotificationsReadVariables = {
  userId: ..., 
};

// Call the `markAllNotificationsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAllNotificationsRead(markAllNotificationsReadVars);
// Variables can be defined inline as well.
const { data } = await markAllNotificationsRead({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAllNotificationsRead(dataConnect, markAllNotificationsReadVars);

console.log(data.notification_updateMany);

// Or, you can use the `Promise` API.
markAllNotificationsRead(markAllNotificationsReadVars).then((response) => {
  const data = response.data;
  console.log(data.notification_updateMany);
});
```

### Using `MarkAllNotificationsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAllNotificationsReadRef, MarkAllNotificationsReadVariables } from '@firebasegen/adnlab-connector';

// The `MarkAllNotificationsRead` mutation requires an argument of type `MarkAllNotificationsReadVariables`:
const markAllNotificationsReadVars: MarkAllNotificationsReadVariables = {
  userId: ..., 
};

// Call the `markAllNotificationsReadRef()` function to get a reference to the mutation.
const ref = markAllNotificationsReadRef(markAllNotificationsReadVars);
// Variables can be defined inline as well.
const ref = markAllNotificationsReadRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAllNotificationsReadRef(dataConnect, markAllNotificationsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_updateMany);
});
```

## DeleteNotification
You can execute the `DeleteNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteNotificationRef:
```typescript
const name = deleteNotificationRef.operationName;
console.log(name);
```

### Variables
The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteNotificationVariables {
  notificationId: string;
}
```
### Return Type
Recall that executing the `DeleteNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteNotificationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}
```
### Using `DeleteNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteNotification, DeleteNotificationVariables } from '@firebasegen/adnlab-connector';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  notificationId: ..., 
};

// Call the `deleteNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteNotification(deleteNotificationVars);
// Variables can be defined inline as well.
const { data } = await deleteNotification({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteNotification(dataConnect, deleteNotificationVars);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
deleteNotification(deleteNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
});
```

### Using `DeleteNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteNotificationRef, DeleteNotificationVariables } from '@firebasegen/adnlab-connector';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  notificationId: ..., 
};

// Call the `deleteNotificationRef()` function to get a reference to the mutation.
const ref = deleteNotificationRef(deleteNotificationVars);
// Variables can be defined inline as well.
const ref = deleteNotificationRef({ notificationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteNotificationRef(dataConnect, deleteNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
});
```

