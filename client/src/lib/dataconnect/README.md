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
  - [*GetServiceCategories*](#getservicecategories)
  - [*GetServiceCategoryById*](#getservicecategorybyid)
  - [*GetMethods*](#getmethods)
  - [*GetMethodById*](#getmethodbyid)
  - [*GetServices*](#getservices)
  - [*GetServiceById*](#getservicebyid)
  - [*GetServicesByCategory*](#getservicesbycategory)
  - [*GetFeaturedServices*](#getfeaturedservices)
  - [*GetServiceMethods*](#getservicemethods)
  - [*GetMethodsForService*](#getmethodsforservice)
  - [*GetServicesForMethod*](#getservicesformethod)
  - [*GetServiceWithMethods*](#getservicewithmethods)
  - [*GetTimeSlots*](#gettimeslots)
  - [*GetTimeSlotById*](#gettimeslotbyid)
  - [*GetTimeSlotsInRange*](#gettimeslotsinrange)
  - [*GetUserBookings*](#getuserbookings)
  - [*GetMyBookings*](#getmybookings)
  - [*GetBookingById*](#getbookingbyid)
  - [*GetBookingHistory*](#getbookinghistory)
  - [*GetStaffBookings*](#getstaffbookings)
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
  - [*GetBlogs*](#getblogs)
  - [*GetBlogById*](#getblogbyid)
  - [*GetBlogsByUser*](#getblogsbyuser)
  - [*GetMyBlogs*](#getmyblogs)
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
  - [*CreateServiceCategory*](#createservicecategory)
  - [*UpdateServiceCategory*](#updateservicecategory)
  - [*CreateMethod*](#createmethod)
  - [*UpdateMethod*](#updatemethod)
  - [*CreateService*](#createservice)
  - [*UpdateService*](#updateservice)
  - [*CreateServiceMethod*](#createservicemethod)
  - [*DeleteServiceMethod*](#deleteservicemethod)
  - [*CreateTimeSlot*](#createtimeslot)
  - [*UpdateTimeSlot*](#updatetimeslot)
  - [*UpdateTimeSlotBookings*](#updatetimeslotbookings)
  - [*CreateBooking*](#createbooking)
  - [*UpdateBooking*](#updatebooking)
  - [*AssignBookingStaff*](#assignbookingstaff)
  - [*CreateBookingHistory*](#createbookinghistory)
  - [*UpdateBookingHistory*](#updatebookinghistory)
  - [*CreateSample*](#createsample)
  - [*UpdateSampleStatus*](#updatesamplestatus)
  - [*CreateTestResult*](#createtestresult)
  - [*UpdateTestResult*](#updatetestresult)
  - [*AssignTestResultStaff*](#assigntestresultstaff)
  - [*CreatePayment*](#createpayment)
  - [*UpdatePaymentStatus*](#updatepaymentstatus)
  - [*AddRefundDetail*](#addrefunddetail)
  - [*CreateFeedback*](#createfeedback)
  - [*UpdateFeedback*](#updatefeedback)
  - [*CreateBlog*](#createblog)
  - [*UpdateBlog*](#updateblog)
  - [*DeleteBlog*](#deleteblog)
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
    gender?: string | null;
    avatar?: string | null;
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
    gender?: string | null;
    avatar?: string | null;
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
    gender?: string | null;
    avatar?: string | null;
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

## GetServiceCategories
You can execute the `GetServiceCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServiceCategories(): QueryPromise<GetServiceCategoriesData, undefined>;

interface GetServiceCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServiceCategoriesData, undefined>;
}
export const getServiceCategoriesRef: GetServiceCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceCategories(dc: DataConnect): QueryPromise<GetServiceCategoriesData, undefined>;

interface GetServiceCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<GetServiceCategoriesData, undefined>;
}
export const getServiceCategoriesRef: GetServiceCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceCategoriesRef:
```typescript
const name = getServiceCategoriesRef.operationName;
console.log(name);
```

### Variables
The `GetServiceCategories` query has no variables.
### Return Type
Recall that executing the `GetServiceCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceCategoriesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceCategoriesData {
  serviceCategories: ({
    id: string;
    name: string;
    description?: string | null;
    hasLegalValue: boolean;
    icon?: string | null;
    color?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & ServiceCategory_Key)[];
}
```
### Using `GetServiceCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceCategories } from '@firebasegen/adnlab-connector';


// Call the `getServiceCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceCategories(dataConnect);

console.log(data.serviceCategories);

// Or, you can use the `Promise` API.
getServiceCategories().then((response) => {
  const data = response.data;
  console.log(data.serviceCategories);
});
```

### Using `GetServiceCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceCategoriesRef } from '@firebasegen/adnlab-connector';


// Call the `getServiceCategoriesRef()` function to get a reference to the query.
const ref = getServiceCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceCategoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceCategories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCategories);
});
```

## GetServiceCategoryById
You can execute the `GetServiceCategoryById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServiceCategoryById(vars: GetServiceCategoryByIdVariables): QueryPromise<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;

interface GetServiceCategoryByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceCategoryByIdVariables): QueryRef<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;
}
export const getServiceCategoryByIdRef: GetServiceCategoryByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceCategoryById(dc: DataConnect, vars: GetServiceCategoryByIdVariables): QueryPromise<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;

interface GetServiceCategoryByIdRef {
  ...
  (dc: DataConnect, vars: GetServiceCategoryByIdVariables): QueryRef<GetServiceCategoryByIdData, GetServiceCategoryByIdVariables>;
}
export const getServiceCategoryByIdRef: GetServiceCategoryByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceCategoryByIdRef:
```typescript
const name = getServiceCategoryByIdRef.operationName;
console.log(name);
```

### Variables
The `GetServiceCategoryById` query requires an argument of type `GetServiceCategoryByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceCategoryByIdVariables {
  categoryId: string;
}
```
### Return Type
Recall that executing the `GetServiceCategoryById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceCategoryByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceCategoryByIdData {
  serviceCategory?: {
    id: string;
    name: string;
    description?: string | null;
    hasLegalValue: boolean;
    icon?: string | null;
    color?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & ServiceCategory_Key;
}
```
### Using `GetServiceCategoryById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceCategoryById, GetServiceCategoryByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceCategoryById` query requires an argument of type `GetServiceCategoryByIdVariables`:
const getServiceCategoryByIdVars: GetServiceCategoryByIdVariables = {
  categoryId: ..., 
};

// Call the `getServiceCategoryById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceCategoryById(getServiceCategoryByIdVars);
// Variables can be defined inline as well.
const { data } = await getServiceCategoryById({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceCategoryById(dataConnect, getServiceCategoryByIdVars);

console.log(data.serviceCategory);

// Or, you can use the `Promise` API.
getServiceCategoryById(getServiceCategoryByIdVars).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory);
});
```

### Using `GetServiceCategoryById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceCategoryByIdRef, GetServiceCategoryByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceCategoryById` query requires an argument of type `GetServiceCategoryByIdVariables`:
const getServiceCategoryByIdVars: GetServiceCategoryByIdVariables = {
  categoryId: ..., 
};

// Call the `getServiceCategoryByIdRef()` function to get a reference to the query.
const ref = getServiceCategoryByIdRef(getServiceCategoryByIdVars);
// Variables can be defined inline as well.
const ref = getServiceCategoryByIdRef({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceCategoryByIdRef(dataConnect, getServiceCategoryByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceCategory);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory);
});
```

## GetMethods
You can execute the `GetMethods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMethods(): QueryPromise<GetMethodsData, undefined>;

interface GetMethodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMethodsData, undefined>;
}
export const getMethodsRef: GetMethodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMethods(dc: DataConnect): QueryPromise<GetMethodsData, undefined>;

interface GetMethodsRef {
  ...
  (dc: DataConnect): QueryRef<GetMethodsData, undefined>;
}
export const getMethodsRef: GetMethodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMethodsRef:
```typescript
const name = getMethodsRef.operationName;
console.log(name);
```

### Variables
The `GetMethods` query has no variables.
### Return Type
Recall that executing the `GetMethods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMethodsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMethodsData {
  methods: ({
    id: string;
    name: string;
    description?: string | null;
    price: number;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Method_Key)[];
}
```
### Using `GetMethods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMethods } from '@firebasegen/adnlab-connector';


// Call the `getMethods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMethods();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMethods(dataConnect);

console.log(data.methods);

// Or, you can use the `Promise` API.
getMethods().then((response) => {
  const data = response.data;
  console.log(data.methods);
});
```

### Using `GetMethods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMethodsRef } from '@firebasegen/adnlab-connector';


// Call the `getMethodsRef()` function to get a reference to the query.
const ref = getMethodsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMethodsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.methods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.methods);
});
```

## GetMethodById
You can execute the `GetMethodById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMethodById(vars: GetMethodByIdVariables): QueryPromise<GetMethodByIdData, GetMethodByIdVariables>;

interface GetMethodByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMethodByIdVariables): QueryRef<GetMethodByIdData, GetMethodByIdVariables>;
}
export const getMethodByIdRef: GetMethodByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMethodById(dc: DataConnect, vars: GetMethodByIdVariables): QueryPromise<GetMethodByIdData, GetMethodByIdVariables>;

interface GetMethodByIdRef {
  ...
  (dc: DataConnect, vars: GetMethodByIdVariables): QueryRef<GetMethodByIdData, GetMethodByIdVariables>;
}
export const getMethodByIdRef: GetMethodByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMethodByIdRef:
```typescript
const name = getMethodByIdRef.operationName;
console.log(name);
```

### Variables
The `GetMethodById` query requires an argument of type `GetMethodByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMethodByIdVariables {
  methodId: string;
}
```
### Return Type
Recall that executing the `GetMethodById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMethodByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMethodByIdData {
  method?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Method_Key;
}
```
### Using `GetMethodById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMethodById, GetMethodByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetMethodById` query requires an argument of type `GetMethodByIdVariables`:
const getMethodByIdVars: GetMethodByIdVariables = {
  methodId: ..., 
};

// Call the `getMethodById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMethodById(getMethodByIdVars);
// Variables can be defined inline as well.
const { data } = await getMethodById({ methodId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMethodById(dataConnect, getMethodByIdVars);

console.log(data.method);

// Or, you can use the `Promise` API.
getMethodById(getMethodByIdVars).then((response) => {
  const data = response.data;
  console.log(data.method);
});
```

### Using `GetMethodById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMethodByIdRef, GetMethodByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetMethodById` query requires an argument of type `GetMethodByIdVariables`:
const getMethodByIdVars: GetMethodByIdVariables = {
  methodId: ..., 
};

// Call the `getMethodByIdRef()` function to get a reference to the query.
const ref = getMethodByIdRef(getMethodByIdVars);
// Variables can be defined inline as well.
const ref = getMethodByIdRef({ methodId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMethodByIdRef(dataConnect, getMethodByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.method);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.method);
});
```

## GetServices
You can execute the `GetServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServices(): QueryPromise<GetServicesData, undefined>;

interface GetServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetServicesData, undefined>;
}
export const getServicesRef: GetServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServices(dc: DataConnect): QueryPromise<GetServicesData, undefined>;

interface GetServicesRef {
  ...
  (dc: DataConnect): QueryRef<GetServicesData, undefined>;
}
export const getServicesRef: GetServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServicesRef:
```typescript
const name = getServicesRef.operationName;
console.log(name);
```

### Variables
The `GetServices` query has no variables.
### Return Type
Recall that executing the `GetServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServicesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServicesData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
      icon?: string | null;
      color?: string | null;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
}
```
### Using `GetServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServices } from '@firebasegen/adnlab-connector';


// Call the `getServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
getServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `GetServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServicesRef } from '@firebasegen/adnlab-connector';


// Call the `getServicesRef()` function to get a reference to the query.
const ref = getServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## GetServiceById
You can execute the `GetServiceById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServiceById(vars: GetServiceByIdVariables): QueryPromise<GetServiceByIdData, GetServiceByIdVariables>;

interface GetServiceByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceByIdVariables): QueryRef<GetServiceByIdData, GetServiceByIdVariables>;
}
export const getServiceByIdRef: GetServiceByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceById(dc: DataConnect, vars: GetServiceByIdVariables): QueryPromise<GetServiceByIdData, GetServiceByIdVariables>;

interface GetServiceByIdRef {
  ...
  (dc: DataConnect, vars: GetServiceByIdVariables): QueryRef<GetServiceByIdData, GetServiceByIdVariables>;
}
export const getServiceByIdRef: GetServiceByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceByIdRef:
```typescript
const name = getServiceByIdRef.operationName;
console.log(name);
```

### Variables
The `GetServiceById` query requires an argument of type `GetServiceByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceByIdVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetServiceById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceByIdData {
  service?: {
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
      icon?: string | null;
      color?: string | null;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key;
}
```
### Using `GetServiceById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceById, GetServiceByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceById` query requires an argument of type `GetServiceByIdVariables`:
const getServiceByIdVars: GetServiceByIdVariables = {
  serviceId: ..., 
};

// Call the `getServiceById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceById(getServiceByIdVars);
// Variables can be defined inline as well.
const { data } = await getServiceById({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceById(dataConnect, getServiceByIdVars);

console.log(data.service);

// Or, you can use the `Promise` API.
getServiceById(getServiceByIdVars).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

### Using `GetServiceById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceByIdRef, GetServiceByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceById` query requires an argument of type `GetServiceByIdVariables`:
const getServiceByIdVars: GetServiceByIdVariables = {
  serviceId: ..., 
};

// Call the `getServiceByIdRef()` function to get a reference to the query.
const ref = getServiceByIdRef(getServiceByIdVars);
// Variables can be defined inline as well.
const ref = getServiceByIdRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceByIdRef(dataConnect, getServiceByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.service);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

## GetServicesByCategory
You can execute the `GetServicesByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServicesByCategory(vars: GetServicesByCategoryVariables): QueryPromise<GetServicesByCategoryData, GetServicesByCategoryVariables>;

interface GetServicesByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServicesByCategoryVariables): QueryRef<GetServicesByCategoryData, GetServicesByCategoryVariables>;
}
export const getServicesByCategoryRef: GetServicesByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServicesByCategory(dc: DataConnect, vars: GetServicesByCategoryVariables): QueryPromise<GetServicesByCategoryData, GetServicesByCategoryVariables>;

interface GetServicesByCategoryRef {
  ...
  (dc: DataConnect, vars: GetServicesByCategoryVariables): QueryRef<GetServicesByCategoryData, GetServicesByCategoryVariables>;
}
export const getServicesByCategoryRef: GetServicesByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServicesByCategoryRef:
```typescript
const name = getServicesByCategoryRef.operationName;
console.log(name);
```

### Variables
The `GetServicesByCategory` query requires an argument of type `GetServicesByCategoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServicesByCategoryVariables {
  categoryId: string;
}
```
### Return Type
Recall that executing the `GetServicesByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServicesByCategoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServicesByCategoryData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
}
```
### Using `GetServicesByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServicesByCategory, GetServicesByCategoryVariables } from '@firebasegen/adnlab-connector';

// The `GetServicesByCategory` query requires an argument of type `GetServicesByCategoryVariables`:
const getServicesByCategoryVars: GetServicesByCategoryVariables = {
  categoryId: ..., 
};

// Call the `getServicesByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServicesByCategory(getServicesByCategoryVars);
// Variables can be defined inline as well.
const { data } = await getServicesByCategory({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServicesByCategory(dataConnect, getServicesByCategoryVars);

console.log(data.services);

// Or, you can use the `Promise` API.
getServicesByCategory(getServicesByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `GetServicesByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServicesByCategoryRef, GetServicesByCategoryVariables } from '@firebasegen/adnlab-connector';

// The `GetServicesByCategory` query requires an argument of type `GetServicesByCategoryVariables`:
const getServicesByCategoryVars: GetServicesByCategoryVariables = {
  categoryId: ..., 
};

// Call the `getServicesByCategoryRef()` function to get a reference to the query.
const ref = getServicesByCategoryRef(getServicesByCategoryVars);
// Variables can be defined inline as well.
const ref = getServicesByCategoryRef({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServicesByCategoryRef(dataConnect, getServicesByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## GetFeaturedServices
You can execute the `GetFeaturedServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getFeaturedServices(): QueryPromise<GetFeaturedServicesData, undefined>;

interface GetFeaturedServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFeaturedServicesData, undefined>;
}
export const getFeaturedServicesRef: GetFeaturedServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFeaturedServices(dc: DataConnect): QueryPromise<GetFeaturedServicesData, undefined>;

interface GetFeaturedServicesRef {
  ...
  (dc: DataConnect): QueryRef<GetFeaturedServicesData, undefined>;
}
export const getFeaturedServicesRef: GetFeaturedServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFeaturedServicesRef:
```typescript
const name = getFeaturedServicesRef.operationName;
console.log(name);
```

### Variables
The `GetFeaturedServices` query has no variables.
### Return Type
Recall that executing the `GetFeaturedServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFeaturedServicesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFeaturedServicesData {
  services: ({
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      hasLegalValue: boolean;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key)[];
}
```
### Using `GetFeaturedServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFeaturedServices } from '@firebasegen/adnlab-connector';


// Call the `getFeaturedServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFeaturedServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFeaturedServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
getFeaturedServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `GetFeaturedServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFeaturedServicesRef } from '@firebasegen/adnlab-connector';


// Call the `getFeaturedServicesRef()` function to get a reference to the query.
const ref = getFeaturedServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFeaturedServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## GetServiceMethods
You can execute the `GetServiceMethods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServiceMethods(vars: GetServiceMethodsVariables): QueryPromise<GetServiceMethodsData, GetServiceMethodsVariables>;

interface GetServiceMethodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceMethodsVariables): QueryRef<GetServiceMethodsData, GetServiceMethodsVariables>;
}
export const getServiceMethodsRef: GetServiceMethodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceMethods(dc: DataConnect, vars: GetServiceMethodsVariables): QueryPromise<GetServiceMethodsData, GetServiceMethodsVariables>;

interface GetServiceMethodsRef {
  ...
  (dc: DataConnect, vars: GetServiceMethodsVariables): QueryRef<GetServiceMethodsData, GetServiceMethodsVariables>;
}
export const getServiceMethodsRef: GetServiceMethodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceMethodsRef:
```typescript
const name = getServiceMethodsRef.operationName;
console.log(name);
```

### Variables
The `GetServiceMethods` query requires an argument of type `GetServiceMethodsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceMethodsVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetServiceMethods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceMethodsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceMethodsData {
  serviceMethods: ({
    id: string;
    serviceId: string;
    methodId: string;
    service: {
      id: string;
      title: string;
    } & Service_Key;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        createdAt: TimestampString;
        updatedAt?: TimestampString | null;
  } & ServiceMethod_Key)[];
}
```
### Using `GetServiceMethods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceMethods, GetServiceMethodsVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceMethods` query requires an argument of type `GetServiceMethodsVariables`:
const getServiceMethodsVars: GetServiceMethodsVariables = {
  serviceId: ..., 
};

// Call the `getServiceMethods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceMethods(getServiceMethodsVars);
// Variables can be defined inline as well.
const { data } = await getServiceMethods({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceMethods(dataConnect, getServiceMethodsVars);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
getServiceMethods(getServiceMethodsVars).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

### Using `GetServiceMethods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceMethodsRef, GetServiceMethodsVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceMethods` query requires an argument of type `GetServiceMethodsVariables`:
const getServiceMethodsVars: GetServiceMethodsVariables = {
  serviceId: ..., 
};

// Call the `getServiceMethodsRef()` function to get a reference to the query.
const ref = getServiceMethodsRef(getServiceMethodsVars);
// Variables can be defined inline as well.
const ref = getServiceMethodsRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceMethodsRef(dataConnect, getServiceMethodsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

## GetMethodsForService
You can execute the `GetMethodsForService` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMethodsForService(vars: GetMethodsForServiceVariables): QueryPromise<GetMethodsForServiceData, GetMethodsForServiceVariables>;

interface GetMethodsForServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMethodsForServiceVariables): QueryRef<GetMethodsForServiceData, GetMethodsForServiceVariables>;
}
export const getMethodsForServiceRef: GetMethodsForServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMethodsForService(dc: DataConnect, vars: GetMethodsForServiceVariables): QueryPromise<GetMethodsForServiceData, GetMethodsForServiceVariables>;

interface GetMethodsForServiceRef {
  ...
  (dc: DataConnect, vars: GetMethodsForServiceVariables): QueryRef<GetMethodsForServiceData, GetMethodsForServiceVariables>;
}
export const getMethodsForServiceRef: GetMethodsForServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMethodsForServiceRef:
```typescript
const name = getMethodsForServiceRef.operationName;
console.log(name);
```

### Variables
The `GetMethodsForService` query requires an argument of type `GetMethodsForServiceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMethodsForServiceVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetMethodsForService` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMethodsForServiceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMethodsForServiceData {
  serviceMethods: ({
    id: string;
    method: {
      id: string;
      name: string;
      description?: string | null;
      price: number;
    } & Method_Key;
      createdAt: TimestampString;
  } & ServiceMethod_Key)[];
}
```
### Using `GetMethodsForService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMethodsForService, GetMethodsForServiceVariables } from '@firebasegen/adnlab-connector';

// The `GetMethodsForService` query requires an argument of type `GetMethodsForServiceVariables`:
const getMethodsForServiceVars: GetMethodsForServiceVariables = {
  serviceId: ..., 
};

// Call the `getMethodsForService()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMethodsForService(getMethodsForServiceVars);
// Variables can be defined inline as well.
const { data } = await getMethodsForService({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMethodsForService(dataConnect, getMethodsForServiceVars);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
getMethodsForService(getMethodsForServiceVars).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

### Using `GetMethodsForService`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMethodsForServiceRef, GetMethodsForServiceVariables } from '@firebasegen/adnlab-connector';

// The `GetMethodsForService` query requires an argument of type `GetMethodsForServiceVariables`:
const getMethodsForServiceVars: GetMethodsForServiceVariables = {
  serviceId: ..., 
};

// Call the `getMethodsForServiceRef()` function to get a reference to the query.
const ref = getMethodsForServiceRef(getMethodsForServiceVars);
// Variables can be defined inline as well.
const ref = getMethodsForServiceRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMethodsForServiceRef(dataConnect, getMethodsForServiceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

## GetServicesForMethod
You can execute the `GetServicesForMethod` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServicesForMethod(vars: GetServicesForMethodVariables): QueryPromise<GetServicesForMethodData, GetServicesForMethodVariables>;

interface GetServicesForMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServicesForMethodVariables): QueryRef<GetServicesForMethodData, GetServicesForMethodVariables>;
}
export const getServicesForMethodRef: GetServicesForMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServicesForMethod(dc: DataConnect, vars: GetServicesForMethodVariables): QueryPromise<GetServicesForMethodData, GetServicesForMethodVariables>;

interface GetServicesForMethodRef {
  ...
  (dc: DataConnect, vars: GetServicesForMethodVariables): QueryRef<GetServicesForMethodData, GetServicesForMethodVariables>;
}
export const getServicesForMethodRef: GetServicesForMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServicesForMethodRef:
```typescript
const name = getServicesForMethodRef.operationName;
console.log(name);
```

### Variables
The `GetServicesForMethod` query requires an argument of type `GetServicesForMethodVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServicesForMethodVariables {
  methodId: string;
}
```
### Return Type
Recall that executing the `GetServicesForMethod` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServicesForMethodData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServicesForMethodData {
  serviceMethods: ({
    id: string;
    service: {
      id: string;
      title: string;
      description: string;
      price: number;
      duration: string;
      category: {
        name: string;
        hasLegalValue: boolean;
      };
        icon?: string | null;
        featured: boolean;
    } & Service_Key;
      createdAt: TimestampString;
  } & ServiceMethod_Key)[];
}
```
### Using `GetServicesForMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServicesForMethod, GetServicesForMethodVariables } from '@firebasegen/adnlab-connector';

// The `GetServicesForMethod` query requires an argument of type `GetServicesForMethodVariables`:
const getServicesForMethodVars: GetServicesForMethodVariables = {
  methodId: ..., 
};

// Call the `getServicesForMethod()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServicesForMethod(getServicesForMethodVars);
// Variables can be defined inline as well.
const { data } = await getServicesForMethod({ methodId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServicesForMethod(dataConnect, getServicesForMethodVars);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
getServicesForMethod(getServicesForMethodVars).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

### Using `GetServicesForMethod`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServicesForMethodRef, GetServicesForMethodVariables } from '@firebasegen/adnlab-connector';

// The `GetServicesForMethod` query requires an argument of type `GetServicesForMethodVariables`:
const getServicesForMethodVars: GetServicesForMethodVariables = {
  methodId: ..., 
};

// Call the `getServicesForMethodRef()` function to get a reference to the query.
const ref = getServicesForMethodRef(getServicesForMethodVars);
// Variables can be defined inline as well.
const ref = getServicesForMethodRef({ methodId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServicesForMethodRef(dataConnect, getServicesForMethodVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceMethods);
});
```

## GetServiceWithMethods
You can execute the `GetServiceWithMethods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServiceWithMethods(vars: GetServiceWithMethodsVariables): QueryPromise<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;

interface GetServiceWithMethodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceWithMethodsVariables): QueryRef<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;
}
export const getServiceWithMethodsRef: GetServiceWithMethodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceWithMethods(dc: DataConnect, vars: GetServiceWithMethodsVariables): QueryPromise<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;

interface GetServiceWithMethodsRef {
  ...
  (dc: DataConnect, vars: GetServiceWithMethodsVariables): QueryRef<GetServiceWithMethodsData, GetServiceWithMethodsVariables>;
}
export const getServiceWithMethodsRef: GetServiceWithMethodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceWithMethodsRef:
```typescript
const name = getServiceWithMethodsRef.operationName;
console.log(name);
```

### Variables
The `GetServiceWithMethods` query requires an argument of type `GetServiceWithMethodsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceWithMethodsVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetServiceWithMethods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceWithMethodsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceWithMethodsData {
  service?: {
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    price: number;
    duration: string;
    category: {
      id: string;
      name: string;
      description?: string | null;
      hasLegalValue: boolean;
      icon?: string | null;
      color?: string | null;
    } & ServiceCategory_Key;
      icon?: string | null;
      featured: boolean;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & Service_Key;
    serviceMethods: ({
      id: string;
      method: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
      } & Method_Key;
        createdAt: TimestampString;
    } & ServiceMethod_Key)[];
}
```
### Using `GetServiceWithMethods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceWithMethods, GetServiceWithMethodsVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceWithMethods` query requires an argument of type `GetServiceWithMethodsVariables`:
const getServiceWithMethodsVars: GetServiceWithMethodsVariables = {
  serviceId: ..., 
};

// Call the `getServiceWithMethods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceWithMethods(getServiceWithMethodsVars);
// Variables can be defined inline as well.
const { data } = await getServiceWithMethods({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceWithMethods(dataConnect, getServiceWithMethodsVars);

console.log(data.service);
console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
getServiceWithMethods(getServiceWithMethodsVars).then((response) => {
  const data = response.data;
  console.log(data.service);
  console.log(data.serviceMethods);
});
```

### Using `GetServiceWithMethods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceWithMethodsRef, GetServiceWithMethodsVariables } from '@firebasegen/adnlab-connector';

// The `GetServiceWithMethods` query requires an argument of type `GetServiceWithMethodsVariables`:
const getServiceWithMethodsVars: GetServiceWithMethodsVariables = {
  serviceId: ..., 
};

// Call the `getServiceWithMethodsRef()` function to get a reference to the query.
const ref = getServiceWithMethodsRef(getServiceWithMethodsVars);
// Variables can be defined inline as well.
const ref = getServiceWithMethodsRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceWithMethodsRef(dataConnect, getServiceWithMethodsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.service);
console.log(data.serviceMethods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.service);
  console.log(data.serviceMethods);
});
```

## GetTimeSlots
You can execute the `GetTimeSlots` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getTimeSlots(vars: GetTimeSlotsVariables): QueryPromise<GetTimeSlotsData, GetTimeSlotsVariables>;

interface GetTimeSlotsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeSlotsVariables): QueryRef<GetTimeSlotsData, GetTimeSlotsVariables>;
}
export const getTimeSlotsRef: GetTimeSlotsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTimeSlots(dc: DataConnect, vars: GetTimeSlotsVariables): QueryPromise<GetTimeSlotsData, GetTimeSlotsVariables>;

interface GetTimeSlotsRef {
  ...
  (dc: DataConnect, vars: GetTimeSlotsVariables): QueryRef<GetTimeSlotsData, GetTimeSlotsVariables>;
}
export const getTimeSlotsRef: GetTimeSlotsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTimeSlotsRef:
```typescript
const name = getTimeSlotsRef.operationName;
console.log(name);
```

### Variables
The `GetTimeSlots` query requires an argument of type `GetTimeSlotsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTimeSlotsVariables {
  slotDate: DateString;
}
```
### Return Type
Recall that executing the `GetTimeSlots` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTimeSlotsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTimeSlotsData {
  timeSlots: ({
    id: string;
    slotDate: DateString;
    startTime: string;
    endTime: string;
    currentBookings: number;
    notes?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & TimeSlot_Key)[];
}
```
### Using `GetTimeSlots`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTimeSlots, GetTimeSlotsVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlots` query requires an argument of type `GetTimeSlotsVariables`:
const getTimeSlotsVars: GetTimeSlotsVariables = {
  slotDate: ..., 
};

// Call the `getTimeSlots()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTimeSlots(getTimeSlotsVars);
// Variables can be defined inline as well.
const { data } = await getTimeSlots({ slotDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTimeSlots(dataConnect, getTimeSlotsVars);

console.log(data.timeSlots);

// Or, you can use the `Promise` API.
getTimeSlots(getTimeSlotsVars).then((response) => {
  const data = response.data;
  console.log(data.timeSlots);
});
```

### Using `GetTimeSlots`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTimeSlotsRef, GetTimeSlotsVariables } from '@firebasegen/adnlab-connector';

// The `GetTimeSlots` query requires an argument of type `GetTimeSlotsVariables`:
const getTimeSlotsVars: GetTimeSlotsVariables = {
  slotDate: ..., 
};

// Call the `getTimeSlotsRef()` function to get a reference to the query.
const ref = getTimeSlotsRef(getTimeSlotsVars);
// Variables can be defined inline as well.
const ref = getTimeSlotsRef({ slotDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTimeSlotsRef(dataConnect, getTimeSlotsVars);

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
    currentBookings: number;
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
    currentBookings: number;
    notes?: string | null;
    createdAt: TimestampString;
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
    totalAmount: number;
    serviceMethod: {
      id: string;
      service: {
        id: string;
        title: string;
        description: string;
        category: {
          name: string;
        };
      } & Service_Key;
        method: {
          id: string;
          name: string;
          description?: string | null;
          price: number;
        } & Method_Key;
    } & ServiceMethod_Key;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
        endTime: string;
      };
        staff?: {
          fullname: string;
        };
          bookingCreatedAt: TimestampString;
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
    totalAmount: number;
    serviceMethod: {
      id: string;
      service: {
        id: string;
        title: string;
        description: string;
        duration: string;
        category: {
          name: string;
        };
      } & Service_Key;
        method: {
          id: string;
          name: string;
          description?: string | null;
          price: number;
        } & Method_Key;
    } & ServiceMethod_Key;
      timeSlot?: {
        slotDate: DateString;
        startTime: string;
        endTime: string;
      };
        staff?: {
          fullname: string;
        };
          bookingCreatedAt: TimestampString;
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
        serviceMethod: {
          id: string;
          service: {
            id: string;
            title: string;
            description: string;
            fullDescription?: string | null;
            price: number;
            duration: string;
            category: {
              id: string;
              name: string;
              description?: string | null;
              hasLegalValue: boolean;
            } & ServiceCategory_Key;
          } & Service_Key;
            method: {
              id: string;
              name: string;
              description?: string | null;
              price: number;
            } & Method_Key;
        } & ServiceMethod_Key;
          timeSlot?: {
            slotDate: DateString;
            startTime: string;
            endTime: string;
          };
            totalAmount: number;
            bookingCreatedAt: TimestampString;
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

## GetBookingHistory
You can execute the `GetBookingHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBookingHistory(vars: GetBookingHistoryVariables): QueryPromise<GetBookingHistoryData, GetBookingHistoryVariables>;

interface GetBookingHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingHistoryVariables): QueryRef<GetBookingHistoryData, GetBookingHistoryVariables>;
}
export const getBookingHistoryRef: GetBookingHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingHistory(dc: DataConnect, vars: GetBookingHistoryVariables): QueryPromise<GetBookingHistoryData, GetBookingHistoryVariables>;

interface GetBookingHistoryRef {
  ...
  (dc: DataConnect, vars: GetBookingHistoryVariables): QueryRef<GetBookingHistoryData, GetBookingHistoryVariables>;
}
export const getBookingHistoryRef: GetBookingHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingHistoryRef:
```typescript
const name = getBookingHistoryRef.operationName;
console.log(name);
```

### Variables
The `GetBookingHistory` query requires an argument of type `GetBookingHistoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingHistoryVariables {
  bookingId: string;
}
```
### Return Type
Recall that executing the `GetBookingHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingHistoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingHistoryData {
  bookingHistories: ({
    id: string;
    description: string;
    status: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & BookingHistory_Key)[];
}
```
### Using `GetBookingHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingHistory, GetBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingHistory` query requires an argument of type `GetBookingHistoryVariables`:
const getBookingHistoryVars: GetBookingHistoryVariables = {
  bookingId: ..., 
};

// Call the `getBookingHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingHistory(getBookingHistoryVars);
// Variables can be defined inline as well.
const { data } = await getBookingHistory({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingHistory(dataConnect, getBookingHistoryVars);

console.log(data.bookingHistories);

// Or, you can use the `Promise` API.
getBookingHistory(getBookingHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.bookingHistories);
});
```

### Using `GetBookingHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingHistoryRef, GetBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `GetBookingHistory` query requires an argument of type `GetBookingHistoryVariables`:
const getBookingHistoryVars: GetBookingHistoryVariables = {
  bookingId: ..., 
};

// Call the `getBookingHistoryRef()` function to get a reference to the query.
const ref = getBookingHistoryRef(getBookingHistoryVars);
// Variables can be defined inline as well.
const ref = getBookingHistoryRef({ bookingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingHistoryRef(dataConnect, getBookingHistoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookingHistories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingHistories);
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
      totalAmount: number;
      serviceMethod: {
        service: {
          id: string;
          title: string;
          category: {
            name: string;
          };
        } & Service_Key;
          method: {
            name: string;
            price: number;
          };
      };
        timeSlot?: {
          slotDate: DateString;
          startTime: string;
          endTime: string;
        };
          bookingCreatedAt: TimestampString;
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
    booking: {
      serviceMethod: {
        service: {
          title: string;
          category: {
            name: string;
          };
        };
      };
    };
      staff?: {
        fullname: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
        createdAt: TimestampString;
        updatedAt?: TimestampString | null;
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
        serviceMethod: {
          service: {
            title: string;
            category: {
              name: string;
            };
          };
        };
    } & Booking_Key;
      staff?: {
        fullname: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
        createdAt: TimestampString;
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
        serviceMethod: {
          service: {
            title: string;
            description: string;
            category: {
              name: string;
            };
          };
            method: {
              name: string;
            };
        };
    } & Booking_Key;
      staff?: {
        fullname: string;
      };
        collectionDate?: DateString | null;
        status: string;
        notes?: string | null;
        createdAt: TimestampString;
        updatedAt?: TimestampString | null;
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
        serviceMethod: {
          service: {
            title: string;
            category: {
              name: string;
            };
          };
        };
    };
      collectionDate?: DateString | null;
      status: string;
      notes?: string | null;
      createdAt: TimestampString;
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
      booking: {
        serviceMethod: {
          service: {
            title: string;
          };
        };
      };
        staff?: {
          fullname: string;
        };
          testDate?: DateString | null;
          reportDate?: DateString | null;
          status: string;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
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
        serviceMethod: {
          service: {
            title: string;
            description: string;
          };
            method: {
              name: string;
            };
        };
    } & Booking_Key;
      sample: {
        id: string;
        collectionDate?: DateString | null;
      } & Sample_Key;
        staff?: {
          fullname: string;
        };
          testDate?: DateString | null;
          reportDate?: DateString | null;
          resultData?: string | null;
          status: string;
          createdAt: TimestampString;
          updatedAt?: TimestampString | null;
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
        serviceMethod: {
          service: {
            title: string;
          };
        };
    };
      staff?: {
        fullname: string;
      };
        testDate?: DateString | null;
        status: string;
        createdAt: TimestampString;
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
    booking: {
      serviceMethod: {
        service: {
          title: string;
        };
      };
    };
      testDate?: DateString | null;
      reportDate?: DateString | null;
      status: string;
      createdAt: TimestampString;
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
    status: string;
    paymentDate?: DateString | null;
    refundDetail?: string[] | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
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
      status: string;
      paymentDate?: DateString | null;
      refundDetail?: string[] | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
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
      paymentDate?: DateString | null;
      createdAt: TimestampString;
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
    createdAt: TimestampString;
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

## GetBlogs
You can execute the `GetBlogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBlogs(vars?: GetBlogsVariables): QueryPromise<GetBlogsData, GetBlogsVariables>;

interface GetBlogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetBlogsVariables): QueryRef<GetBlogsData, GetBlogsVariables>;
}
export const getBlogsRef: GetBlogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBlogs(dc: DataConnect, vars?: GetBlogsVariables): QueryPromise<GetBlogsData, GetBlogsVariables>;

interface GetBlogsRef {
  ...
  (dc: DataConnect, vars?: GetBlogsVariables): QueryRef<GetBlogsData, GetBlogsVariables>;
}
export const getBlogsRef: GetBlogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBlogsRef:
```typescript
const name = getBlogsRef.operationName;
console.log(name);
```

### Variables
The `GetBlogs` query has an optional argument of type `GetBlogsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBlogsVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `GetBlogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBlogsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBlogsData {
  blogs: ({
    id: string;
    user: {
      id: string;
      fullname: string;
      avatar?: string | null;
    } & User_Key;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
  } & Blog_Key)[];
}
```
### Using `GetBlogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBlogs, GetBlogsVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogs` query has an optional argument of type `GetBlogsVariables`:
const getBlogsVars: GetBlogsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getBlogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBlogs(getBlogsVars);
// Variables can be defined inline as well.
const { data } = await getBlogs({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetBlogsVariables` argument.
const { data } = await getBlogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBlogs(dataConnect, getBlogsVars);

console.log(data.blogs);

// Or, you can use the `Promise` API.
getBlogs(getBlogsVars).then((response) => {
  const data = response.data;
  console.log(data.blogs);
});
```

### Using `GetBlogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBlogsRef, GetBlogsVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogs` query has an optional argument of type `GetBlogsVariables`:
const getBlogsVars: GetBlogsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `getBlogsRef()` function to get a reference to the query.
const ref = getBlogsRef(getBlogsVars);
// Variables can be defined inline as well.
const ref = getBlogsRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `GetBlogsVariables` argument.
const ref = getBlogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBlogsRef(dataConnect, getBlogsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogs);
});
```

## GetBlogById
You can execute the `GetBlogById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBlogById(vars: GetBlogByIdVariables): QueryPromise<GetBlogByIdData, GetBlogByIdVariables>;

interface GetBlogByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogByIdVariables): QueryRef<GetBlogByIdData, GetBlogByIdVariables>;
}
export const getBlogByIdRef: GetBlogByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBlogById(dc: DataConnect, vars: GetBlogByIdVariables): QueryPromise<GetBlogByIdData, GetBlogByIdVariables>;

interface GetBlogByIdRef {
  ...
  (dc: DataConnect, vars: GetBlogByIdVariables): QueryRef<GetBlogByIdData, GetBlogByIdVariables>;
}
export const getBlogByIdRef: GetBlogByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBlogByIdRef:
```typescript
const name = getBlogByIdRef.operationName;
console.log(name);
```

### Variables
The `GetBlogById` query requires an argument of type `GetBlogByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBlogByIdVariables {
  blogId: string;
}
```
### Return Type
Recall that executing the `GetBlogById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBlogByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBlogByIdData {
  blog?: {
    id: string;
    user: {
      id: string;
      fullname: string;
      avatar?: string | null;
      role: {
        name: string;
      };
    } & User_Key;
      content: string;
      imageUrl?: string | null;
      createdAt: TimestampString;
  } & Blog_Key;
}
```
### Using `GetBlogById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBlogById, GetBlogByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogById` query requires an argument of type `GetBlogByIdVariables`:
const getBlogByIdVars: GetBlogByIdVariables = {
  blogId: ..., 
};

// Call the `getBlogById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBlogById(getBlogByIdVars);
// Variables can be defined inline as well.
const { data } = await getBlogById({ blogId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBlogById(dataConnect, getBlogByIdVars);

console.log(data.blog);

// Or, you can use the `Promise` API.
getBlogById(getBlogByIdVars).then((response) => {
  const data = response.data;
  console.log(data.blog);
});
```

### Using `GetBlogById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBlogByIdRef, GetBlogByIdVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogById` query requires an argument of type `GetBlogByIdVariables`:
const getBlogByIdVars: GetBlogByIdVariables = {
  blogId: ..., 
};

// Call the `getBlogByIdRef()` function to get a reference to the query.
const ref = getBlogByIdRef(getBlogByIdVars);
// Variables can be defined inline as well.
const ref = getBlogByIdRef({ blogId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBlogByIdRef(dataConnect, getBlogByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blog);
});
```

## GetBlogsByUser
You can execute the `GetBlogsByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBlogsByUser(vars: GetBlogsByUserVariables): QueryPromise<GetBlogsByUserData, GetBlogsByUserVariables>;

interface GetBlogsByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogsByUserVariables): QueryRef<GetBlogsByUserData, GetBlogsByUserVariables>;
}
export const getBlogsByUserRef: GetBlogsByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBlogsByUser(dc: DataConnect, vars: GetBlogsByUserVariables): QueryPromise<GetBlogsByUserData, GetBlogsByUserVariables>;

interface GetBlogsByUserRef {
  ...
  (dc: DataConnect, vars: GetBlogsByUserVariables): QueryRef<GetBlogsByUserData, GetBlogsByUserVariables>;
}
export const getBlogsByUserRef: GetBlogsByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBlogsByUserRef:
```typescript
const name = getBlogsByUserRef.operationName;
console.log(name);
```

### Variables
The `GetBlogsByUser` query requires an argument of type `GetBlogsByUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBlogsByUserVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetBlogsByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBlogsByUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBlogsByUserData {
  blogs: ({
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Blog_Key)[];
}
```
### Using `GetBlogsByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBlogsByUser, GetBlogsByUserVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogsByUser` query requires an argument of type `GetBlogsByUserVariables`:
const getBlogsByUserVars: GetBlogsByUserVariables = {
  userId: ..., 
};

// Call the `getBlogsByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBlogsByUser(getBlogsByUserVars);
// Variables can be defined inline as well.
const { data } = await getBlogsByUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBlogsByUser(dataConnect, getBlogsByUserVars);

console.log(data.blogs);

// Or, you can use the `Promise` API.
getBlogsByUser(getBlogsByUserVars).then((response) => {
  const data = response.data;
  console.log(data.blogs);
});
```

### Using `GetBlogsByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBlogsByUserRef, GetBlogsByUserVariables } from '@firebasegen/adnlab-connector';

// The `GetBlogsByUser` query requires an argument of type `GetBlogsByUserVariables`:
const getBlogsByUserVars: GetBlogsByUserVariables = {
  userId: ..., 
};

// Call the `getBlogsByUserRef()` function to get a reference to the query.
const ref = getBlogsByUserRef(getBlogsByUserVars);
// Variables can be defined inline as well.
const ref = getBlogsByUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBlogsByUserRef(dataConnect, getBlogsByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogs);
});
```

## GetMyBlogs
You can execute the `GetMyBlogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyBlogs(): QueryPromise<GetMyBlogsData, undefined>;

interface GetMyBlogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBlogsData, undefined>;
}
export const getMyBlogsRef: GetMyBlogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyBlogs(dc: DataConnect): QueryPromise<GetMyBlogsData, undefined>;

interface GetMyBlogsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyBlogsData, undefined>;
}
export const getMyBlogsRef: GetMyBlogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyBlogsRef:
```typescript
const name = getMyBlogsRef.operationName;
console.log(name);
```

### Variables
The `GetMyBlogs` query has no variables.
### Return Type
Recall that executing the `GetMyBlogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyBlogsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyBlogsData {
  blogs: ({
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Blog_Key)[];
}
```
### Using `GetMyBlogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyBlogs } from '@firebasegen/adnlab-connector';


// Call the `getMyBlogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyBlogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyBlogs(dataConnect);

console.log(data.blogs);

// Or, you can use the `Promise` API.
getMyBlogs().then((response) => {
  const data = response.data;
  console.log(data.blogs);
});
```

### Using `GetMyBlogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyBlogsRef } from '@firebasegen/adnlab-connector';


// Call the `getMyBlogsRef()` function to get a reference to the query.
const ref = getMyBlogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyBlogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogs);
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
  bookings: ({
    serviceMethod: {
      service: {
        id: string;
        title: string;
      } & Service_Key;
    };
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

console.log(data.bookings);

// Or, you can use the `Promise` API.
getServicePopularity().then((response) => {
  const data = response.data;
  console.log(data.bookings);
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

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
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
  startDate: ..., 
  endDate: ..., 
};

// Call the `getMonthlyRevenue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMonthlyRevenue(getMonthlyRevenueVars);
// Variables can be defined inline as well.
const { data } = await getMonthlyRevenue({ startDate: ..., endDate: ..., });

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
  startDate: ..., 
  endDate: ..., 
};

// Call the `getMonthlyRevenueRef()` function to get a reference to the query.
const ref = getMonthlyRevenueRef(getMonthlyRevenueVars);
// Variables can be defined inline as well.
const ref = getMonthlyRevenueRef({ startDate: ..., endDate: ..., });

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

## CreateServiceCategory
You can execute the `CreateServiceCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createServiceCategory(vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;

interface CreateServiceCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
}
export const createServiceCategoryRef: CreateServiceCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceCategory(dc: DataConnect, vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;

interface CreateServiceCategoryRef {
  ...
  (dc: DataConnect, vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
}
export const createServiceCategoryRef: CreateServiceCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceCategoryRef:
```typescript
const name = createServiceCategoryRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceCategory` mutation requires an argument of type `CreateServiceCategoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceCategoryVariables {
  id: string;
  name: string;
  description?: string | null;
  hasLegalValue: boolean;
  icon?: string | null;
  color?: string | null;
}
```
### Return Type
Recall that executing the `CreateServiceCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceCategoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceCategoryData {
  serviceCategory_insert: ServiceCategory_Key;
}
```
### Using `CreateServiceCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceCategory, CreateServiceCategoryVariables } from '@firebasegen/adnlab-connector';

// The `CreateServiceCategory` mutation requires an argument of type `CreateServiceCategoryVariables`:
const createServiceCategoryVars: CreateServiceCategoryVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  hasLegalValue: ..., 
  icon: ..., // optional
  color: ..., // optional
};

// Call the `createServiceCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceCategory(createServiceCategoryVars);
// Variables can be defined inline as well.
const { data } = await createServiceCategory({ id: ..., name: ..., description: ..., hasLegalValue: ..., icon: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceCategory(dataConnect, createServiceCategoryVars);

console.log(data.serviceCategory_insert);

// Or, you can use the `Promise` API.
createServiceCategory(createServiceCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory_insert);
});
```

### Using `CreateServiceCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceCategoryRef, CreateServiceCategoryVariables } from '@firebasegen/adnlab-connector';

// The `CreateServiceCategory` mutation requires an argument of type `CreateServiceCategoryVariables`:
const createServiceCategoryVars: CreateServiceCategoryVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  hasLegalValue: ..., 
  icon: ..., // optional
  color: ..., // optional
};

// Call the `createServiceCategoryRef()` function to get a reference to the mutation.
const ref = createServiceCategoryRef(createServiceCategoryVars);
// Variables can be defined inline as well.
const ref = createServiceCategoryRef({ id: ..., name: ..., description: ..., hasLegalValue: ..., icon: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceCategoryRef(dataConnect, createServiceCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceCategory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory_insert);
});
```

## UpdateServiceCategory
You can execute the `UpdateServiceCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateServiceCategory(vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;

interface UpdateServiceCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
}
export const updateServiceCategoryRef: UpdateServiceCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateServiceCategory(dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;

interface UpdateServiceCategoryRef {
  ...
  (dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
}
export const updateServiceCategoryRef: UpdateServiceCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceCategoryRef:
```typescript
const name = updateServiceCategoryRef.operationName;
console.log(name);
```

### Variables
The `UpdateServiceCategory` mutation requires an argument of type `UpdateServiceCategoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceCategoryVariables {
  categoryId: string;
  name?: string | null;
  description?: string | null;
  hasLegalValue?: boolean | null;
  icon?: string | null;
  color?: string | null;
}
```
### Return Type
Recall that executing the `UpdateServiceCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceCategoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceCategoryData {
  serviceCategory_update?: ServiceCategory_Key | null;
}
```
### Using `UpdateServiceCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateServiceCategory, UpdateServiceCategoryVariables } from '@firebasegen/adnlab-connector';

// The `UpdateServiceCategory` mutation requires an argument of type `UpdateServiceCategoryVariables`:
const updateServiceCategoryVars: UpdateServiceCategoryVariables = {
  categoryId: ..., 
  name: ..., // optional
  description: ..., // optional
  hasLegalValue: ..., // optional
  icon: ..., // optional
  color: ..., // optional
};

// Call the `updateServiceCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateServiceCategory(updateServiceCategoryVars);
// Variables can be defined inline as well.
const { data } = await updateServiceCategory({ categoryId: ..., name: ..., description: ..., hasLegalValue: ..., icon: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateServiceCategory(dataConnect, updateServiceCategoryVars);

console.log(data.serviceCategory_update);

// Or, you can use the `Promise` API.
updateServiceCategory(updateServiceCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory_update);
});
```

### Using `UpdateServiceCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceCategoryRef, UpdateServiceCategoryVariables } from '@firebasegen/adnlab-connector';

// The `UpdateServiceCategory` mutation requires an argument of type `UpdateServiceCategoryVariables`:
const updateServiceCategoryVars: UpdateServiceCategoryVariables = {
  categoryId: ..., 
  name: ..., // optional
  description: ..., // optional
  hasLegalValue: ..., // optional
  icon: ..., // optional
  color: ..., // optional
};

// Call the `updateServiceCategoryRef()` function to get a reference to the mutation.
const ref = updateServiceCategoryRef(updateServiceCategoryVars);
// Variables can be defined inline as well.
const ref = updateServiceCategoryRef({ categoryId: ..., name: ..., description: ..., hasLegalValue: ..., icon: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceCategoryRef(dataConnect, updateServiceCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceCategory_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCategory_update);
});
```

## CreateMethod
You can execute the `CreateMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createMethod(vars: CreateMethodVariables): MutationPromise<CreateMethodData, CreateMethodVariables>;

interface CreateMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMethodVariables): MutationRef<CreateMethodData, CreateMethodVariables>;
}
export const createMethodRef: CreateMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMethod(dc: DataConnect, vars: CreateMethodVariables): MutationPromise<CreateMethodData, CreateMethodVariables>;

interface CreateMethodRef {
  ...
  (dc: DataConnect, vars: CreateMethodVariables): MutationRef<CreateMethodData, CreateMethodVariables>;
}
export const createMethodRef: CreateMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMethodRef:
```typescript
const name = createMethodRef.operationName;
console.log(name);
```

### Variables
The `CreateMethod` mutation requires an argument of type `CreateMethodVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMethodVariables {
  id: string;
  name: string;
  description?: string | null;
  price: number;
}
```
### Return Type
Recall that executing the `CreateMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMethodData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMethodData {
  method_insert: Method_Key;
}
```
### Using `CreateMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMethod, CreateMethodVariables } from '@firebasegen/adnlab-connector';

// The `CreateMethod` mutation requires an argument of type `CreateMethodVariables`:
const createMethodVars: CreateMethodVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
};

// Call the `createMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMethod(createMethodVars);
// Variables can be defined inline as well.
const { data } = await createMethod({ id: ..., name: ..., description: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMethod(dataConnect, createMethodVars);

console.log(data.method_insert);

// Or, you can use the `Promise` API.
createMethod(createMethodVars).then((response) => {
  const data = response.data;
  console.log(data.method_insert);
});
```

### Using `CreateMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMethodRef, CreateMethodVariables } from '@firebasegen/adnlab-connector';

// The `CreateMethod` mutation requires an argument of type `CreateMethodVariables`:
const createMethodVars: CreateMethodVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
};

// Call the `createMethodRef()` function to get a reference to the mutation.
const ref = createMethodRef(createMethodVars);
// Variables can be defined inline as well.
const ref = createMethodRef({ id: ..., name: ..., description: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMethodRef(dataConnect, createMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.method_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.method_insert);
});
```

## UpdateMethod
You can execute the `UpdateMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateMethod(vars: UpdateMethodVariables): MutationPromise<UpdateMethodData, UpdateMethodVariables>;

interface UpdateMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMethodVariables): MutationRef<UpdateMethodData, UpdateMethodVariables>;
}
export const updateMethodRef: UpdateMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMethod(dc: DataConnect, vars: UpdateMethodVariables): MutationPromise<UpdateMethodData, UpdateMethodVariables>;

interface UpdateMethodRef {
  ...
  (dc: DataConnect, vars: UpdateMethodVariables): MutationRef<UpdateMethodData, UpdateMethodVariables>;
}
export const updateMethodRef: UpdateMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMethodRef:
```typescript
const name = updateMethodRef.operationName;
console.log(name);
```

### Variables
The `UpdateMethod` mutation requires an argument of type `UpdateMethodVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMethodVariables {
  methodId: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
}
```
### Return Type
Recall that executing the `UpdateMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMethodData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMethodData {
  method_update?: Method_Key | null;
}
```
### Using `UpdateMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMethod, UpdateMethodVariables } from '@firebasegen/adnlab-connector';

// The `UpdateMethod` mutation requires an argument of type `UpdateMethodVariables`:
const updateMethodVars: UpdateMethodVariables = {
  methodId: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
};

// Call the `updateMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMethod(updateMethodVars);
// Variables can be defined inline as well.
const { data } = await updateMethod({ methodId: ..., name: ..., description: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMethod(dataConnect, updateMethodVars);

console.log(data.method_update);

// Or, you can use the `Promise` API.
updateMethod(updateMethodVars).then((response) => {
  const data = response.data;
  console.log(data.method_update);
});
```

### Using `UpdateMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMethodRef, UpdateMethodVariables } from '@firebasegen/adnlab-connector';

// The `UpdateMethod` mutation requires an argument of type `UpdateMethodVariables`:
const updateMethodVars: UpdateMethodVariables = {
  methodId: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
};

// Call the `updateMethodRef()` function to get a reference to the mutation.
const ref = updateMethodRef(updateMethodVars);
// Variables can be defined inline as well.
const ref = updateMethodRef({ methodId: ..., name: ..., description: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMethodRef(dataConnect, updateMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.method_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.method_update);
});
```

## CreateService
You can execute the `CreateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRef:
```typescript
const name = createServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateService` mutation requires an argument of type `CreateServiceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceVariables {
  id: string;
  title: string;
  description: string;
  fullDescription?: string | null;
  price: number;
  duration: string;
  categoryId: string;
  icon?: string | null;
  featured: boolean;
}
```
### Return Type
Recall that executing the `CreateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceData {
  service_insert: Service_Key;
}
```
### Using `CreateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createService, CreateServiceVariables } from '@firebasegen/adnlab-connector';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  id: ..., 
  title: ..., 
  description: ..., 
  fullDescription: ..., // optional
  price: ..., 
  duration: ..., 
  categoryId: ..., 
  icon: ..., // optional
  featured: ..., 
};

// Call the `createService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createService(createServiceVars);
// Variables can be defined inline as well.
const { data } = await createService({ id: ..., title: ..., description: ..., fullDescription: ..., price: ..., duration: ..., categoryId: ..., icon: ..., featured: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createService(dataConnect, createServiceVars);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
createService(createServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

### Using `CreateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRef, CreateServiceVariables } from '@firebasegen/adnlab-connector';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  id: ..., 
  title: ..., 
  description: ..., 
  fullDescription: ..., // optional
  price: ..., 
  duration: ..., 
  categoryId: ..., 
  icon: ..., // optional
  featured: ..., 
};

// Call the `createServiceRef()` function to get a reference to the mutation.
const ref = createServiceRef(createServiceVars);
// Variables can be defined inline as well.
const ref = createServiceRef({ id: ..., title: ..., description: ..., fullDescription: ..., price: ..., duration: ..., categoryId: ..., icon: ..., featured: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRef(dataConnect, createServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

## UpdateService
You can execute the `UpdateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceRef:
```typescript
const name = updateServiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceVariables {
  serviceId: string;
  title?: string | null;
  description?: string | null;
  fullDescription?: string | null;
  price?: number | null;
  duration?: string | null;
  categoryId?: string | null;
  icon?: string | null;
  featured?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceData {
  service_update?: Service_Key | null;
}
```
### Using `UpdateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateService, UpdateServiceVariables } from '@firebasegen/adnlab-connector';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  serviceId: ..., 
  title: ..., // optional
  description: ..., // optional
  fullDescription: ..., // optional
  price: ..., // optional
  duration: ..., // optional
  categoryId: ..., // optional
  icon: ..., // optional
  featured: ..., // optional
};

// Call the `updateService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateService(updateServiceVars);
// Variables can be defined inline as well.
const { data } = await updateService({ serviceId: ..., title: ..., description: ..., fullDescription: ..., price: ..., duration: ..., categoryId: ..., icon: ..., featured: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateService(dataConnect, updateServiceVars);

console.log(data.service_update);

// Or, you can use the `Promise` API.
updateService(updateServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

### Using `UpdateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceRef, UpdateServiceVariables } from '@firebasegen/adnlab-connector';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  serviceId: ..., 
  title: ..., // optional
  description: ..., // optional
  fullDescription: ..., // optional
  price: ..., // optional
  duration: ..., // optional
  categoryId: ..., // optional
  icon: ..., // optional
  featured: ..., // optional
};

// Call the `updateServiceRef()` function to get a reference to the mutation.
const ref = updateServiceRef(updateServiceVars);
// Variables can be defined inline as well.
const ref = updateServiceRef({ serviceId: ..., title: ..., description: ..., fullDescription: ..., price: ..., duration: ..., categoryId: ..., icon: ..., featured: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceRef(dataConnect, updateServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

## CreateServiceMethod
You can execute the `CreateServiceMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createServiceMethod(vars: CreateServiceMethodVariables): MutationPromise<CreateServiceMethodData, CreateServiceMethodVariables>;

interface CreateServiceMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceMethodVariables): MutationRef<CreateServiceMethodData, CreateServiceMethodVariables>;
}
export const createServiceMethodRef: CreateServiceMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceMethod(dc: DataConnect, vars: CreateServiceMethodVariables): MutationPromise<CreateServiceMethodData, CreateServiceMethodVariables>;

interface CreateServiceMethodRef {
  ...
  (dc: DataConnect, vars: CreateServiceMethodVariables): MutationRef<CreateServiceMethodData, CreateServiceMethodVariables>;
}
export const createServiceMethodRef: CreateServiceMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceMethodRef:
```typescript
const name = createServiceMethodRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceMethod` mutation requires an argument of type `CreateServiceMethodVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceMethodVariables {
  id: string;
  serviceId: string;
  methodId: string;
}
```
### Return Type
Recall that executing the `CreateServiceMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceMethodData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceMethodData {
  serviceMethod_insert: ServiceMethod_Key;
}
```
### Using `CreateServiceMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceMethod, CreateServiceMethodVariables } from '@firebasegen/adnlab-connector';

// The `CreateServiceMethod` mutation requires an argument of type `CreateServiceMethodVariables`:
const createServiceMethodVars: CreateServiceMethodVariables = {
  id: ..., 
  serviceId: ..., 
  methodId: ..., 
};

// Call the `createServiceMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceMethod(createServiceMethodVars);
// Variables can be defined inline as well.
const { data } = await createServiceMethod({ id: ..., serviceId: ..., methodId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceMethod(dataConnect, createServiceMethodVars);

console.log(data.serviceMethod_insert);

// Or, you can use the `Promise` API.
createServiceMethod(createServiceMethodVars).then((response) => {
  const data = response.data;
  console.log(data.serviceMethod_insert);
});
```

### Using `CreateServiceMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceMethodRef, CreateServiceMethodVariables } from '@firebasegen/adnlab-connector';

// The `CreateServiceMethod` mutation requires an argument of type `CreateServiceMethodVariables`:
const createServiceMethodVars: CreateServiceMethodVariables = {
  id: ..., 
  serviceId: ..., 
  methodId: ..., 
};

// Call the `createServiceMethodRef()` function to get a reference to the mutation.
const ref = createServiceMethodRef(createServiceMethodVars);
// Variables can be defined inline as well.
const ref = createServiceMethodRef({ id: ..., serviceId: ..., methodId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceMethodRef(dataConnect, createServiceMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceMethod_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceMethod_insert);
});
```

## DeleteServiceMethod
You can execute the `DeleteServiceMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteServiceMethod(vars: DeleteServiceMethodVariables): MutationPromise<DeleteServiceMethodData, DeleteServiceMethodVariables>;

interface DeleteServiceMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceMethodVariables): MutationRef<DeleteServiceMethodData, DeleteServiceMethodVariables>;
}
export const deleteServiceMethodRef: DeleteServiceMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServiceMethod(dc: DataConnect, vars: DeleteServiceMethodVariables): MutationPromise<DeleteServiceMethodData, DeleteServiceMethodVariables>;

interface DeleteServiceMethodRef {
  ...
  (dc: DataConnect, vars: DeleteServiceMethodVariables): MutationRef<DeleteServiceMethodData, DeleteServiceMethodVariables>;
}
export const deleteServiceMethodRef: DeleteServiceMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceMethodRef:
```typescript
const name = deleteServiceMethodRef.operationName;
console.log(name);
```

### Variables
The `DeleteServiceMethod` mutation requires an argument of type `DeleteServiceMethodVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceMethodVariables {
  serviceMethodId: string;
}
```
### Return Type
Recall that executing the `DeleteServiceMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceMethodData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceMethodData {
  serviceMethod_delete?: ServiceMethod_Key | null;
}
```
### Using `DeleteServiceMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServiceMethod, DeleteServiceMethodVariables } from '@firebasegen/adnlab-connector';

// The `DeleteServiceMethod` mutation requires an argument of type `DeleteServiceMethodVariables`:
const deleteServiceMethodVars: DeleteServiceMethodVariables = {
  serviceMethodId: ..., 
};

// Call the `deleteServiceMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServiceMethod(deleteServiceMethodVars);
// Variables can be defined inline as well.
const { data } = await deleteServiceMethod({ serviceMethodId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServiceMethod(dataConnect, deleteServiceMethodVars);

console.log(data.serviceMethod_delete);

// Or, you can use the `Promise` API.
deleteServiceMethod(deleteServiceMethodVars).then((response) => {
  const data = response.data;
  console.log(data.serviceMethod_delete);
});
```

### Using `DeleteServiceMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceMethodRef, DeleteServiceMethodVariables } from '@firebasegen/adnlab-connector';

// The `DeleteServiceMethod` mutation requires an argument of type `DeleteServiceMethodVariables`:
const deleteServiceMethodVars: DeleteServiceMethodVariables = {
  serviceMethodId: ..., 
};

// Call the `deleteServiceMethodRef()` function to get a reference to the mutation.
const ref = deleteServiceMethodRef(deleteServiceMethodVars);
// Variables can be defined inline as well.
const ref = deleteServiceMethodRef({ serviceMethodId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceMethodRef(dataConnect, deleteServiceMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceMethod_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceMethod_delete);
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
  notes: ..., // optional
};

// Call the `createTimeSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTimeSlot(createTimeSlotVars);
// Variables can be defined inline as well.
const { data } = await createTimeSlot({ id: ..., slotDate: ..., startTime: ..., endTime: ..., notes: ..., });

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
  notes: ..., // optional
};

// Call the `createTimeSlotRef()` function to get a reference to the mutation.
const ref = createTimeSlotRef(createTimeSlotVars);
// Variables can be defined inline as well.
const ref = createTimeSlotRef({ id: ..., slotDate: ..., startTime: ..., endTime: ..., notes: ..., });

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
  notes?: string | null;
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
  notes: ..., // optional
};

// Call the `updateTimeSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTimeSlot(updateTimeSlotVars);
// Variables can be defined inline as well.
const { data } = await updateTimeSlot({ timeSlotId: ..., slotDate: ..., startTime: ..., endTime: ..., notes: ..., });

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
  notes: ..., // optional
};

// Call the `updateTimeSlotRef()` function to get a reference to the mutation.
const ref = updateTimeSlotRef(updateTimeSlotVars);
// Variables can be defined inline as well.
const ref = updateTimeSlotRef({ timeSlotId: ..., slotDate: ..., startTime: ..., endTime: ..., notes: ..., });

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
  timeSlotId?: string | null;
  serviceMethodId: string;
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
  timeSlotId: ..., // optional
  serviceMethodId: ..., 
  totalAmount: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ id: ..., userId: ..., staffId: ..., timeSlotId: ..., serviceMethodId: ..., totalAmount: ..., });

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
  timeSlotId: ..., // optional
  serviceMethodId: ..., 
  totalAmount: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ id: ..., userId: ..., staffId: ..., timeSlotId: ..., serviceMethodId: ..., totalAmount: ..., });

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

## UpdateBooking
You can execute the `UpdateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingRef:
```typescript
const name = updateBookingRef.operationName;
console.log(name);
```

### Variables
The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingVariables {
  bookingId: string;
  staffId?: string | null;
  timeSlotId?: string | null;
  serviceMethodId?: string | null;
  totalAmount?: number | null;
}
```
### Return Type
Recall that executing the `UpdateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}
```
### Using `UpdateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBooking, UpdateBookingVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
const updateBookingVars: UpdateBookingVariables = {
  bookingId: ..., 
  staffId: ..., // optional
  timeSlotId: ..., // optional
  serviceMethodId: ..., // optional
  totalAmount: ..., // optional
};

// Call the `updateBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBooking(updateBookingVars);
// Variables can be defined inline as well.
const { data } = await updateBooking({ bookingId: ..., staffId: ..., timeSlotId: ..., serviceMethodId: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBooking(dataConnect, updateBookingVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
updateBooking(updateBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `UpdateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingRef, UpdateBookingVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
const updateBookingVars: UpdateBookingVariables = {
  bookingId: ..., 
  staffId: ..., // optional
  timeSlotId: ..., // optional
  serviceMethodId: ..., // optional
  totalAmount: ..., // optional
};

// Call the `updateBookingRef()` function to get a reference to the mutation.
const ref = updateBookingRef(updateBookingVars);
// Variables can be defined inline as well.
const ref = updateBookingRef({ bookingId: ..., staffId: ..., timeSlotId: ..., serviceMethodId: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingRef(dataConnect, updateBookingVars);

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

## CreateBookingHistory
You can execute the `CreateBookingHistory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBookingHistory(vars: CreateBookingHistoryVariables): MutationPromise<CreateBookingHistoryData, CreateBookingHistoryVariables>;

interface CreateBookingHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingHistoryVariables): MutationRef<CreateBookingHistoryData, CreateBookingHistoryVariables>;
}
export const createBookingHistoryRef: CreateBookingHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBookingHistory(dc: DataConnect, vars: CreateBookingHistoryVariables): MutationPromise<CreateBookingHistoryData, CreateBookingHistoryVariables>;

interface CreateBookingHistoryRef {
  ...
  (dc: DataConnect, vars: CreateBookingHistoryVariables): MutationRef<CreateBookingHistoryData, CreateBookingHistoryVariables>;
}
export const createBookingHistoryRef: CreateBookingHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingHistoryRef:
```typescript
const name = createBookingHistoryRef.operationName;
console.log(name);
```

### Variables
The `CreateBookingHistory` mutation requires an argument of type `CreateBookingHistoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingHistoryVariables {
  id: string;
  bookingId: string;
  description: string;
  status: string;
}
```
### Return Type
Recall that executing the `CreateBookingHistory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingHistoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingHistoryData {
  bookingHistory_insert: BookingHistory_Key;
}
```
### Using `CreateBookingHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBookingHistory, CreateBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `CreateBookingHistory` mutation requires an argument of type `CreateBookingHistoryVariables`:
const createBookingHistoryVars: CreateBookingHistoryVariables = {
  id: ..., 
  bookingId: ..., 
  description: ..., 
  status: ..., 
};

// Call the `createBookingHistory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBookingHistory(createBookingHistoryVars);
// Variables can be defined inline as well.
const { data } = await createBookingHistory({ id: ..., bookingId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBookingHistory(dataConnect, createBookingHistoryVars);

console.log(data.bookingHistory_insert);

// Or, you can use the `Promise` API.
createBookingHistory(createBookingHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.bookingHistory_insert);
});
```

### Using `CreateBookingHistory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingHistoryRef, CreateBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `CreateBookingHistory` mutation requires an argument of type `CreateBookingHistoryVariables`:
const createBookingHistoryVars: CreateBookingHistoryVariables = {
  id: ..., 
  bookingId: ..., 
  description: ..., 
  status: ..., 
};

// Call the `createBookingHistoryRef()` function to get a reference to the mutation.
const ref = createBookingHistoryRef(createBookingHistoryVars);
// Variables can be defined inline as well.
const ref = createBookingHistoryRef({ id: ..., bookingId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingHistoryRef(dataConnect, createBookingHistoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookingHistory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingHistory_insert);
});
```

## UpdateBookingHistory
You can execute the `UpdateBookingHistory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBookingHistory(vars: UpdateBookingHistoryVariables): MutationPromise<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;

interface UpdateBookingHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingHistoryVariables): MutationRef<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;
}
export const updateBookingHistoryRef: UpdateBookingHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBookingHistory(dc: DataConnect, vars: UpdateBookingHistoryVariables): MutationPromise<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;

interface UpdateBookingHistoryRef {
  ...
  (dc: DataConnect, vars: UpdateBookingHistoryVariables): MutationRef<UpdateBookingHistoryData, UpdateBookingHistoryVariables>;
}
export const updateBookingHistoryRef: UpdateBookingHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingHistoryRef:
```typescript
const name = updateBookingHistoryRef.operationName;
console.log(name);
```

### Variables
The `UpdateBookingHistory` mutation requires an argument of type `UpdateBookingHistoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingHistoryVariables {
  historyId: string;
  description?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBookingHistory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingHistoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingHistoryData {
  bookingHistory_update?: BookingHistory_Key | null;
}
```
### Using `UpdateBookingHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBookingHistory, UpdateBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingHistory` mutation requires an argument of type `UpdateBookingHistoryVariables`:
const updateBookingHistoryVars: UpdateBookingHistoryVariables = {
  historyId: ..., 
  description: ..., // optional
  status: ..., // optional
};

// Call the `updateBookingHistory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBookingHistory(updateBookingHistoryVars);
// Variables can be defined inline as well.
const { data } = await updateBookingHistory({ historyId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBookingHistory(dataConnect, updateBookingHistoryVars);

console.log(data.bookingHistory_update);

// Or, you can use the `Promise` API.
updateBookingHistory(updateBookingHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.bookingHistory_update);
});
```

### Using `UpdateBookingHistory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingHistoryRef, UpdateBookingHistoryVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBookingHistory` mutation requires an argument of type `UpdateBookingHistoryVariables`:
const updateBookingHistoryVars: UpdateBookingHistoryVariables = {
  historyId: ..., 
  description: ..., // optional
  status: ..., // optional
};

// Call the `updateBookingHistoryRef()` function to get a reference to the mutation.
const ref = updateBookingHistoryRef(updateBookingHistoryVars);
// Variables can be defined inline as well.
const ref = updateBookingHistoryRef({ historyId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingHistoryRef(dataConnect, updateBookingHistoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookingHistory_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookingHistory_update);
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
  staffId?: string | null;
  collectionDate?: DateString | null;
  status?: string | null;
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
  staffId: ..., // optional
  collectionDate: ..., // optional
  status: ..., // optional
  notes: ..., // optional
};

// Call the `createSample()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSample(createSampleVars);
// Variables can be defined inline as well.
const { data } = await createSample({ id: ..., bookingId: ..., staffId: ..., collectionDate: ..., status: ..., notes: ..., });

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
  staffId: ..., // optional
  collectionDate: ..., // optional
  status: ..., // optional
  notes: ..., // optional
};

// Call the `createSampleRef()` function to get a reference to the mutation.
const ref = createSampleRef(createSampleVars);
// Variables can be defined inline as well.
const ref = createSampleRef({ id: ..., bookingId: ..., staffId: ..., collectionDate: ..., status: ..., notes: ..., });

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
  staffId?: string | null;
  testDate?: DateString | null;
  reportDate?: DateString | null;
  resultData?: string | null;
  status?: string | null;
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
  staffId: ..., // optional
  testDate: ..., // optional
  reportDate: ..., // optional
  resultData: ..., // optional
  status: ..., // optional
};

// Call the `createTestResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTestResult(createTestResultVars);
// Variables can be defined inline as well.
const { data } = await createTestResult({ id: ..., bookingId: ..., sampleId: ..., staffId: ..., testDate: ..., reportDate: ..., resultData: ..., status: ..., });

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
  staffId: ..., // optional
  testDate: ..., // optional
  reportDate: ..., // optional
  resultData: ..., // optional
  status: ..., // optional
};

// Call the `createTestResultRef()` function to get a reference to the mutation.
const ref = createTestResultRef(createTestResultVars);
// Variables can be defined inline as well.
const ref = createTestResultRef({ id: ..., bookingId: ..., sampleId: ..., staffId: ..., testDate: ..., reportDate: ..., resultData: ..., status: ..., });

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
  testDate?: DateString | null;
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
  testDate: ..., // optional
};

// Call the `updateTestResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTestResult(updateTestResultVars);
// Variables can be defined inline as well.
const { data } = await updateTestResult({ resultId: ..., resultData: ..., status: ..., reportDate: ..., testDate: ..., });

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
  testDate: ..., // optional
};

// Call the `updateTestResultRef()` function to get a reference to the mutation.
const ref = updateTestResultRef(updateTestResultVars);
// Variables can be defined inline as well.
const ref = updateTestResultRef({ resultId: ..., resultData: ..., status: ..., reportDate: ..., testDate: ..., });

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

## AssignTestResultStaff
You can execute the `AssignTestResultStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
assignTestResultStaff(vars: AssignTestResultStaffVariables): MutationPromise<AssignTestResultStaffData, AssignTestResultStaffVariables>;

interface AssignTestResultStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignTestResultStaffVariables): MutationRef<AssignTestResultStaffData, AssignTestResultStaffVariables>;
}
export const assignTestResultStaffRef: AssignTestResultStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignTestResultStaff(dc: DataConnect, vars: AssignTestResultStaffVariables): MutationPromise<AssignTestResultStaffData, AssignTestResultStaffVariables>;

interface AssignTestResultStaffRef {
  ...
  (dc: DataConnect, vars: AssignTestResultStaffVariables): MutationRef<AssignTestResultStaffData, AssignTestResultStaffVariables>;
}
export const assignTestResultStaffRef: AssignTestResultStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignTestResultStaffRef:
```typescript
const name = assignTestResultStaffRef.operationName;
console.log(name);
```

### Variables
The `AssignTestResultStaff` mutation requires an argument of type `AssignTestResultStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignTestResultStaffVariables {
  resultId: string;
  staffId: string;
}
```
### Return Type
Recall that executing the `AssignTestResultStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignTestResultStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignTestResultStaffData {
  testResult_update?: TestResult_Key | null;
}
```
### Using `AssignTestResultStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignTestResultStaff, AssignTestResultStaffVariables } from '@firebasegen/adnlab-connector';

// The `AssignTestResultStaff` mutation requires an argument of type `AssignTestResultStaffVariables`:
const assignTestResultStaffVars: AssignTestResultStaffVariables = {
  resultId: ..., 
  staffId: ..., 
};

// Call the `assignTestResultStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignTestResultStaff(assignTestResultStaffVars);
// Variables can be defined inline as well.
const { data } = await assignTestResultStaff({ resultId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignTestResultStaff(dataConnect, assignTestResultStaffVars);

console.log(data.testResult_update);

// Or, you can use the `Promise` API.
assignTestResultStaff(assignTestResultStaffVars).then((response) => {
  const data = response.data;
  console.log(data.testResult_update);
});
```

### Using `AssignTestResultStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignTestResultStaffRef, AssignTestResultStaffVariables } from '@firebasegen/adnlab-connector';

// The `AssignTestResultStaff` mutation requires an argument of type `AssignTestResultStaffVariables`:
const assignTestResultStaffVars: AssignTestResultStaffVariables = {
  resultId: ..., 
  staffId: ..., 
};

// Call the `assignTestResultStaffRef()` function to get a reference to the mutation.
const ref = assignTestResultStaffRef(assignTestResultStaffVars);
// Variables can be defined inline as well.
const ref = assignTestResultStaffRef({ resultId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignTestResultStaffRef(dataConnect, assignTestResultStaffVars);

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
  status?: string | null;
  paymentDate?: DateString | null;
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
  status: ..., // optional
  paymentDate: ..., // optional
};

// Call the `createPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayment(createPaymentVars);
// Variables can be defined inline as well.
const { data } = await createPayment({ id: ..., bookingId: ..., amount: ..., paymentMethod: ..., status: ..., paymentDate: ..., });

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
  status: ..., // optional
  paymentDate: ..., // optional
};

// Call the `createPaymentRef()` function to get a reference to the mutation.
const ref = createPaymentRef(createPaymentVars);
// Variables can be defined inline as well.
const ref = createPaymentRef({ id: ..., bookingId: ..., amount: ..., paymentMethod: ..., status: ..., paymentDate: ..., });

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
  paymentDate?: DateString | null;
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
  paymentDate: ..., // optional
};

// Call the `updatePaymentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePaymentStatus(updatePaymentStatusVars);
// Variables can be defined inline as well.
const { data } = await updatePaymentStatus({ paymentId: ..., status: ..., paymentDate: ..., });

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
  paymentDate: ..., // optional
};

// Call the `updatePaymentStatusRef()` function to get a reference to the mutation.
const ref = updatePaymentStatusRef(updatePaymentStatusVars);
// Variables can be defined inline as well.
const ref = updatePaymentStatusRef({ paymentId: ..., status: ..., paymentDate: ..., });

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

## AddRefundDetail
You can execute the `AddRefundDetail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addRefundDetail(vars: AddRefundDetailVariables): MutationPromise<AddRefundDetailData, AddRefundDetailVariables>;

interface AddRefundDetailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddRefundDetailVariables): MutationRef<AddRefundDetailData, AddRefundDetailVariables>;
}
export const addRefundDetailRef: AddRefundDetailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addRefundDetail(dc: DataConnect, vars: AddRefundDetailVariables): MutationPromise<AddRefundDetailData, AddRefundDetailVariables>;

interface AddRefundDetailRef {
  ...
  (dc: DataConnect, vars: AddRefundDetailVariables): MutationRef<AddRefundDetailData, AddRefundDetailVariables>;
}
export const addRefundDetailRef: AddRefundDetailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addRefundDetailRef:
```typescript
const name = addRefundDetailRef.operationName;
console.log(name);
```

### Variables
The `AddRefundDetail` mutation requires an argument of type `AddRefundDetailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddRefundDetailVariables {
  paymentId: string;
  refundDetails: string[];
}
```
### Return Type
Recall that executing the `AddRefundDetail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddRefundDetailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddRefundDetailData {
  payment_update?: Payment_Key | null;
}
```
### Using `AddRefundDetail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addRefundDetail, AddRefundDetailVariables } from '@firebasegen/adnlab-connector';

// The `AddRefundDetail` mutation requires an argument of type `AddRefundDetailVariables`:
const addRefundDetailVars: AddRefundDetailVariables = {
  paymentId: ..., 
  refundDetails: ..., 
};

// Call the `addRefundDetail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addRefundDetail(addRefundDetailVars);
// Variables can be defined inline as well.
const { data } = await addRefundDetail({ paymentId: ..., refundDetails: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addRefundDetail(dataConnect, addRefundDetailVars);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
addRefundDetail(addRefundDetailVars).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

### Using `AddRefundDetail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addRefundDetailRef, AddRefundDetailVariables } from '@firebasegen/adnlab-connector';

// The `AddRefundDetail` mutation requires an argument of type `AddRefundDetailVariables`:
const addRefundDetailVars: AddRefundDetailVariables = {
  paymentId: ..., 
  refundDetails: ..., 
};

// Call the `addRefundDetailRef()` function to get a reference to the mutation.
const ref = addRefundDetailRef(addRefundDetailVars);
// Variables can be defined inline as well.
const ref = addRefundDetailRef({ paymentId: ..., refundDetails: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addRefundDetailRef(dataConnect, addRefundDetailVars);

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

## CreateBlog
You can execute the `CreateBlog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBlog(vars: CreateBlogVariables): MutationPromise<CreateBlogData, CreateBlogVariables>;

interface CreateBlogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBlogVariables): MutationRef<CreateBlogData, CreateBlogVariables>;
}
export const createBlogRef: CreateBlogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBlog(dc: DataConnect, vars: CreateBlogVariables): MutationPromise<CreateBlogData, CreateBlogVariables>;

interface CreateBlogRef {
  ...
  (dc: DataConnect, vars: CreateBlogVariables): MutationRef<CreateBlogData, CreateBlogVariables>;
}
export const createBlogRef: CreateBlogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBlogRef:
```typescript
const name = createBlogRef.operationName;
console.log(name);
```

### Variables
The `CreateBlog` mutation requires an argument of type `CreateBlogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBlogVariables {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateBlog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBlogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBlogData {
  blog_insert: Blog_Key;
}
```
### Using `CreateBlog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBlog, CreateBlogVariables } from '@firebasegen/adnlab-connector';

// The `CreateBlog` mutation requires an argument of type `CreateBlogVariables`:
const createBlogVars: CreateBlogVariables = {
  id: ..., 
  userId: ..., 
  content: ..., 
  imageUrl: ..., // optional
};

// Call the `createBlog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBlog(createBlogVars);
// Variables can be defined inline as well.
const { data } = await createBlog({ id: ..., userId: ..., content: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBlog(dataConnect, createBlogVars);

console.log(data.blog_insert);

// Or, you can use the `Promise` API.
createBlog(createBlogVars).then((response) => {
  const data = response.data;
  console.log(data.blog_insert);
});
```

### Using `CreateBlog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBlogRef, CreateBlogVariables } from '@firebasegen/adnlab-connector';

// The `CreateBlog` mutation requires an argument of type `CreateBlogVariables`:
const createBlogVars: CreateBlogVariables = {
  id: ..., 
  userId: ..., 
  content: ..., 
  imageUrl: ..., // optional
};

// Call the `createBlogRef()` function to get a reference to the mutation.
const ref = createBlogRef(createBlogVars);
// Variables can be defined inline as well.
const ref = createBlogRef({ id: ..., userId: ..., content: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBlogRef(dataConnect, createBlogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.blog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.blog_insert);
});
```

## UpdateBlog
You can execute the `UpdateBlog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBlog(vars: UpdateBlogVariables): MutationPromise<UpdateBlogData, UpdateBlogVariables>;

interface UpdateBlogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBlogVariables): MutationRef<UpdateBlogData, UpdateBlogVariables>;
}
export const updateBlogRef: UpdateBlogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBlog(dc: DataConnect, vars: UpdateBlogVariables): MutationPromise<UpdateBlogData, UpdateBlogVariables>;

interface UpdateBlogRef {
  ...
  (dc: DataConnect, vars: UpdateBlogVariables): MutationRef<UpdateBlogData, UpdateBlogVariables>;
}
export const updateBlogRef: UpdateBlogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBlogRef:
```typescript
const name = updateBlogRef.operationName;
console.log(name);
```

### Variables
The `UpdateBlog` mutation requires an argument of type `UpdateBlogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBlogVariables {
  blogId: string;
  content?: string | null;
  imageUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBlog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBlogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBlogData {
  blog_update?: Blog_Key | null;
}
```
### Using `UpdateBlog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBlog, UpdateBlogVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBlog` mutation requires an argument of type `UpdateBlogVariables`:
const updateBlogVars: UpdateBlogVariables = {
  blogId: ..., 
  content: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updateBlog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBlog(updateBlogVars);
// Variables can be defined inline as well.
const { data } = await updateBlog({ blogId: ..., content: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBlog(dataConnect, updateBlogVars);

console.log(data.blog_update);

// Or, you can use the `Promise` API.
updateBlog(updateBlogVars).then((response) => {
  const data = response.data;
  console.log(data.blog_update);
});
```

### Using `UpdateBlog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBlogRef, UpdateBlogVariables } from '@firebasegen/adnlab-connector';

// The `UpdateBlog` mutation requires an argument of type `UpdateBlogVariables`:
const updateBlogVars: UpdateBlogVariables = {
  blogId: ..., 
  content: ..., // optional
  imageUrl: ..., // optional
};

// Call the `updateBlogRef()` function to get a reference to the mutation.
const ref = updateBlogRef(updateBlogVars);
// Variables can be defined inline as well.
const ref = updateBlogRef({ blogId: ..., content: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBlogRef(dataConnect, updateBlogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.blog_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.blog_update);
});
```

## DeleteBlog
You can execute the `DeleteBlog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteBlog(vars: DeleteBlogVariables): MutationPromise<DeleteBlogData, DeleteBlogVariables>;

interface DeleteBlogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBlogVariables): MutationRef<DeleteBlogData, DeleteBlogVariables>;
}
export const deleteBlogRef: DeleteBlogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBlog(dc: DataConnect, vars: DeleteBlogVariables): MutationPromise<DeleteBlogData, DeleteBlogVariables>;

interface DeleteBlogRef {
  ...
  (dc: DataConnect, vars: DeleteBlogVariables): MutationRef<DeleteBlogData, DeleteBlogVariables>;
}
export const deleteBlogRef: DeleteBlogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBlogRef:
```typescript
const name = deleteBlogRef.operationName;
console.log(name);
```

### Variables
The `DeleteBlog` mutation requires an argument of type `DeleteBlogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBlogVariables {
  blogId: string;
}
```
### Return Type
Recall that executing the `DeleteBlog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBlogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBlogData {
  blog_delete?: Blog_Key | null;
}
```
### Using `DeleteBlog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBlog, DeleteBlogVariables } from '@firebasegen/adnlab-connector';

// The `DeleteBlog` mutation requires an argument of type `DeleteBlogVariables`:
const deleteBlogVars: DeleteBlogVariables = {
  blogId: ..., 
};

// Call the `deleteBlog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBlog(deleteBlogVars);
// Variables can be defined inline as well.
const { data } = await deleteBlog({ blogId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBlog(dataConnect, deleteBlogVars);

console.log(data.blog_delete);

// Or, you can use the `Promise` API.
deleteBlog(deleteBlogVars).then((response) => {
  const data = response.data;
  console.log(data.blog_delete);
});
```

### Using `DeleteBlog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBlogRef, DeleteBlogVariables } from '@firebasegen/adnlab-connector';

// The `DeleteBlog` mutation requires an argument of type `DeleteBlogVariables`:
const deleteBlogVars: DeleteBlogVariables = {
  blogId: ..., 
};

// Call the `deleteBlogRef()` function to get a reference to the mutation.
const ref = deleteBlogRef(deleteBlogVars);
// Variables can be defined inline as well.
const ref = deleteBlogRef({ blogId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBlogRef(dataConnect, deleteBlogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.blog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.blog_delete);
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

